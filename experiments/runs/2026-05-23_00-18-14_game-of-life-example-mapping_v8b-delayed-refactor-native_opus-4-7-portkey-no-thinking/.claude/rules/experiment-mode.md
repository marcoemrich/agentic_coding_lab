# Delayed-Refactor Experiment Mode (v8b — native inline refactor)

## Why this workflow exists

This is a **control** workflow for the TDD-vs-delayed-refactor comparison. The hypothesis under test is: *periodic refactoring during TDD produces better code than one large refactoring at the end of an implementation written without tests.* This workflow implements the counter-position with a **native** end-refactor (no specialist agent, no APP, no naming-evaluation scaffolding) — closer to what someone without a TDD harness would do. Paired with v8a (same control but with the periodic-TDD refactor subagent), it isolates the effect of refactor-agent content vs refactor-timing.

Three sequential phases in one autonomous session, no iteration loop.

## Phase 1 — Implementation

Read the kata prompt (`prompt.md`). Implement the solution in `src/` until you believe it is correct. Do **not** write tests in this phase. Run the code informally if useful, but the deliverable of this phase is the implementation only.

## Phase 2 — Tests

Write a test suite in `src/<feature>.spec.ts` (or the file path the kata implies). The source of behavior is `prompt.md` — the kata specification — **not** the implementation you just wrote.

Walk through the specification section by section. For each rule and each example:
- Create a test case that verifies the described behavior.
- Include the **expected values from the spec** in the test description.
- If a clarifying question (❓) resolves an ambiguity, create a test for the clarified interpretation.
- If the spec uses an example-mapping format (rules, examples, questions), every listed example must have a corresponding test.

### DO

- ✅ Cover **every spec example** with at least one test
- ✅ Cover **every operation** described in the spec
- ✅ Give **every clarifying question (❓)** a corresponding test
- ✅ Include **expected values** in descriptions
- ✅ Keep tests **independent**

### DON'T

- ❌ Miss an entire operation described in the spec
- ❌ Mirror the implementation instead of the spec

Run `pnpm test`. All tests must be green before continuing. If a test fails because the implementation is wrong, fix the implementation. If a test fails because the test is wrong, fix the test. Do not continue with red tests.

## Phase 3 — Refactor

Refactor the implementation. Tests must stay green — run `pnpm test` after each change. This is the final and only refactor pass. Improve readability, naming, structure, duplication. Stop when no further improvement is obvious.

No specialist agent, no APP mass calculation, no formal naming-evaluation block.

## Done Marker

When all three phases are complete and tests are green, write a file `experiment-done.txt` with the single word `DONE` as its only content. Do not write any other summary or report file.

## Running Tests

Use `pnpm test`.

## Autonomy

Do not wait for human approval between phases. Run all three phases in sequence and finish.
