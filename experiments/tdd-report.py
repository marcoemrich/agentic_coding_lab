"""Render the TDD phase chain of one run as a readable report.

Input is `tdd-events.jsonl`, written by the stack's test reporter — one event
per suite invocation, carrying the outcome, the test names, and a content hash
per source file. The phase of an event is not declared by the workflow; it is
derived from what changed since the previous invocation and what the suite then
did. That is what makes the chain identical across workflows, harnesses and edit
mechanisms: nothing here reads a marker, a tool call or a commit.

    Red -> Green -> Refactor -> Refactor -> Red -> Green

The vocabulary is deliberately wider than red/green/refactor, because the
interesting runs are the ones that do something else. A chain that reads
Red -> Red -> Red -> Red never closed a cycle; one that reads
Both -> Both -> Both wrote test and implementation together every time and
never saw a verified failure. Collapsing those into "red" would hide exactly
the finding.

Usage:
  ./tdd-report.py <run-dir>              # markdown to stdout
  ./tdd-report.py <run-dir> --chain      # just the one-line chain
  ./tdd-report.py <run-dir> -o FILE      # write to FILE
"""
import argparse, json, re, sys
from pathlib import Path

TEST_MARKERS = (".spec.", ".test.", "_test.", "test_")
# A virtual tree entry for the test part of a file that holds both. The Rust
# reporter (rust_tdd.py) publishes `src/x.rs` and `src/x.rs#test` separately,
# because Rust unit tests live inside the source file under `#[cfg(test)]`.
SPLIT_TEST_SUFFIX = "#test"


def is_test(path):
    p = path.lower()
    if p.endswith(SPLIT_TEST_SUFFIX):
        return True
    return any(m in p for m in TEST_MARKERS) or "/test/" in p or p.startswith("test/")


# Verification tests: written to confirm behaviour the TDD part already built,
# so they are *expected* to arrive green. A test-list workflow puts them after
# the tests that drive the implementation, and the discipline score stops where
# they begin — a green arrival there is the plan working, not a `Skip`.
#
# Recognised by a container named "verification", never by the leaf name: a
# TDD test may well be called `test_verification_of_input`. The container is
# whatever the stack groups by, and each reporter already writes the full path:
#   vitest   `src/x.spec.ts > verification > ...`      describe("verification")
#   pytest   `tests/x.py::TestVerification::test_a`    class TestVerification
#   JUnit    `[...]/[nested-class:Verification] > a()` @Nested class Verification
#   cargo    `tests::verification::a`                  mod verification
SEGMENT_SPLIT = re.compile(r" > |::|/")


def _container_is_verification(seg):
    seg = seg.strip("[]").rsplit(":", 1)[-1]        # JUnit `[nested-class:X]`
    seg = re.sub(r"\.\w+$", "", seg)                # file extension
    s = re.sub(r"[\s_-]", "", seg.lower())
    s = re.sub(r"^tests?", "", s)
    s = re.sub(r"tests?$", "", s)
    return s == "verification"


def is_verification(name):
    return any(_container_is_verification(s) for s in SEGMENT_SPLIT.split(name)[:-1])


# label -> (symbol, meaning). `ok` marks the four labels that make up a healthy
# cycle; everything else is a deviation worth seeing in the chain.
LABELS = {
    "Red":      ("Red",      "a new failing test arrived",                         True),
    "Green":    ("Green",    "implementation changed, suite went green",           True),
    "Refactor": ("Refactor", "implementation changed, suite stayed green",         True),
    "Verify":   ("Verify",   "nothing changed, suite re-run",                      True),
    "Red(c)":   ("Red(c)",   "test arrived, suite does not compile yet",           True),
    "Green?":   ("Green?",   "implementation changed, still failing",              False),
    "Green?(c)": ("Green?(c)", "implementation changed, does not compile",         False),
    "Break(c)": ("Break(c)", "implementation change broke compilation of a green suite", False),
    "Both":     ("Both",     "test and implementation changed together — no verified red", False),
    "Skip":     ("Skip",     "test arrived and passed immediately — never red",    False),
    "Verified": ("Verified", "verification test arrived and passed, as planned",   True),
    "Drop":     ("Drop",     "tests were removed",                                 False),
    "Break":    ("Break",    "implementation change broke a green suite",          False),
    "Start":    ("Start",    "first invocation",                                   True),
}


