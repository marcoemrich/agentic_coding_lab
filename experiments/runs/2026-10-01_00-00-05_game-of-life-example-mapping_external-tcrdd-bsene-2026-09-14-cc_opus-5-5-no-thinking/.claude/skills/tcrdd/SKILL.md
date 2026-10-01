---
name: tcrdd
description: >
  Test-Commit-Revert + TDD (TCRDD): red/green/refactor with per-phase auto-commit on success
  and auto-revert on failure, gated by user approval before code and before committing.

  TRIGGER when: user says TCRDD, TCR, TDD, red-green-refactor, "test-first", "write the test
  first", "let's TDD this", "baby steps", "commit on green", "revert on failure", or "go
  step by step with tests"; user wants approval-gated pair programming or a disciplined
  test-then-code cadence with automatic commits.

  DO NOT USE when: retrofitting tests onto existing code without behaviour change (use
  `testing`); one-off bug fix where per-phase commits add noise; no runnable test command;
  trivial code covered indirectly by other tests; GUI/layout fiddling; throwaway scripts; or
  thin wrapping of a trusted third-party framework you aren't testing internally.

  Prefer this over `testing` when cadence and commit discipline matter, not just test
  authoring.
---

# TCRDD

Red/green/refactor driven by native git: each phase stages, runs the tests, and auto-commits on the expected result or auto-reverts (`git reset --hard`) otherwise. No external tool required.

**Precondition: start from a clean tree — no uncommitted changes and no untracked files.** The revert primitive (`git add -A` + `git reset --hard`) deletes untracked files with no reflog recovery, so any untracked file present when the cycle starts is lost. `git stash -u` (or a dedicated worktree) anything you want to keep before the first `add -A`.

## Mode

- **Interactive** (a human is in the loop): use the approval gates below — plan approval, then diff approval before each stage-and-test cycle.
- **Autonomous** (no human available to approve, e.g. running unattended): **just run the loop.** Approval gates are optional — skip them and proceed. Still commit per phase and still take one baby step at a time. Do **not** freeze waiting for an approval that will never come.

## Agentic Execution — running unattended as an autonomous coding agent

Autonomous mode (see **Mode** above) says "just run the loop." These are the guardrails that
make that safe to actually leave unattended, rather than just permission to skip approvals.

- **Verify, never self-report.** A phase is only GREEN/RED-as-expected if it's backed by an
  actual test-runner tool call whose output you inspected — exit code, pass/fail counts, the
  works. Never advance the loop, commit, or tell the orchestrator/user "tests pass" on the
  basis of your own prediction of what the code should do. If the tool call didn't happen,
  the phase didn't happen.
- **Stuck-loop limit.** If `git reset --hard` fires on the _same_ candidate step more than twice in a
  row, stop retrying at that size — split it smaller (per the transformation ladder) before
  trying again. If a second round of splitting also stalls, **halt and report a blocker**
  instead of continuing to loop or reaching for a higher-numbered transformation just to
  escape. Forcing a bigger move to get unstuck is exactly the failure TCRDD exists to prevent.
- **Budget the run.** Before starting, note a rough ceiling (iteration count, wall-clock, or
  token budget) for the feature. Hitting it is a stop condition, not a reason to rush the
  remaining steps by batching them — see "one baby step at a time" above.
- **Tag commits by phase.** Prefix each phase's commit message with `[RED]`, `[GREEN]`, or
  `[REFACTOR]` (and squash to a clean final message per **REPEAT**). This is what makes an
  unattended run auditable after the fact, when no one watched the diffs live.
