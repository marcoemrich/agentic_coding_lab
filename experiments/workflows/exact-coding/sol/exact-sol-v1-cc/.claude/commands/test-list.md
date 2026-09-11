# TDD Test List Phase

You are now in the **Test List Phase** of TDD. Follow these instructions to create a comprehensive test list.

## Your Mission

Create a test list using `it.todo()` that covers **every rule and every example** from the specification:
1. Read the specification (`prompt.md`) thoroughly -- every rule, every example, every clarifying question (?)
2. Turn each example into at least one `it.todo()` test case
3. Order tests from simplest to most complex
4. Use `it.todo()` only -- NO executable tests yet

## Context: $ARGUMENTS

## Process

### Step 1: Understand the Feature
Read the complete specification. Pay special attention to integration examples and clarifying
questions (marked with ?) -- these disambiguate rules that may seem open to interpretation in isolation.
- What are all the operations the system must support?
- What rules govern each operation?
- Which examples in the spec illustrate these rules?
- For rejection or failure cases, what is the observable error contract: a thrown error, an error result, a status, or another outcome? If an error is thrown, does the specification define its type and/or message?

### Step 2: Identify Test Cases from the Spec
Walk through the specification section by section. For each rule and each example:
- Create a test case that verifies the described behavior
- Include the **expected values from the spec** in the test description
- If a clarifying question (?) resolves an ambiguity, create a test for the clarified interpretation
- If the spec uses an example-mapping format (rules, examples, questions), every listed example must have a corresponding test
- Make every rejection or failure case explicit in observable terms, such as `throws RangeError`, `returns an error result`, or `responds with status 400`
- Include an exact error type or message only when the specification establishes it
- If the specification merely says `rejects`, `fails`, `invalid`, or equivalent without defining the observable contract, choose the most defensible reading of the specification, state that reading explicitly in the test description, and continue; do not silently invent an unstated contract

### Step 3: Order Tests (Simple -> Complex)
Arrange tests in increasing complexity:
1. Simplest case (often empty/zero/single item)
2. Individual rules in isolation
3. Rules with modifiers
4. Combinations of multiple rules
5. Multi-step scenarios (e.g., operations that reference earlier results)

### Step 4: Write Test File
Create the test file with `it.todo()` entries:

```typescript
import { describe, it, expect } from "vitest";
import { functionName } from "./implementation.js";

describe("Feature Name", () => {
  it.todo("should [behavior] -- [expected value from spec]");
  it.todo("throws RangeError when [invalid condition from spec]");
  it.todo("should [next behavior] -- [expected value from spec]");
  // ... ordered simple -> complex, covering ALL spec examples
});
```

### Step 5: Provide Summary

After creating the test list, output both marker lines followed by the summary.
The heading and the `Test List Created` line are read by different parsers --
emit both, verbatim:

```
## Test List

Test List Created:
**Feature**: [feature name]
**Test File**: [filename].spec.ts
**Tests**: [count]

**Test Cases** (ordered simple -> complex):
1. [first test description]
2. [second test description]
3. [third test description]
...
```

Do not treat this summary as the end of your turn -- it is a checkpoint
inside one continuous run. Proceed straight into the Red phase.

## Important Guidelines

### DO
- Cover **every spec example** with at least one test
- Cover **every operation** described in the spec
- Give **every clarifying question (?)** a corresponding test
- Order tests **simple -> complex**
- Use `it.todo()` for all tests
- Include **expected values** in descriptions
- State rejection and failure outcomes as explicit observable contracts
- Name your chosen reading explicitly when the spec leaves a failure mechanism open
- Keep tests **independent**
- One behavior per test

### DON'T
- Write executable tests (use `it.todo()`)
- Think about implementation instead of behavior
- Turn vague words such as `rejects` into an invented error contract without saying so
- Leave a rejection test vague when its observable outcome is known
- Miss an entire operation described in the spec
- Order randomly