def changed_files(prev, cur):
    pt, ct = (prev or {}).get("tree", {}), cur.get("tree", {})
    out = []
    for p in sorted(set(pt) | set(ct)):
        if pt.get(p, {}).get("sha256") != ct.get(p, {}).get("sha256"):
            out.append(p)
    return out


def classify(prev, cur, state):
    """Phase label for `cur`, given its predecessor and the carried state.

    Classification is relative to the **set of tests this cycle is about**, not
    to the global suite flag. That distinction is load-bearing: a run that
    leaves one unrelated test failing — a different feature, a test the agent
    never came back to — keeps `suite_failed` true for the rest of the run, so
    a global check labels every later implementation step `Green?` and drives
    `cycles_closed` to 0 on a run doing textbook TDD on the current test.
    Measured on a six-invocation fixture: the global check read
    `Red -> Red(c) -> Green? -> Red -> Green? -> Green?` where two cycles had
    in fact closed cleanly.

    `state["open"]` holds the tests that went red when the current cycle
    opened; a green is "the tests this cycle introduced now pass", whatever
    else is broken. `state["clean"]` is the failing set as of the last
    invocation that could report names at all — an invocation with collection
    errors reports none, and must not be mistaken for "nothing is failing".
    """
    changed = changed_files(prev, cur)
    compile_broken = bool(cur.get("collection_errors"))
    now_failing = _names(cur, "failed_tests")
    now_passing = _names(cur, "passed_tests")
    clean, open_set = state["clean"], state["open"]

    def commit(label, new_open=None, record_clean=True):
        if new_open is not None:
            state["open"] = new_open
        if record_clean and not compile_broken:
            state["clean"] = now_failing
        return label, changed

    if prev is None:
        # No predecessor to diff against. A first invocation that already
        # passes means tests and implementation both existed before anything
        # ran — the big-bang opening, which `Red` would misreport.
        if suite_failed_of(cur):
            if compile_broken:
                state["pending_red"] = True
            return commit("Red(c)" if compile_broken else "Red", now_failing)
        return commit("Start", set())

    test_ch = [q for q in changed if is_test(q)]
    impl_ch = [q for q in changed if not is_test(q)]
    # The count a smaller suite is measured against: the last invocation that
    # ran the whole suite. A filtered run (`cargo test --lib`, `pytest -k`)
    # reports fewer tests without any being deleted, so it neither serves as
    # the reference nor can itself be a `Drop`. Reporters that do not mark
    # filtered runs leave `partial` absent, and the reference is then the
    # predecessor, exactly as before the field existed.
    n_prev = state.get("full_total")
    if n_prev is None:
        n_prev = (prev.get("tests") or {}).get("total") or 0
    n_cur = (cur.get("tests") or {}).get("total") or 0

    if not changed:
        return commit("Verify")
    if test_ch and impl_ch:
        return commit("Both", set())

    # A pending red from a `Red(c)`: the test was written, nothing compiled, so
    # no name was readable and `open` stayed empty. The next invocation that
    # can report names is that same red becoming visible — typically after a
    # stub makes the code compile so the assertion can fail, which is step two
    # of a two-step red phase. Without this, that step reads as `Break`
    # ("broke a green suite") when nothing was ever green.
    # It does not double-count: cycles() opens a cycle only on a red whose
    # predecessor's suite was passing, and the predecessor here was failing.
    if state.get("pending_red") and not compile_broken:
        grew = now_failing - clean
        if grew:
            state["pending_red"] = False
            return commit("Red", grew)
        # The stub that made it compile also made it pass. The pending red is
        # closed, not absent — labelling this `Refactor` (the impl-only branch
        # below, with nothing open) claimed a green suite was tidied when in
        # fact the cycle just completed. Seen as `Red(c) -> Refactor` at the
        # opening of a TCR run.
        if not suite_failed_of(cur) and now_passing - _names(prev, "passed_tests"):
            state["pending_red"] = False
            return commit("Green", set())
    if test_ch:
        if compile_broken:
            # Step one of a two-step red: the test is in, the code does not
            # compile, no names are readable. Leave `open` for the next clean
            # invocation to fill, and do not overwrite `clean`.
            state["pending_red"] = True
            return commit("Red(c)", record_clean=False)
        grew = now_failing - clean
        if grew:
            # Only the tests this red introduced, not an accumulation. A cycle
            # is about the test just written; an older failure the agent never
            # returned to is a different problem, and carrying it forward would
            # make every later cycle unclosable. `ends_green` and `deviations`
            # are where a permanently red test shows up.
            return commit("Red", grew)
        dropped = n_cur < n_prev and not cur.get("partial")
        if dropped:
            return commit("Drop", set())
        arrived = (now_passing | now_failing) - state["seen"]
        if arrived and all(is_verification(n) for n in arrived):
            return commit("Verified", set())
        return commit("Skip", set())

    # implementation only
    if compile_broken:
        return commit("Green?(c)" if open_set else "Break(c)", record_clean=False)
    if open_set:
        if open_set <= now_passing:
            return commit("Green", set())
        return commit("Green?")
    # nothing open: did this change disturb a suite that was settled?
    if now_failing - clean:
        return commit("Break", now_failing - clean)
    return commit("Refactor")

