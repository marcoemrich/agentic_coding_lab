---
name: test-list
description: TDD Test List Phase - Create a comprehensive test list covering every example and rule from the specification
---

# TDD Test List Phase

You are now in the **Test List Phase** of TDD. Follow these instructions to create a comprehensive test list.

## Your Mission

Create a comprehensive test list that covers **every example and rule** from the specification:
1. Read `prompt.md` thoroughly -- every rule, every example, every clarifying question
2. Turn each example into at least one `it.todo()` test case
3. Order tests from simplest to most complex
4. Use `it.todo()` only -- no executable tests yet

## Context: $ARGUMENTS

## Test List Creation Process

### Step 1: Understand the Feature
Read the complete `prompt.md` specification. Pay special attention to
integration examples and clarifying questions (marked with ?) -- these
disambiguate rules that may seem open to interpretation in isolation.
- What are all operations the system must support?
- What rules govern each operation?
- Which examples in the spec illustrate these rules?

### Step 2: Identify Test Cases from the Spec
Walk through the specification section by section. For each rule and each example:
- Create a test case that verifies the described behavior
- Include the **expected numeric values** from the spec in the test description
- If a clarifying question resolves an ambiguity, create a test for the clarified interpretation
- If the spec uses an example-mapping format (rules, examples, questions), every listed example must have a corresponding test

### Step 3: Order Tests (Simple -> Complex)
Arrange tests in increasing complexity:
1. Simplest case (often empty/zero/single item)
2. Individual rules in isolation
3. Rules with modifiers
4. Combinations of multiple rules
5. Multi-step scenarios (e.g., operations that reference earlier results)

### Step 4: Write Test Descriptions
For each test case:
- Use `it.todo("description")`
- Include expected values: `"should return 115 G (100 base + 10 first-insurance + 5 fee)"`
- Be specific and unambiguous
- Reference the rule being tested

### Step 5: Review Test List
Check for:
- Every spec example is covered by at least one test
- Every operation described in the spec has tests
- Every clarifying question has a corresponding test
- Tests are ordered simple -> complex
- Each test is independent
- Descriptions include expected values
- All tests use `it.todo()`

## Output Format

```typescript
import { describe, it, expect } from "vitest";
import { functionName } from "./[feature-name].js";

describe("Feature Name", () => {
  it.todo("should [expected behavior] -- [expected value]");
  it.todo("should [next behavior] -- [expected value]");
  // ... ordered simple -> complex, covering ALL spec examples
});
```

### Test List Summary
After creating test list, provide summary:
```
Test List Created:
**Feature**: [feature name]
**Test File**: [filename].spec.ts
**Tests**: [count]

**Test Cases** (ordered simple -> complex):
1. [first test description]
2. [second test description]
...

**Next Step**: Proceed to Red phase to activate the first test.
```

## Red Flags

Watch for these issues:
- Tests ordered randomly (not simple -> complex)
- Vague or unclear test descriptions
- Tests depending on each other
- Writing executable tests instead of `it.todo()`
- Thinking about implementation instead of behavior
- Missing an entire operation described in the spec

## Remember

- **Cover every spec example** - All rules, all examples, all clarifications
- **`it.todo()` for all tests** - No executable tests yet
- **Simple -> complex** - Order matters
- **Clear descriptions** - Include expected values
- **Independent tests** - No dependencies
- **No implementation** - Focus on "what", not "how"

Your goal is to create a comprehensive, well-ordered test list that covers all specified behavior and sets up the developer for successful TDD workflow.

## Completion

After completing the test list, proceed to Red phase:

```
Test List Phase Complete. Proceeding to Red phase with the first test.
```
