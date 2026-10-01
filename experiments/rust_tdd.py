#!/usr/bin/env python3
"""TDD event recording and test/implementation splitting for the rust-cargo stack.

Two jobs, one module, because both need the same answer to "which bytes of this
file are test code":

1. `shim` — the cargo wrapper installed as `/usr/local/bin/cargo` in the image.
   It passes every invocation through to the real cargo unchanged, and for
   `cargo test` it additionally appends one event to `tdd-events.jsonl` in the
   format `tdd-report.py` reads. It is the counterpart of `tdd-reporter.mjs`
   (TypeScript) and `conftest.py` (Python); the rationale for recording suite
   invocations at all lives there.

   Cargo has no stable reporter hook — libtest's JSON output is nightly-only,
   and `target.runner` in `.cargo/config.toml` never runs when the crate fails
   to compile, which would reproduce the Java stack's invisible `Red(c)`. A
   wrapper sees the compile failure, so it does not.

2. `split` — separates a `.rs` file into its implementation and its test part.
   Idiomatic Rust keeps unit tests inside the source file under
   `#[cfg(test)] mod tests { ... }`. `tdd-report.py` decides test versus
   implementation by path, so the reporter publishes each `.rs` file as two
   virtual entries: `src/x.rs` (implementation) and `src/x.rs#test` (test part).
   `analyze-run.sh` uses the same split for Production LoC, Test LoC and the
   complexity tools, so a test module never counts as production code.

The shim's hard constraints are the ones the other two reporters carry:

- Nothing extra on stdout or stderr. The agent sees cargo's own output.
- Nothing raises into the agent's command. Recording is guarded; a failure to
  record is dropped silently — a missing event is a measurement gap, a broken
  `cargo test` is corrupted data. cargo's exit code is passed through as is.
- `TDD_REPORTER_OFF` suppresses recording: the analysis pipeline and mutation
  testing run the suite too, and neither belongs in a record of what the agent
  did.

Two interventions are deliberate (see `instrument`): libtest output is forced
to the pretty format, also when the agent asked for `-q`, because the phase
chain judges a green by *which* tests pass and terse output prints dots; and
`--no-fail-fast` is added, so a failing test binary does not hide the rest of
the suite. Neither changes what passes or fails.

Usage:
  rust_tdd.py shim <cargo args...>     # what /usr/local/bin/cargo execs
  rust_tdd.py split <file.rs> impl     # print the implementation part
  rust_tdd.py split <file.rs> test     # print the test part
  rust_tdd.py split-tree <root> <dest> # write dest/impl/ and dest/test/
  rust_tdd.py tree <root>              # print the event tree snapshot
  rust_tdd.py coverage <root> <lcov>   # production-only line coverage, percent
"""
import hashlib
import json
import os
import re
import subprocess
import sys
import threading
from datetime import datetime, timezone
from pathlib import Path

REAL_CARGO = os.environ.get("LAB_REAL_CARGO", "/usr/local/cargo/bin/cargo")
EVENTS_FILE = "tdd-events.jsonl"
TEST_SUFFIX = "#test"
# The sources the agent authors. target/ and mutants.out would dominate the walk
# and say nothing about the exercise.
ROOTS = ("src", "tests", "benches", "examples")
SKIP_DIRS = {"target", ".git", "mutants.out", "mutants.out.old", "node_modules"}
# Directories whose .rs files are test code in their entirety.
WHOLE_TEST_ROOTS = ("tests",)

# --------------------------------------------------------------------------
# Splitting
# --------------------------------------------------------------------------

# An attribute that makes the following item test-only.
TEST_ATTR = re.compile(r"#\s*\[\s*(cfg\s*\(\s*test\s*\)|test)\s*\]")


def _skip_ws_comment(s, i):
    n = len(s)
    while i < n:
        if s[i].isspace():
            i += 1
        elif s.startswith("//", i):
            j = s.find("\n", i)
            i = n if j < 0 else j + 1
        elif s.startswith("/*", i):
            i = _skip_block_comment(s, i)
        else:
            break
    return i