def build(events):
    rows, prev = [], None
    # Carried across events because a cycle spans several invocations:
    # `open` = the tests the current cycle put in the red, `clean` = the
    # failing set as last actually observed.
    # `full_total` = test count of the last invocation not marked partial.
    # `seen` = every test name that has run so far; a name outside it at an
    # event is a test that arrived there.
    state = {"open": set(), "clean": set(), "pending_red": False, "full_total": None,
             "seen": set()}
    for ev in events:
        label, changed = classify(prev, ev, state)
        ran = _names(ev, "passed_tests") | _names(ev, "failed_tests")
        rows.append({"ev": ev, "label": label, "changed": changed,
                     "arrived": ran - state["seen"]})
        state["seen"] |= ran
        if not ev.get("partial"):
            state["full_total"] = (ev.get("tests") or {}).get("total") or 0
        prev = ev
    return rows


def verification_cutoff(rows):
    """Index of the first row at which a verification test arrived, else len.

    Everything before it is the TDD part and is what the discipline score
    reads. A verification test arriving red cuts here too: it was planned as
    verification, so its cycle belongs to the verification part and shows up
    in `verification_red`, not in the score.
    """
    for i, r in enumerate(rows):
        if any(is_verification(n) for n in r["arrived"]):
            return i
    return len(rows)


def chain(rows, collapse_verify=True):
    labels = [r["label"] for r in rows]
    if collapse_verify:
        labels = [l for i, l in enumerate(labels)
                  if l != "Verify" or i == 0 or labels[i - 1] != "Verify"]
    return " -> ".join(labels)


CYCLE_OPENERS = ("Red", "Red(c)", "Both", "Skip")


def cycles(rows):
    """Group the chain into cycles for a readable summary of a long run.

    A cycle opens at the first test-touching label that follows a green suite
    (or at the very start) and runs until the next such label. Everything in
    between — the green attempts, the compile steps, the trailing refactors —
    belongs to that cycle. This is presentation only: no label is merged or
    dropped, so the full chain above stays authoritative.
    """
    out, cur = [], []
    for i, r in enumerate(rows):
        opens = r["label"] in CYCLE_OPENERS and (
            i == 0 or not suite_failed_of(rows[i - 1]["ev"]))
        if opens and cur:
            out.append(cur)
            cur = []
        cur.append(r)
    if cur:
        out.append(cur)
    return out


