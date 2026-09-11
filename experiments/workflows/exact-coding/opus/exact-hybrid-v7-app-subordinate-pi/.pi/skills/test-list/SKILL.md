---
name: test-list
description: TDD Test List Phase - Create a comprehensive test list covering every example and rule from the specification
---

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

### Step 2: Identify Test Cases from the Spec
Walk through the specification section by section. For each rule and each example:
- Create a test case that verifies the described behavior
- Include the **expected values from the spec** in the test description
- If a clarifying question (?) resolves an ambiguity, create a test for the clarified interpretation
- If the spec uses an example-mapping format (rules, examples, questions), every listed example must have a corresponding test

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
  it.todo("should [next behavior] -- [expected value from spec]");
  // ... ordered simple -> complex, covering ALL spec examples
});
```

### Step 5: Provide Summary

After creating the test list, output:

```
Test List Created:
**Feature**: [feature name]
**Test File**: [filename].spec.ts
**Tests**: [count]

**Test Cases** (ordered simple -> complex):
1. [first test description]
2. [second test description]
3. [third test description]
...

**Next Step**: Invoke `red` skill NOW, in this same turn, to activate the first test.
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
- Keep tests **independent**
- One behavior per test

### DON'T
- Write executable tests (use `it.todo()`)
- Think about implementation instead of behavior
- Miss an entire operation described in the spec
- Order randomly

<!-- LAB-ONLY:START -->

## Completion -- DO NOT STOP HERE

> **Lab-only.** This section is the phase-continuation fix for fully
> autonomous lab runs. Delete this block (through `LAB-ONLY:END`) when
> exporting -- see the note at the top of `.pi/AGENTS.md`.

The test list is only a plan. Writing it is **not** a stopping point.
This is a single autonomous run: the Test List Phase and the first Red
Phase happen in **one continuous turn**, with no pause and no handoff
between them.

After printing the summary above, you MUST, in the **same turn**, without
waiting for any confirmation:

1. Read `.pi/skills/red/SKILL.md`.
2. Activate the first `it.todo()` test.
3. Produce the `## Red` heading and the `Red Phase Complete:` prediction
   lines for that first test.

Then continue Red -> Green -> Refactor for every test until all pass and
you have written `experiment-done.txt` containing `DONE`.

Emit this exact line to mark the boundary, then immediately keep working
in the same turn:

```
Test List Phase Complete. Continuing now to the Red phase for test 1 (no stop).
```

The words after that line in your output MUST be the `## Red` heading for
test 1. If your turn ends with the test list, the run has failed.

<!-- LAB-ONLY:END -->