- **Handoff contract.** When TCRDD is invoked as a subagent/tool call by an orchestrator (or
  you're reporting back after an unattended run), end with a structured status rather than
  just stopping:
  - `done` — feature complete, commits squashed, tests green.
  - `blocked-stuck` — stuck-loop limit hit; pull the last failing test and what was tried
    from `tcr-failure-log.md` rather than reconstructing it from memory.
  - `blocked-budget` — budget exceeded mid-feature; include current state and next planned step.
  - `blocked-ambiguous` — the smallest-next-behaviour choice needs a human call the agent
    isn't positioned to make (see RED: "ask the user... in autonomous mode, pick it yourself" —
    this is the escape hatch for when even that isn't safe to guess).
- **Isolate concurrent runs.** If more than one agent instance might touch the same repo at
  once (a swarm, or parallel features), give each its own git worktree. The commit/revert
  cycle below assumes exclusive control of the working tree — `git reset --hard` from one
  agent will discard another agent's uncommitted in-flight work on a shared tree.

## Pragmatics — when to skip or downgrade the loop

TDD is a discipline, not dogma. Per Uncle Bob's own pragmatics, skip TCRDD (or downgrade to a
lighter cadence) in these cases — everything else still gets the full loop:

- **Trivial code** — getters/setters, bare member variables, one-line or obviously trivial
  functions. These get exercised indirectly by the tests of whatever calls them; writing a
  RED/GREEN cycle for each one is ceremony without signal.
- **GUI / layout code** — anything that has to be _fiddled_ into place by trial and error
  (font sizes, RGB values, XY positions, spacing). Don't force a failing test first here.
  Instead:
  - Extract any real logic out of the GUI layer into a plain module and TCRDD _that_ module.
    The GUI itself should be thin glue — wiring, not behavior.
  - For the fiddly glue itself, either fiddle first and write tests after the fact, or fiddle,
    then delete and re-write test-first once you know the shape. Both are legitimate; pick
    per judgement call, not per rule.
- **Trusted third-party code** — frameworks, databases, web servers, SDKs you have no reason
  to distrust. Mock the boundary and TCRDD _your_ code against the mock; don't write tests
  that re-verify the third party's behavior. Exception: if you suspect it's actually broken,
  or a real call is cheap/fast/predictable enough that mocking is overkill — then it's fine
  to test through it.
- **Genuine one-shot throwaway work** — a script or program that will be run once and
  discarded (e.g. generating a one-off asset), especially in a REPL-driven / exploratory
  context. Skip the loop entirely.

None of this licenses skipping TCRDD because a task merely _feels_ inconvenient or slow. The
default is still: make every effort to TDD any code with lasting production value. These are
narrow, recognizable exceptions — not a general escape hatch.

## Workflow

```
RED   → plan test → approval? → write test → diff approval? → stage + run tests
        test FAILS (expected)?   commit [RED]      → GREEN
        test PASSES (unexpected)? log → reset --hard → try again

GREEN → plan code → approval? → write code → diff approval? → stage + run tests
        tests PASS?  commit [GREEN]      → REFACTOR
        tests FAIL?  log → reset --hard  → try again

REFACTOR → plan cleanup → approval? → refactor → diff approval? → stage + run tests
           tests PASS (no behaviour change)? commit [REFACTOR]     → (loop or done or back to RED)
           tests FAIL?                       log → reset --hard   → try again
```

Git-native, no external tool required. Every phase runs the same two-command primitive:

```
git add -A && <test_command>
```

then, depending on what the phase expects:

- **Expected outcome met** (RED: exit != 0 — the new test genuinely fails · GREEN/REFACTOR:
  exit == 0 — the suite is green) → `git commit -m "[RED|GREEN|REFACTOR] <what changed>"`
- **Expected outcome not met** → capture the failure, `git reset --hard HEAD`, then append it
  to the failure log (see below)

`git add -A` before the test run matters: it stages new files (like the test file just
written in RED) as well as edits, so `git reset --hard HEAD` on failure discards _everything_
from that step — new files included — not just modifications to files that already existed.
Skipping the `add -A` step is the most common way this loop silently leaks untracked files
across a "reverted" step.

### Failure log

