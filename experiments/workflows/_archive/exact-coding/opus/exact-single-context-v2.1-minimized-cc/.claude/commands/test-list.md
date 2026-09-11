# TDD Test List Phase

Create a `it.todo()` test list covering **base functionality only**, in
order from simplest to most complex.

## Context: $ARGUMENTS

## Rules

- Cover empty/zero, single element, two elements, multiple elements,
  basic validation as far as the spec demands.
- Skip advanced features, edge cases, performance, exotic inputs,
  error-handling beyond the basics.
- One behaviour per test. Independent tests.
- Do not write executable test code yet — only `it.todo()` entries.

## Output

Write the test file:

```typescript
import { describe, it, expect } from "vitest";
import { functionName } from "./implementation.js";

describe("Feature Name", () => {
  it.todo("should [simplest case]");
  it.todo("should [next case]");
  // ... ordered simple → complex
});
```

Then output:

```
📋 Test List Created:
**Feature**: [name]
**Test File**: [filename].spec.ts
**Tests**: [count]

1. [first description]
2. [second description]
...

Proceeding to Red phase with the first test.
```
