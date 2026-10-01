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

One intervention is deliberate: libtest output is forced to the pretty format
(`test name ... ok`), also when the agent asked for `-q`. The phase chain judges
a green by *which* tests pass, and terse output prints dots instead of names.

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


def force_pretty(args):
    """Force libtest's pretty format so test names are printed.

    `cargo test -q` makes cargo pass `--quiet` to libtest, which prints dots.
    An explicit `--format pretty` after `--` overrides it on stable.
    """
    if "--" in args:
        k = args.index("--")
        harness = [a for a in args[k + 1:] if a not in ("-q", "--quiet")]
        harness = [a for a in harness if not a.startswith("--format")]
        return args[:k + 1] + harness + ["--format", "pretty"]
    return args + ["--", "--format", "pretty"]


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


def record(root, rc, lines):
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
            "failed_tests": failed,
            "passed_tests": passed,
            "duration_ms": None,
            "tree": snapshot_tree(root),
        }) + "\n")


def shim(args):
    try:
        recording = wants_record(args) and find_root(os.getcwd()) is not None
    except Exception:
        recording = False
    if not recording:
        os.execv(REAL_CARGO, [REAL_CARGO, *args])
    rc, lines = run_and_capture([REAL_CARGO, *force_pretty(args)])
    try:
        record(find_root(os.getcwd()), rc, lines)
    except Exception:
        # Recording failed. Losing one event is acceptable; failing the run is not.
        pass
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