def suite_failed_of(ev):
    """Did this invocation fail? Derived from the counts, not from the flag.

    The reporter stores a `suite_failed` flag, but the rule behind it belongs
    here: an event stream cannot be regenerated, so a correction to the rule
    must reach streams already on disk. The flag is the fallback for an event
    that carries no counts.

    A suite fails if a test failed, if a file could not be collected, if any
    file is marked failed, or if tests were declared and none of them ran. The
    last case was the defect this function exists for: when the module under
    test does not exist yet the import throws, every `it` stays resultless, and
    `failed == 0` made a run that executed nothing read as green. On a
    test-list workflow that is the *first* invocation, so the mislabel
    propagated through the whole chain as a flood of `Skip`.
    """
    t = ev.get("tests")
    if not isinstance(t, dict):
        return bool(ev.get("suite_failed"))
    passed = t.get("passed") or 0
    failed = t.get("failed") or 0
    skipped = t.get("skipped") or 0
    total = t.get("total") or 0
    if failed > 0 or (ev.get("collection_errors") or 0) > 0:
        return True
    if "files_failed" in ev:
        # Current event format. `files_failed` marks a file the runner could
        # not finish, and an unrun test — one that is neither passed, failed
        # nor skipped — means some file never executed. Both are failures.
        unrun = total - (passed + failed + skipped)
        return bool(ev["files_failed"] or unrun > 0)
    # Legacy format, recorded before the reporter counted `it.todo`/`it.skip`
    # as skipped: an inactive test is indistinguishable from an unrun one, so
    # the unrun test cannot be used. Fall back to the coarser signal — tests
    # were declared and not one of them produced any result.
    return bool(total > 0 and passed + failed == 0)


def _names(ev, key):
    return set(ev.get(key) or [])


def _batch(prev, cur, key):
    """How many tests newly entered `key` state at `cur`.

    None when the event cannot say. A file that fails to compile contributes no
    task names at all, so its tests are absent rather than failing — counting
    that as a batch of 0 would read the most disciplined red of all (the
    compile step of a two-step red) as "no tests arrived".
    """
    if cur.get("collection_errors"):
        return None
    return len(_names(cur, key) - _names(prev or {}, key))


def _median(xs):
    xs = sorted(x for x in xs if x is not None)
    if not xs:
        return None
    m = len(xs) // 2
    return float(xs[m]) if len(xs) % 2 else (xs[m - 1] + xs[m]) / 2