def _skip_block_comment(s, i):
    depth, i, n = 0, i, len(s)
    while i < n:
        if s.startswith("/*", i):
            depth += 1
            i += 2
        elif s.startswith("*/", i):
            depth -= 1
            i += 2
            if depth == 0:
                return i
        else:
            i += 1
    return n


def _skip_literal(s, i):
    """If s[i] starts a string/char literal or comment, return its end; else None."""
    n = len(s)
    c = s[i]
    if s.startswith("//", i) or s.startswith("/*", i):
        return _skip_ws_comment(s, i)
    # raw strings: r"..", r#".."#, br#".."#
    m = re.match(r'b?r(#*)"', s[i:i + 300])
    if m and (i == 0 or not (s[i - 1].isalnum() or s[i - 1] == "_")):
        close = '"' + m.group(1)
        j = s.find(close, i + m.end())
        return n if j < 0 else j + len(close)
    if c == '"' or (c == "b" and s.startswith('b"', i)):
        j = i + (2 if c == "b" else 1)
        while j < n:
            if s[j] == "\\":
                j += 2
            elif s[j] == '"':
                return j + 1
            else:
                j += 1
        return n
    if c == "'":
        # char literal vs lifetime: 'a' / '\n' / '\u{..}' are literals, 'a is a lifetime
        m = re.match(r"'(\\(u\{[0-9a-fA-F]+\}|x[0-9a-fA-F]{2}|.)|[^\\'])'", s[i:i + 12])
        if m:
            return i + m.end()
        return i + 1
    return None


def _item_end(s, i):
    """End offset of the item starting at i: a `;` at depth 0 before any brace,
    or the brace that closes the item's first block."""
    n, depth, seen_brace = len(s), 0, False
    while i < n:
        end = _skip_literal(s, i)
        if end is not None and end > i:
            i = end
            continue
        c = s[i]
        if c in "([{":
            if c == "{":
                seen_brace = True
            depth += 1
        elif c in ")]}":
            depth -= 1
            if depth == 0 and c == "}" and seen_brace:
                return i + 1
            if depth < 0:
                return i
        elif c == ";" and depth == 0:
            return i + 1
        i += 1
    return n


def test_regions(s):
    """[(start, end)] of every test-only item: the attribute through the item's end."""
    regions, i, n = [], 0, len(s)
    while i < n:
        end = _skip_literal(s, i)
        if end is not None and end > i:
            i = end
            continue
        if s[i] == "#":
            m = TEST_ATTR.match(s, i)
            if m:
                j = _skip_ws_comment(s, m.end())
                # further attributes stacked on the same item
                while j < n and s[j] == "#":
                    k = _item_attr_end(s, j)
                    j = _skip_ws_comment(s, k)
                e = _item_end(s, j)
                regions.append((i, e))
                i = e
                continue
        i += 1
    return regions


def _item_attr_end(s, i):
    # `#[...]` or `#![...]`: match the bracket
    j = s.find("[", i)
    if j < 0:
        return len(s)
    depth = 0
    while j < len(s):
        end = _skip_literal(s, j)
        if end is not None and end > j:
            j = end
            continue
        if s[j] == "[":
            depth += 1
        elif s[j] == "]":
            depth -= 1
            if depth == 0:
                return j + 1
        j += 1
    return len(s)


def split(text):
    """(implementation, test) for one Rust source text.

    Removed regions keep their newlines in neither part, so line counts of the
    two parts add up to the file. A test region is replaced by nothing in the
    implementation part; its own text goes to the test part.
    """
    regions = test_regions(text)
    impl, test, pos = [], [], 0
    for a, b in regions:
        impl.append(text[pos:a])
        test.append(text[a:b] + "\n")
        pos = b
    impl.append(text[pos:])
    return "".join(impl), "".join(test)


