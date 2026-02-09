# TDD Test List Phase

You are now in the **Test List Phase** of TDD. Follow these instructions to create a comprehensive test list.

## Your Mission

Create a test list using `it.todo()` for BASE FUNCTIONALITY ONLY:
1. Identify the **core/base functionality** of the feature
2. Break it down into discrete, testable behaviors
3. Create test cases using `it.todo()` - NO executable tests yet
4. Order tests from simplest to most complex
5. Avoid advanced features or edge cases

## Context: $ARGUMENTS

## Test List Rules

### What to Include (Base Functionality)
- **Empty/zero cases**: What happens with empty input?
- **Single element cases**: Simplest non-empty input
- **Two element cases**: Introduces interaction
- **Multiple element cases**: Generalizes the pattern
- **Basic validation**: Essential constraints only

### What to Exclude (Save for Later)
- Advanced features
- Edge cases
- Performance optimizations
- Exotic inputs
- Error handling beyond basics

## Process

### Step 1: Understand the Feature
- What is the core functionality?
- What are the **essential behaviors** (not nice-to-haves)?
- What is the **minimum viable feature**?

### Step 2: Identify Base Test Cases
List 3-6 test cases covering base functionality only.

### Step 3: Order Tests (Simple → Complex)
1. Simplest case (often empty/zero)
2. Single element
3. Two elements
4. Multiple elements
5. Basic validation

### Step 4: Write Test File
Create the test file with `it.todo()` entries:

```typescript
import { describe, it, expect } from "vitest";
import { functionName } from "./implementation.js";

describe("Feature Name", () => {
  it.todo("should [simplest case]");
  it.todo("should [next case]");
  it.todo("should [more complex case]");
  // ... ordered simple → complex
});
```

### Step 5: Provide Summary

After creating the test list, output:

```
📋 Test List Created:
**Feature**: [feature name]
**Test File**: [filename].spec.ts
**Base Functionality Tests**: [count]

**Test Cases** (ordered simple → complex):
1. ✅ [first test description]
2. ✅ [second test description]
3. ✅ [third test description]
...

**Advanced Features** (NOT included):
- [feature 1] - save for later
- [feature 2] - save for later

**Next Step**: Invoke `/red` to activate the first test.
```

## Important Guidelines

### DO
- ✅ Focus on **base functionality only**
- ✅ Order tests **simple → complex**
- ✅ Use `it.todo()` for all tests
- ✅ Write **clear, specific descriptions**
- ✅ Keep tests **independent**
- ✅ One behavior per test

### DON'T
- ❌ Include advanced features
- ❌ Write executable tests (use `it.todo()`)
- ❌ Think about implementation
- ❌ Include edge cases
- ❌ Order randomly

## Human Checkpoint

After completing the test list:

```
📋 Test List Phase Complete.

Should I proceed to Red phase with the first test?
```

Wait for explicit approval before continuing.
