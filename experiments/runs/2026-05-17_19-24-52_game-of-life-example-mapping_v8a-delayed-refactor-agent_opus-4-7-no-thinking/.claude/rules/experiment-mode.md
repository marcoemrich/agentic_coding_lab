# Delayed-Refactor Experiment Mode (v8a — refactor subagent)

## Why this workflow exists

This is a **control** workflow for the TDD-vs-delayed-refactor comparison. The hypothesis under test is: *periodic refactoring during TDD produces better code than one large refactoring at the end of an implementation written without tests.* This workflow implements the counter-position — implementation first without test pressure, tests written afterwards, single refactor pass at the end — so the TDD baseline (v6.5.1) has something to be measured against.

Three sequential phases in one autonomous session, no iteration loop.

## Phase 1 — Implementation

Read the kata prompt (`prompt.md`). Implement the solution in `src/` until you believe it is correct. Do **not** write tests in this phase. Run the code informally if useful, but the deliverable of this phase is the implementation only.

## Phase 2 — Tests

Write a test suite in `src/<feature>.spec.ts` (or the file path the kata implies). The source of behavior is `prompt.md` — the kata specification — **not** the implementation you just wrote. Cover the behaviors and edge cases described in the prompt.

Run `pnpm test`. All tests must be green before continuing. If a test fails because the implementation is wrong, fix the implementation. If a test fails because the test is wrong, fix the test. Do not continue with red tests.

## Phase 3 — Refactor

Launch the refactor subagent. It has no memory of phases 1 and 2 — give it everything it needs in the prompt:

```
Task({
  subagent_type: "refactor",
  prompt: `
    Test file: src/<feature>.spec.ts
    Implementation file: src/<feature>.ts
    Passing tests: <count>
    Context: implementation was written first, tests added afterwards.
    This is the final and only refactor pass.

    Refactor the implementation while keeping all tests green.

    EXPERIMENT MODE: Run autonomously, return when done.
  `
})
```

The refactor agent applies APP (Absolute Priority Premise), naming evaluation, and the mandatory-attempt rule as defined in its agent file.

## Done Marker

When all three phases are complete and tests are green, write a file `experiment-done.txt` with the single word `DONE` as its only content. Do not write any other summary or report file.

## Running Tests

Use `pnpm test`.

## Autonomy

Do not wait for human approval between phases. Run all three phases in sequence and finish.