def is_whole_test(rel):
    return rel.split("/", 1)[0] in WHOLE_TEST_ROOTS


def external_test_modules(root):
    """Files that are test code because a `#[cfg(test)] mod x;` declares them."""
    out = set()
    for p in _rs_files(root):
        try:
            text = p.read_text(encoding="utf-8", errors="replace")
        except OSError:
            continue
        for a, b in test_regions(text):
            m = re.search(r"\bmod\s+([A-Za-z_][A-Za-z0-9_]*)\s*;", text[a:b])
            if not m:
                continue
            name = m.group(1)
            base = p.parent if p.name in ("mod.rs", "lib.rs", "main.rs") else p.parent / p.stem
            for cand in (base / f"{name}.rs", base / name / "mod.rs"):
                if cand.is_file():
                    out.add(cand.resolve())
    return out


def _rs_files(root):
    for r in ROOTS:
        base = root / r
        if not base.is_dir():
            continue
        for p in sorted(base.rglob("*")):
            if not p.is_file() or p.name.startswith("."):
                continue
            if any(part in SKIP_DIRS for part in p.relative_to(root).parts):
                continue
            yield p


def parts_of(root):
    """{virtual_path: text} for every authored source file under root."""
    root = Path(root)
    ext_tests = external_test_modules(root)
    out = {}
    for p in _rs_files(root):
        rel = p.relative_to(root).as_posix()
        try:
            text = p.read_bytes().decode("utf-8", "replace")
        except OSError:
            continue          # unreadable mid-write: skip the file, keep the event
        if p.suffix != ".rs":
            out[rel] = text
        elif is_whole_test(rel) or p.resolve() in ext_tests:
            out[rel + TEST_SUFFIX] = text
        else:
            impl, test = split(text)
            if impl.strip():
                out[rel] = impl
            if test.strip():
                out[rel + TEST_SUFFIX] = test
    return out


def snapshot_tree(root):
    tree = {}
    for rel, text in parts_of(root).items():
        raw = text.encode("utf-8")
        tree[rel] = {
            "sha256": hashlib.sha256(raw).hexdigest()[:16],
            "bytes": len(raw),
            "lines": text.count("\n") + 1,
        }
    return tree


def split_tree(root, dest):
    """Materialise the split: dest/impl/<path> and dest/test/<path>.

    analyze-run.sh runs its file-based metrics (LoC, Code Mass, function
    lengths, rust-code-analysis) over these copies. The tools have no notion
    of `#[cfg(test)]`; fed the raw files they would score test functions as
    production code. Only .rs files are written.
    """
    import shutil
    dest = Path(dest)
    shutil.rmtree(dest, ignore_errors=True)
    for rel, text in parts_of(root).items():
        if rel.endswith(TEST_SUFFIX):
            out = dest / "test" / rel[:-len(TEST_SUFFIX)]
        elif rel.endswith(".rs") and rel.startswith("src/"):
            out = dest / "impl" / rel
        else:
            continue
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(text, encoding="utf-8")


def impl_line_coverage(root, lcov_path):
    """Line coverage of production code only, as an integer percent, or None.

    cargo-llvm-cov reports per file, and an inline `#[cfg(test)]` module is in
    the same file as the code it tests — test lines are executed by definition
    and would inflate the number. The splitter knows the test regions, so the
    lcov `DA:` records inside them are dropped. `tests/` files and external
    test modules are dropped whole.
    """
    root = Path(root).resolve()
    ext_tests = external_test_modules(root)
    hit = total = 0
    cur, skip_lines, skip_file = None, set(), False
    for line in Path(lcov_path).read_text().splitlines():
        if line.startswith("SF:"):
            cur = Path(line[3:]).resolve()
            skip_lines, skip_file = set(), False
            try:
                rel = cur.relative_to(root).as_posix()
            except ValueError:
                skip_file = True
                continue
            if not rel.startswith("src/") or cur in ext_tests:
                skip_file = True
                continue
            text = cur.read_text(encoding="utf-8", errors="replace")
            for a, b in test_regions(text):
                first = text.count("\n", 0, a) + 1
                last = text.count("\n", 0, b) + 1
                skip_lines.update(range(first, last + 1))
        elif line.startswith("DA:") and cur is not None and not skip_file:
            n, count = line[3:].split(",")[:2]
            if int(n) in skip_lines:
                continue
            total += 1
            hit += int(count) > 0
    return int(100 * hit / total) if total else None