`git reset --hard` is silent — the discarded attempt leaves no trace in git history. Keep one
by hand: on every revert, append an entry to `tcr-failure-log.md` at the repo root, _after_
the reset (so the append lands on the clean tree, not the discarded one), then commit just
the log:

```
git reset --hard HEAD
cat >> tcr-failure-log.md << 'EOF'
## <ISO 8601 timestamp> — [PHASE] reverted
- Attempted: <one-line description of the candidate step>
- Expected: <RED: test should fail | GREEN/REFACTOR: tests should pass>
- Actual: <exit code + one-line summary — failing assertion, or "passed unexpectedly">
EOF
git add tcr-failure-log.md && git commit -m "[LOG] revert: <phase> <one-line reason>"
```

This keeps the log itself out of the `git add -A` staged in the main primitive, so a revert
never wipes its own record — the log commit happens as a separate, deliberate step after the
reset, not folded into it. Over a run this becomes the audit trail Verify-never-self-report
depends on: when the stuck-loop limit fires (see Agentic Execution above), the last few
entries are the "what was tried" for the `blocked-stuck` handoff, without having to
reconstruct it from memory.

### Detecting the test command

Resolve `<test_command>` from the repo, in this order, and reuse the same one for every phase:

1. `package.json` → `scripts.test` (`npm test` / `pnpm test` / `yarn test`)
2. `Makefile` → `make test` (or the documented target)
3. Language convention: `pytest`, `cargo test`, `go test ./...`, Maven/Gradle `test` goal, etc.
4. If still unclear: check `README` or CI config (e.g. `.github/workflows`), or ask once.

**Always run the full suite** for that command — the same one CI runs. Do not narrow to a
single file, class, or `-k`/`-run` filter unless the user explicitly asks for a scoped run.
A GREEN reached by testing a subset of the suite is not GREEN.

---

## How to write code

Before each phase (**interactive mode only** — skip in autonomous mode, see Mode):

- [ ] Plan approved by user
- [ ] Diff approved by user before staging and running the tests

> **One step at a time — never one-shot.** Each phase advances by exactly one baby step:
> one failing test, then the minimum code to pass it. Do **not** write the whole test
> suite or the full implementation in a single pass, even in autonomous mode. One pass =
> wrong. Loop instead.

### RED — Write a failing test

- Ask the user for the **smallest next behaviour** they want to add (in autonomous mode, pick the smallest next behaviour yourself).
- Write _only enough_ of a test to fail — stop at the first compile error or failed assertion.
- If every way to pass the candidate test needs a low-priority transformation (see table below), that test is too big — look for a smaller intervening test first.

### GREEN — Write the minimum production code

- Write _only_ the code that makes the currently failing test pass. Nothing more.
- Resist the urge to generalise, add helpers, or handle future cases — those are for later tests.
- No extra dependencies, loggers, or validators — unless the failing test explicitly requires it.

**Transformation priority** — use the lowest-numbered move on this ladder that makes the test pass. Reaching for a higher number is a signal the test was too big (go back and split it):

1. No code → a stub return
2. Stub → a literal constant
3. Constant → a richer constant
4. Constant → a variable/argument
5. One statement → more statements
6. Straight line → a branch
7. Scalar → an array/collection
8. Branch → a loop
9. Reassigning an existing variable
10. Loop → recursion (bounded/shallow depth only)
11. Inline expression → an extracted function
12. Adding a case to an existing multi-branch conditional

Step 12 is always the last resort, never the first move. If every way to pass a
candidate test needs a multi-branch conditional, the test was too big — go back
and find a smaller intervening test instead of reaching for step 12.

### REFACTOR

- With all tests green, clean up both production and test code freely.

### REPEAT

- Ask the user whether the overall feature or fix is done.
  - **Not done** → back to RED
  - **Done** → squash the intermediate commits into one clean commit

---

## Example: baby step vs one-shot

Feature: a `Cart.total()` that sums line items and applies a discount code.

