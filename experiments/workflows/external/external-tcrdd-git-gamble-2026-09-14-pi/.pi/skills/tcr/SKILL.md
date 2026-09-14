---
name: tcr
description: >
  Guide users through TCR (Test && Commit || Revert), TCRDD, and git-gamble workflows.
  ALWAYS trigger when a user mentions TCR, TCRDD, "test commit revert", "git gamble",
  or "git-gamble". Trigger when a user wants to combine TDD with automatic commits/reverts,
  enforce baby steps via a commit-or-revert loop, or asks about the --red/--green/--refactor
  flags. Trigger when someone says they want to "develop with TDD and TCR", "use TCR to force
  smallest steps", or "gamble" on their tests.
  Do NOT trigger for general TDD-only questions, general unit testing questions, test
  framework setup, CI pipelines, mocking, or code coverage — those do not need this skill.
license: MIT
compatibility: Requires git and git-gamble (https://git-gamble.is-cool.dev/)
---

# TCRDD — TCR + TDD

TCRDD = **TCR** (test && commit || revert) + **TDD** (Test Driven Development).

It blends two disciplines so that:

- You always develop the _right_ thing (TDD's guarantee: one failing test drives each step)
- You're forced to take _baby steps_, because reverting wipes out wrong work fast (TCR's guarantee)

The tool that automates this workflow is [`git-gamble`](https://git-gamble.is-cool.dev/).
Run `git-gamble --help` for usage details.

## TDD Foundation (the part TCR is built on)

TCRDD assumes you follow the Red / Green / Refactor micro-cycle from TDD:

1. **Red** — write exactly one failing test (just enough to fail — compilation failures count)
2. **Green** — write the minimum production code to make it pass, nothing more
3. **Refactor** — clean up structure while keeping all tests green

Each phase maps directly to a `git gamble` flag. The discipline of *one test at a time* and *minimum code to pass* is what makes the gamble meaningful — if you write too much, a revert erases more than intended.

## Strict TCR Rule

In strict TCR, `git gamble` **is the test run** for the current cycle.

- Do **not** run `cargo test`, `npm test`, or any other standalone test command before `git gamble` inside a Red, Green, or Refactor cycle
- If you already know whether the tests will pass or fail, there is no gamble
- The only acceptable test execution inside a cycle is `git gamble --red|--green|--refactor -- <test command>`
- Standalone test runs are allowed only **outside** the cycle, such as end-of-session verification or after a revert when preparing the next attempt
- `git gamble` commits or reverts the **entire dirty worktree**, not just the file you meant to touch
- Start each TCR cycle from a clean worktree, or isolate unrelated edits before gambling

This is non-negotiable when the user asks for strict TCR/TCRDD.

---

## The Three Phases

TCRDD cycles through three phases. Each phase ends in either a **commit** (success) or a **revert** (failure → retry).

### 🔴 Red Phase — Write one failing test

Goal: produce exactly one new failing test.

1. Write a single test
2. Immediately run `git gamble --red -- <test command>` — this _gambles_ that tests will fail
3. Observe the result from `git gamble`
4. **Tests pass** → revert (your test wasn't really new/failing), write another test, repeat
5. **Tests fail** → commit, move to Green

The revert-on-pass is the key TCR twist: if your "new" test passes immediately, you probably didn't add real coverage. Revert and try again.

### 🟢 Green Phase — Make all tests pass

Goal: write the _minimum_ code to make the failing test pass.

1. Write the minimum code
2. Immediately run `git gamble --green -- <test command>` — gambles that tests will pass
3. Observe the result from `git gamble`
4. **Tests fail** → revert, try something else, repeat
5. **Tests pass** → commit, move to Refactor

Write only enough code to go green. No gold-plating.

### 🔵 Refactor Phase — Clean up without changing behaviour

Goal: improve code structure while keeping all tests green.

1. Rewrite/restructure code (behaviour must stay identical)
2. Immediately run `git gamble --refactor -- <test command>` — gambles tests will pass
3. Observe the result from `git gamble`
4. **Tests fail** → revert, try a different refactor, repeat
5. **Tests pass** → commit
   - More to refactor? Loop within Refactor
   - More features to add? Go back to Red
   - Done? Finish

---

## Why the Revert Discipline Matters

TCR alone has a weakness: you never see a test fail, so:

- You might forget an `assert` (test always passes vacuously)
- You might assert the wrong thing (wrong variable)

TCRDD fixes this: the Red phase _requires_ a failing test before you can commit. If the tests don't fail, the work gets reverted. This forces you to confirm the test actually catches the missing behaviour.

---

## git-gamble Commands

| Command                 | Phase    | What it gambles     |
| ----------------------- | -------- | ------------------- |
| `git gamble --red`      | Red      | That tests **fail** |
| `git gamble --green`    | Green    | That tests **pass** |
| `git gamble --refactor` | Refactor | That tests **pass** |

Under the hood: `test && commit || revert` (TCR), but with the pass/fail expectation flipped for the Red phase.

To get a full description of the commands, see `git gamble --help` or the [git-gamble documentation](https://git-gamble.is-cool.dev/).

## Strict Execution Template

Use this exact shape when practicing TCRDD:

```text
RED
- edit one test
- run: git gamble --red -- <test command>

GREEN
- edit the minimum production code
- run: git gamble --green -- <test command>

REFACTOR
- edit structure only
- run: git gamble --refactor -- <test command>
```

Example:

```bash
git gamble --red -- cargo test
git gamble --green -- cargo test
git gamble --refactor -- cargo test
```

Do not insert a plain `cargo test` before any of those commands. That turns TCR into an ordinary test-then-commit workflow.

---

## How to Guide Users Through TCRDD

When helping someone practice TCRDD:

1. **Identify their current phase.** Ask what they just did. Are they about to write a test (Red), about to make it pass (Green), or about to clean up (Refactor)?

2. **Coach the correct constraint for that phase.**
   - Red: "Write only one test. Don't write any implementation yet."
   - Green: "Write the minimum code — no more than needed to pass the test."
   - Refactor: "Only restructure. If you're adding behaviour, that's a new Red cycle."

3. **Remind about the gamble step.** The user should declare their expectation with `git gamble --<phase> -- <test command>`, and that command must be the first test execution of the cycle. This is what triggers the automatic commit or revert.

4. **When they get a surprise result**, help them understand why:
   - Unexpected pass in Red → their test didn't capture a real missing behaviour. Revert and rethink the test.
   - Unexpected fail in Green/Refactor → their change introduced a regression. Revert and try something smaller.

5. **Encourage baby steps.** If a user wants to implement a big chunk, help them break it into the smallest possible increment that would change the test outcome.

6. **Guard strict TCR discipline.** If the user asks for strict TCR, do not pre-run the tests "to be safe". That destroys the gamble. Let `git gamble` be the source of truth for the cycle outcome.

---

## Common Mistakes and How to Address Them

**"I'll write all the tests first, then implement"**
→ TCRDD requires one test at a time, one Red-Green-Refactor cycle at a time. This ensures each test has a clear purpose and that you see it fail.

**"I added the implementation while writing the test"**
→ The test and implementation must be separate commits. Write the test → commit on red → then write implementation → commit on green.

**"I'll check with `cargo test` and then run `git gamble`"**
→ That is **not** TCR. Once you already know the result, there is no gamble. The correct move is to edit, then run `git gamble --<phase> -- <test command>` as the first test execution of the cycle.

**"I can leave unrelated changes around while I gamble"**
→ Dangerous. `git gamble` operates on the whole dirty worktree. TCR works best when each cycle starts from a clean worktree that contains only the single intended step.

**"My refactor changed some behaviour slightly"**
→ If tests break, that's a sign behaviour changed. Revert the refactor. Either update the test first (new Red cycle) or find a purer structural refactor.

**"The revert erased too much work"**
→ This is intentional! It means the step was too big. Take a smaller step next time. This is how TCRDD enforces baby steps.

---

## Quick Reference Card

```
RED   → write 1 test → git gamble --red -- <test command>
        fail? commit → GREEN
        pass? revert → try again

GREEN → write min code → git gamble --green -- <test command>
        pass? commit → REFACTOR
        fail? revert → try again

REFACTOR → clean code → git gamble --refactor -- <test command>
           pass? commit → (loop or done or back to RED)
           fail? revert → try again
```

## Guidance For AI Agents

When an AI agent is executing TCRDD for the user:

- Never run the plain test command before `git gamble` within a Red/Green/Refactor cycle
- Make the edit first, then run `git gamble --<phase> -- <test command>`
- Inspect the commit/revert result only **after** `git gamble` finishes
- If extra verification is needed, do it outside the cycle and say explicitly that it is post-cycle verification, not part of strict TCR
- Prefer starting from a clean worktree, because `git gamble` will sweep unrelated dirty changes into the same commit or revert

---

## Resources

- [git-gamble theory page](https://git-gamble.is-cool.dev/theory.html) — full visual flowcharts for each phase
- [git-gamble slides](https://git-gamble.is-cool.dev/slides_theory) — presentation version of the theory
- [TCR original post by Kent Beck](https://medium.com/@kentbeck_7670/test-commit-revert-870bbd756864)