# --------------------------------------------------------------------------
# Shim
# --------------------------------------------------------------------------

# cargo's global flags that take a value and may precede the subcommand.
_VALUE_FLAGS = {"--config", "-C", "-Z", "--color", "--manifest-path"}
TEST_LINE = re.compile(r"^test (.+?) \.\.\. (ok|FAILED|ignored)\b")
# cargo prints this once per crate target that failed to build, for type errors
# and syntax errors alike. A bare `^error:` would also match cargo's
# "error: test failed, to rerun pass `--lib`" after an ordinary failing test,
# and read a behavioral red as a compile red.
COMPILE_FAIL = re.compile(r"^error: could not compile ")


def subcommand_index(args):
    i = 0
    while i < len(args):
        a = args[i]
        if a.startswith("+"):              # cargo +toolchain test
            i += 1
        elif a in _VALUE_FLAGS:
            i += 2
        elif a.startswith("-"):
            i += 1
        else:
            return i
    return None


def wants_record(args):
    if os.environ.get("TDD_REPORTER_OFF"):
        return False
    i = subcommand_index(args)
    if i is None or args[i] not in ("test", "t"):
        return False
    rest = args[i + 1:]
    harness = rest[rest.index("--") + 1:] if "--" in rest else []
    cargo_side = rest[:rest.index("--")] if "--" in rest else rest
    if "--no-run" in cargo_side or "--help" in cargo_side or "-h" in cargo_side:
        return False
    if "--list" in harness:
        return False
    return True


# cargo-side flags of `cargo test` that do not change which tests run. Anything
# else on the cargo side — a target selector (--lib, --bin, --test, --doc, ...)
# or a positional name filter — makes the invocation partial.
_NEUTRAL = {"-q", "--quiet", "-v", "-vv", "--verbose", "--offline", "--frozen",
            "--locked", "--release", "--no-fail-fast", "--all-features",
            "--no-default-features", "--workspace", "--message-format"}
_NEUTRAL_WITH_VALUE = {"--color", "-j", "--jobs", "--features", "-F",
                       "--profile", "--target-dir", "--config", "-Z",
                       "--message-format", "--manifest-path"}
# libtest-side flags that change the selection.
_HARNESS_SELECTING = {"--exact", "--skip", "--ignored"}


def is_partial(args):
    """Did this invocation run less than the whole suite?

    A filtered run (`cargo test --lib`, `cargo test some_name`) reports fewer
    tests than the suite holds. tdd-report.py would otherwise read the smaller
    count as tests deleted and label the step `Drop`. Seen in the first real
    Rust run: the agent alternated `cargo test --lib` (9 tests) and
    `cargo test` (12), and two of its five deviations were that artefact.
    """
    i = subcommand_index(args)
    rest = args[i + 1:] if i is not None else []
    cargo_side = rest[:rest.index("--")] if "--" in rest else rest
    harness = rest[rest.index("--") + 1:] if "--" in rest else []
    j = 0
    while j < len(cargo_side):
        a = cargo_side[j]
        if a in _NEUTRAL_WITH_VALUE:
            j += 2
            continue
        if a.split("=", 1)[0] in _NEUTRAL | _NEUTRAL_WITH_VALUE:
            j += 1
            continue
        return True                  # a target selector or a name filter
    k = 0
    while k < len(harness):
        a = harness[k]
        if a in _HARNESS_SELECTING or a.startswith("--skip="):
            return True
        if a == "--format" or a in ("--test-threads", "--color"):
            k += 2
            continue
        if not a.startswith("-"):
            return True              # a positional name filter
        k += 1
    return False