✅ **Correct (one baby step):**

```
RED:   write a test asserting total() of an empty cart is 0 → fails (no method) → commit
GREEN: add total() returning 0 → passes → commit
RED:   write a test for one item → fails → commit
GREEN: sum the items → passes → commit
... (discount handled by a later RED/GREEN, not now)
```

❌ **Wrong (one-shot — what breaks weaker models):**

```
Write all five tests at once, then a complete Cart with summing + discount logic,
then a single squashed commit. No red/green cadence, no revert safety.
```

The skill is the loop. If you produce a finished feature in one turn, you did not run TCRDD.

---

## Error handling

| Situation                                        | Action                                                                                                                                                              |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `reset --hard` fires on your change              | The step was too large — split it into smaller increments and try again                                                                                             |
| Same-size step reverts >2x in a row (autonomous) | Stop retrying at that size. Split smaller once; if that also stalls, halt and report a `blocked-stuck` status instead of looping or forcing a bigger transformation |
| Tests are flaky (pass/fail randomly)             | Fix or isolate the flaky test before continuing the cycle                                                                                                           |
| Working tree was dirty before entering the loop  | Don't let a phase's commit sweep up unrelated pre-existing changes — `git stash` them first, or ask the user how to handle them                                     |

---

## Read On Demand

| Read when                                                                                                | Link                                                                                                                                      |
| -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Want the original TCR rationale                                                                          | [TCR — Kent Beck](https://medium.com/@kentbeck_7670/test-commit-revert-870bbd756864)                                                      |
| Want deeper TDD cycle theory                                                                             | [The Cycles of TDD — Uncle Bob](https://blog.cleancoder.com/uncle-bob/2014/12/17/TheCyclesOfTDD.html)                                     |
| Want the full derivation of the transformation ladder above                                              | [The Transformation Priority Premise — Uncle Bob](https://blog.cleancoder.com/uncle-bob/2013/05/27/TheTransformationPriorityPremise.html) |
| Want to see why adding a case is last and why tail-recursion/language runtime changes the ladder's order | [Fib. The T-P Premise — Uncle Bob](https://blog.cleancoder.com/uncle-bob/2013/05/27/FibTPP.html)                                          |
| Want a second worked example of the transformation ladder applied to a flash-card-style feature          | [Flash - TPP — Uncle Bob](https://blog.cleancoder.com/uncle-bob/2013/05/27/FlashTpp.html)                                                 |
| Unsure whether a specific piece of code is a legitimate TCRDD exception                                  | [The Pragmatics of TDD — Uncle Bob](https://blog.cleancoder.com/uncle-bob/2013/03/06/ThePragmaticsOfTDD.html)                             |

## Upstream

| Before starting TCRDD                        | Skill  | Why                                                                |
| -------------------------------------------- | ------ | ------------------------------------------------------------------ |
| Unsure whether the feature is worth building | `kano` | Classify the feature before investing in red/green/refactor cycles |

---

## Benchmark

Scenario: `.benchmarks/scenarios/tcrdd-001-red-green.md` · Run: 2026-08-31 · Log: `.benchmarks/runs/2026-08-31/tcrdd-001-red-green.json`

| Model             | Without | With | Delta |
| ----------------- | ------- | ---- | ----- |
| claude-opus-4-8   | 50%     | 100% | +50%  |
| claude-sonnet-4-6 | 83%     | 67%  | −16%  |
| claude-haiku-4-5  | 50%     | 67%  | +17%  |

> **NEG (run 2026-08-31)**. Opus +50 / haiku +17, but sonnet −16: GREEN-phase minimal-implementation discipline is crowded out by the agentic-guardrail machinery. Post-native-git rewrite holds (no universal regression; the 2026-06-14 FAIL is cleared). GREEN workflow line on the follow-up list. Gate per `.agents/skills/skill-optimizer/rules/release-gates.md`.
