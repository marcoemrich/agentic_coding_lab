# TDD Test List Phase

You are now in the **Test List Phase** of TDD. Create the full list of base-functionality tests as `it.todo()` entries before any red phase begins.

## Why test-list first

Writing the complete base-functionality list before activating the first test is what keeps later phases honest. Once you start in red, the impulse is to grow the test list reactively, one example at a time, shaped by what feels easy to implement. That implementation-driven growth produces gappy test sets and surprises in late green phases. Committing the list upfront forces the scope decision *before* implementation creates pressure — and the resulting list becomes the contract the red phase walks down.

The tests are `it.todo()`, not executable: no logic decisions yet, just naming the behaviours.

## Context: $ARGUMENTS

## Scope: base functionality only

Include the smallest set of cases that demonstrates the core behaviour, ordered simple → complex:

- **Empty / zero case** — what happens when the input is empty?
- **Single element** — the simplest non-empty input
- **Two elements** — introduces interaction
- **Multiple elements** — generalises the pattern
- **Essential validation** — only constraints the spec actually requires

Exclude advanced features, edge cases, performance work, exotic inputs, and error handling beyond the basics. These belong in a follow-up cycle once the base behaviour is stable.

3-6 tests is the typical target. Fewer means the base scope is incomplete; more usually means edge cases crept in.

## Process

1. **Understand the feature.** Identify the core behaviour and the minimum viable shape — what the feature *is*, not what it might become.
2. **Pick the test cases.** 3-6 entries covering empty → single → two → multiple → essential validation.
3. **Order from simple to complex.** Each subsequent test introduces one new dimension of behaviour.
4. **Write the test file** with `it.todo()` entries:

   ```typescript
   import { describe, it, expect } from "vitest";
   import { functionName } from "./implementation.js";

   describe("Feature Name", () => {
     it.todo("should [simplest case]");
     it.todo("should [next case]");
     it.todo("should [more complex case]");
   });
   ```

5. **Report the list:**

   ```
   Test List Created:
   **Feature**: [feature name]
   **Test File**: [filename].spec.ts
   **Base Functionality Tests**: [count]

   **Test Cases** (ordered simple → complex):
   1. [first test description]
   2. [second test description]
   3. [third test description]

   **Advanced Features** (NOT included):
   - [feature 1] - save for later
   - [feature 2] - save for later

   **Next Step**: Invoke `/red` to activate the first test.
   ```

## Completion

After the list is written, proceed to the Red phase:

```
Test List Phase Complete. Proceeding to Red phase with the first test.
```