def instrument(args):
    """The arguments actually passed to cargo.

    Two interventions, both invisible in what the suite decides:

    - libtest's pretty format, so test names are printed. `cargo test -q`
      makes cargo pass `--quiet` to libtest, which prints dots; an explicit
      `--format pretty` after `--` overrides it on stable.
    - `--no-fail-fast`. Without it cargo stops at the first failing test
      binary and never runs the rest, so a red event under-reports the suite
      and its smaller count reads like deleted tests.
    """
    i = subcommand_index(args)
    head, rest = args[:i + 1], args[i + 1:]
    if "--" in rest:
        k = rest.index("--")
        cargo_side, harness = rest[:k], rest[k + 1:]
    else:
        cargo_side, harness = rest, []
    if "--no-fail-fast" not in cargo_side:
        cargo_side = cargo_side + ["--no-fail-fast"]
    harness = [a for a in harness if a not in ("-q", "--quiet")]
    out, k = [], 0
    while k < len(harness):
        if harness[k] == "--format":
            k += 2
            continue
        if harness[k].startswith("--format="):
            k += 1
            continue
        out.append(harness[k])
        k += 1
    return head + cargo_side + ["--"] + out + ["--format", "pretty"]


def find_root(start):
    p = Path(start).resolve()
    for d in (p, *p.parents):
        if (d / "Cargo.toml").is_file():
            return d
    return None


def run_and_capture(cmd):
    """Run cmd, forwarding stdout/stderr live, and return (rc, merged lines)."""
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    merged, lock = [], threading.Lock()

    def pump(src, dst):
        for raw in iter(src.readline, b""):
            dst.buffer.write(raw)
            dst.buffer.flush()
            with lock:
                merged.append(raw.decode("utf-8", "replace").rstrip("\n"))

    ts = [threading.Thread(target=pump, args=(proc.stdout, sys.stdout)),
          threading.Thread(target=pump, args=(proc.stderr, sys.stderr))]
    for t in ts:
        t.start()
    rc = proc.wait()
    for t in ts:
        t.join()
    return rc, merged


def parse(lines):
    """Outcomes per test name and the compile-error count.

    Names carry no target prefix (lib, bin, `tests/x.rs`). cargo prints the
    `Running ...` line that would supply it only without `-q`, and a name that
    changes with the agent's flags would read to tdd-report.py as one test
    vanishing and another arriving. On a collision between targets a failure
    wins: the suite did fail, whichever binary it was.
    """
    outcomes, compile_errors = {}, 0
    rank = {"failed": 2, "passed": 1, "skipped": 0}
    for line in lines:
        m = TEST_LINE.match(line)
        if m:
            name = m.group(1)
            res = {"ok": "passed", "FAILED": "failed", "ignored": "skipped"}[m.group(2)]
            if rank[res] >= rank.get(outcomes.get(name), -1):
                outcomes[name] = res
            continue
        if COMPILE_FAIL.search(line):
            compile_errors += 1
    return outcomes, compile_errors


def record(root, rc, lines, partial=False):
    outcomes, compile_errors = parse(lines)
    passed = sorted(n for n, o in outcomes.items() if o == "passed")
    failed = sorted(n for n, o in outcomes.items() if o == "failed")
    skipped = [n for n, o in outcomes.items() if o == "skipped"]
    # A non-zero exit with no failed test and no compile error is a harness
    # that died without reporting (a panic outside a test, a killed binary).
    # It is a failure the counts cannot see, so it goes into files_failed.
    files_failed = int(rc != 0 and not failed and not compile_errors)
    events = root / EVENTS_FILE
    try:
        seq = sum(1 for line in events.read_text().splitlines() if line.strip()) + 1
    except OSError:
        seq = 1
    with events.open("a", encoding="utf-8") as fh:
        fh.write(json.dumps({
            "seq": seq,
            "ts": datetime.now(timezone.utc).isoformat(),
            "suite_failed": bool(rc != 0),
            "tests": {"passed": len(passed), "failed": len(failed),
                      "skipped": len(skipped), "total": len(outcomes)},
            "collection_errors": compile_errors,
            "files_failed": files_failed,
            # A filtered invocation; tdd-report.py does not read its smaller
            # test count as deleted tests.
            "partial": partial,
            "failed_tests": failed,
            "passed_tests": passed,
            "duration_ms": None,
            "tree": snapshot_tree(root),
        }) + "\n")