def metrics(rows):
    """The derived metric set. One source, one derivation, no markers.

    The cycle metrics and the score read only the TDD part — the rows before
    the first verification test (`verification_cutoff`). For a workflow without
    a verification group that is the whole run, so nothing changes for it.
    Run-level facts (`suite_runs`, `opens_red`, `ends_green`) and
    `refactor_events` read the whole run: a refactor in the verification part
    is still a refactor.
    """
    cut = verification_cutoff(rows)
    full, rows = rows, rows[:cut]
    after = full[cut:]
    v_arrived = [n for r in after for n in r["arrived"] if is_verification(n)]
    v_red = [n for r in after for n in r["arrived"]
             if is_verification(n) and n in _names(r["ev"], "failed_tests")]
    tdd_late = [n for r in after for n in r["arrived"] if not is_verification(n)]

    counts = {}
    for r in rows:
        counts[r["label"]] = counts.get(r["label"], 0) + 1
    g = counts.get

    cyc = cycles(rows)
    closed = sum(1 for c in cyc if any(r["label"] == "Green" for r in c))

    # Verified openers: a cycle that began with a failing test that existed
    # before the implementation. `Both` wrote them together, `Skip` never saw
    # the test fail — both are openers that skipped the verification.
    verified = g("Red", 0) + g("Red(c)", 0)
    openers = verified + g("Both", 0) + g("Skip", 0)

    red_batches, green_batches, unmeasurable = [], [], 0
    for i, r in enumerate(rows):
        prev = rows[i - 1]["ev"] if i else None
        if r["label"] in ("Red", "Red(c)"):
            b = _batch(prev, r["ev"], "failed_tests")
            red_batches.append(b)
            if b is None:
                unmeasurable += 1
        elif r["label"] == "Green":
            green_batches.append(_batch(prev, r["ev"], "passed_tests"))

    # A red event whose failing set did not grow is not a batch of anything —
    # an already-failing test stayed failing while a test file moved. Keep it
    # out of the median instead of letting a 0 divide the score below.
    red_batches = [b for b in red_batches if b is None or b > 0]

    attempts = g("Green?", 0) + g("Green?(c)", 0)
    deviations = (g("Both", 0) + g("Skip", 0) + g("Drop", 0)
                  + g("Break", 0) + g("Break(c)", 0))
    reals = [b for b in red_batches if b is not None]

    # --- the consolidated score -------------------------------------------
    # Three components, each 0..1, each with an agreed direction. The two
    # ambivalent metrics (refactor_per_cycle, green_attempts) are deliberately
    # excluded: folding a metric with no agreed direction into a score would
    # smuggle one back in.
    #
    # Combined as a GEOMETRIC mean, which makes the score conjunctive: all
    # three must hold. A run that never saw a failing test before writing the
    # code did not do TDD, and should not score 0.67 because its steps were
    # small and its cycles closed. An arithmetic mean would let any one
    # component buy off a zero in another.
    #
    # The cost is deliberate: several distinct failure modes all land on 0.0,
    # so the score does not rank the bottom of the field. That is what the
    # three components are reported for — a 0 is always diagnosable.
    rate = verified / openers if openers else None
    med = _median(red_batches)
    c_first = rate
    c_step = (1.0 / med) if med else None          # 1 test per red = 1.0
    c_close = (closed / len(cyc)) if cyc else None
    comps = [c_first, c_step, c_close]
    if any(c is None for c in comps):
        # Unmeasurable is not the same as undisciplined — stay null and let the
        # components say which part could not be read.
        discipline = None
    else:
        discipline = round((c_first * c_step * c_close) ** (1 / 3), 3)

    return {
        # denominators — never read the rates without them
        "suite_runs": len(full),
        "cycles_total": len(cyc),
        "cycles_closed": closed,
        # the discipline metric: did a verified failure precede the code?
        "test_first_rate": round(verified / openers, 3) if openers else None,
        # how many tests arrive failing at once. 1 = one test at a time;
        # higher = a batch was authored before any implementation existed.
        "red_batch_size": _median(red_batches),
        "red_batch_max": max(reals) if reals else None,
        "red_batch_unmeasurable": unmeasurable,
        # the mirror: how many tests one implementation step turns green
        "green_batch_size": _median(green_batches),
        # Raw counts, the direct analogues of the marker columns this route
        # replaces: `refactor_events` for refactorings_applied, `skip_events`
        # for tests_passed_immediately (a test that arrived already passing is
        # exactly what that marker metric was counting).
        "refactor_events": sum(1 for r in full if r["label"] == "Refactor"),
        "skip_events": g("Skip", 0),
        # ambivalent — no trophy (run-rq SKILL.md trophy convention)
        "refactor_per_cycle": round(g("Refactor", 0) / closed, 3) if closed else None,
        "green_attempts": round(attempts / closed, 3) if closed else None,
        # pathologies, summed; the chain in tdd-report.md has the detail
        "deviations": deviations,
        "opens_red": full[0]["label"] in ("Red", "Red(c)") if full else None,
        "ends_green": (not suite_failed_of(full[-1]["ev"])) if full else None,
        # The verification part, after the cutoff. `verification_red` are
        # tests planned as verification that needed a cycle after all — the
        # hit rate of the split. `tdd_after_cutoff` are non-verification tests
        # that arrived only after verification began: TDD work the score does
        # not see, which is why it is reported rather than dropped.
        "verification_tests": len(set(v_arrived)),
        "verification_red": len(set(v_red)),
        "tdd_after_cutoff": len(set(tdd_late)),
        # one number, 0..1, higher = more disciplined. Null when any component
        # is unmeasurable. Always report the three components with it.
        "tdd_discipline": discipline,
        "tdd_discipline_test_first": round(c_first, 3) if c_first is not None else None,
        "tdd_discipline_step": round(c_step, 3) if c_step is not None else None,
        "tdd_discipline_closure": round(c_close, 3) if c_close is not None else None,
    }