DIAG_FILE = "tdd-shim-diag.log"


def _is_test_shaped(args):
    """`cargo test ...` by position, ignoring every record/skip decision."""
    try:
        i = subcommand_index(args)
        return i is not None and args[i] in ("test", "t")
    except Exception:
        return False


def _diag(reason):
    """Leave a breadcrumb when an invocation that SHOULD have recorded did not.

    The two swallow points below must never fail a run, which used to mean they
    left no trace either: a run then arrived with no tdd-events.jsonl at all and
    every TDD-discipline column silently null (seen 2026-10-01 in two
    exact-ptdd-v1.1-refactor-subagent-pi runs, cause unreconstructible). This
    writes the reason next to the events file instead. Best-effort by the same
    rule: a diagnostic that throws would reintroduce the bug it documents.
    Nothing is written for the ordinary non-recording case (cargo clippy, build,
    fmt, --no-run) -- only for an invocation that wanted to record and could not.
    """
    try:
        root = find_root(os.getcwd()) or Path(os.getcwd())
        with (root / DIAG_FILE).open("a", encoding="utf-8") as fh:
            fh.write(json.dumps({
                "ts": datetime.now(timezone.utc).isoformat(),
                "cwd": os.getcwd(),
                "argv": sys.argv[2:],
                "reason": reason,
            }) + "\n")
    except Exception:
        pass


def shim(args):
    try:
        wanted = wants_record(args)
        root = find_root(os.getcwd())
        recording = wanted and root is not None
        # Log every test-shaped invocation, including the ones that decline to
        # record. Declining is the branch that loses a whole run's events
        # without a trace, so staying silent here is exactly the blind spot
        # that made the 2026-10-01 case unreconstructible.
        if _is_test_shaped(args):
            _diag("recording" if recording else (
                "no Cargo.toml in cwd or any parent" if wanted
                else "declined: TDD_REPORTER_OFF"
                     if os.environ.get("TDD_REPORTER_OFF")
                     else "declined by wants_record"))
    except Exception as exc:
        recording = False
        _diag(f"gate raised {type(exc).__name__}: {exc}")
    if not recording:
        os.execv(REAL_CARGO, [REAL_CARGO, *args])
    rc, lines = run_and_capture([REAL_CARGO, *instrument(args)])
    try:
        record(find_root(os.getcwd()), rc, lines, is_partial(args))
    except Exception as exc:
        # Recording failed. Losing one event is acceptable; failing the run is
        # not -- but the reason is now on record.
        _diag(f"record raised {type(exc).__name__}: {exc}")
    return rc


def main(argv):
    if len(argv) >= 1 and argv[0] == "shim":
        return shim(argv[1:])
    if len(argv) == 3 and argv[0] == "split":
        impl, test = split(Path(argv[1]).read_text(encoding="utf-8", errors="replace"))
        sys.stdout.write(impl if argv[2] == "impl" else test)
        return 0
    if len(argv) == 3 and argv[0] == "split-tree":
        split_tree(argv[1], argv[2])
        return 0
    if len(argv) == 3 and argv[0] == "coverage":
        pct = impl_line_coverage(argv[1], argv[2])
        print("" if pct is None else pct)
        return 0
    if len(argv) == 2 and argv[0] == "tree":
        print(json.dumps(snapshot_tree(Path(argv[1])), indent=1))
        return 0
    sys.stderr.write(__doc__)
    return 2


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