def render(run_dir, rows):
    ev_last = rows[-1]["ev"] if rows else {}
    counts = {}
    for r in rows:
        counts[r["label"]] = counts.get(r["label"], 0) + 1
    deviations = [l for l in counts if not LABELS.get(l, ("", "", True))[2]]

    out = [f"# TDD phase chain — {Path(run_dir).name}", ""]
    out += [f"**{len(rows)} suite invocations.** "
            f"Derived from `tdd-events.jsonl`; no workflow markers, tool calls "
            f"or commits were read.", ""]
    out += ["## Chain", "", "```", chain(rows), "```", ""]
    if deviations:
        out += ["Deviations present: " + ", ".join(
            f"`{d}` ×{counts[d]} ({LABELS[d][1]})" for d in sorted(deviations)), ""]
    else:
        out += ["No deviations — every invocation falls in the healthy vocabulary.", ""]

    cut = verification_cutoff(rows)
    if cut < len(rows):
        out += [f"Verification part begins at invocation "
                f"{rows[cut]['ev'].get('seq', cut + 1)}. The cycle metrics and "
                f"`tdd_discipline` read only the invocations before it; the "
                f"cycle list below shows the whole run.", ""]

    m = metrics(rows)
    out += ["## Metrics", "", "| Metric | Value |", "|---|---:|"]
    for k, v in m.items():
        out.append(f"| `{k}` | {v} |")
    out += ["",
            "`red_batch_size` is the one to read for step size: 1 means one "
            "failing test at a time, higher means a batch of tests was authored "
            "before any implementation existed. `green_batch_size` is its "
            "mirror on the implementation side — the two separate when a "
            "workflow writes several tests up front and then implements them "
            "one by one.", ""]

    cyc = cycles(rows)
    closed = sum(1 for c in cyc if any(r["label"] == "Green" for r in c))
    out += [f"## Cycles ({closed} of {len(cyc)} closed with a Green)", ""]
    for n, c in enumerate(cyc, 1):
        mark = "" if any(r["label"] == "Green" for r in c) else "  ← never closed"
        seqs = f"{c[0]['ev'].get('seq','?')}–{c[-1]['ev'].get('seq','?')}"
        out.append(f"{n:>3}. `{seqs}`  " + " -> ".join(r["label"] for r in c) + mark)
    out += [""]

    out += ["## Label counts", "", "| Label | n | Meaning |", "|---|---:|---|"]
    for l, n in sorted(counts.items(), key=lambda kv: -kv[1]):
        out.append(f"| `{l}` | {n} | {LABELS.get(l, ('', '?', True))[1]} |")
    out += [""]

    out += ["## Per invocation", "",
            "| # | Phase | Suite | Tests p/f | Changed since previous |",
            "|---:|---|---|---|---|"]
    for i, r in enumerate(rows):
        ev, t = r["ev"], r["ev"].get("tests", {})
        state = "fail" if suite_failed_of(ev) else "pass"
        if ev.get("collection_errors"):
            state += f" ({ev['collection_errors']} collect err)"
        if i == 0:
            # Nothing changed "since previous" — there is no previous. Listing
            # the whole tree here reads as a ten-file edit that never happened.
            ch = f"_(initial tree: {len(r['changed'])} files)_"
        else:
            ch = ", ".join(f"`{p}`" for p in r["changed"]) or "—"
        out.append(f"| {ev.get('seq', '?')} | {r['label']} | {state} | "
                   f"{t.get('passed', '?')}/{t.get('failed', '?')} | {ch} |")
    out += [""]
    final = "pass" if not suite_failed_of(ev_last) else "fail"
    out += [f"Final suite state: **{final}**.", ""]
    return "\n".join(out)


def main():
    ap = argparse.ArgumentParser(description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("run", type=Path, help="run directory holding tdd-events.jsonl")
    ap.add_argument("--chain", action="store_true", help="print only the one-line chain")
    ap.add_argument("--json", action="store_true",
        help="print only the derived metrics as one JSON object; used by "
             "analyze-run.sh to fold them into metrics.json")
    ap.add_argument("-o", "--out", type=Path, default=None, help="write to this file")
    a = ap.parse_args()

    f = a.run / "tdd-events.jsonl"
    if not f.exists():
        # --json must always emit an object: analyze-run.sh pipes it into jq,
        # which must not choke on a run that predates the reporter.
        if a.json:
            print("{}")
            return
        sys.exit(f"no tdd-events.jsonl in {a.run} — the run predates the stack reporter")
    events = [json.loads(l) for l in f.read_text().splitlines() if l.strip()]
    if not events:
        if a.json:
            print("{}")
            return
        sys.exit(f"{f} is empty — the suite was never run")
    rows = build(events)

    if a.json:
        json.dump(metrics(rows), sys.stdout); print()
        return
    text = chain(rows) if a.chain else render(a.run, rows)
    if a.out:
        a.out.write_text(text + "\n")
        print(f"wrote {a.out}", file=sys.stderr)
    else:
        print(text)


if __name__ == "__main__":
    main()
