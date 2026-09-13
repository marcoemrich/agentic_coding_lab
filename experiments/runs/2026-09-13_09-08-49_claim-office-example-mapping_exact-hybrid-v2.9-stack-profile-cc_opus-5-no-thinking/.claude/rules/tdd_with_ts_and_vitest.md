# TDD with TypeScript and Vitest

## Test File Creation
1. **Create specification file** with `.spec.ts` extension
2. **Import with explicit extensions** for local modules
3. **Use Vitest testing functions** (`describe`, `it`, `expect`)
4. **Follow TDD red-green-refactor** cycle
5. **Leverage TypeScript's type checking** during development

## Running Tests

Run tests with `pnpm test`.

## Example Test Template

The test list comes from the kata's specification — do not add generic "validate input types" or "edge cases" tests unless the spec calls for them.

```typescript
// some-feature.spec.ts
import { describe, it, expect } from "vitest";
import { someFeature } from "./some-feature.js";

describe("Some Feature", () => {
  it.todo("[first behaviour from the spec]");
  it.todo("[second behaviour from the spec]");
});
```

## Test-list phase

Use `it.todo()` as the inactive-test mechanism. Turn every rule and example into at least one `it.todo()` and keep all entries inactive until their Red cycle.

```typescript
import { describe, it, expect } from "vitest";
import { functionName } from "./implementation.js";

describe("Feature Name", () => {
  it.todo("should [behavior] — [expected value from spec]");
  it.todo("should [next behavior] — [expected value from spec]");
  // ... ordered simple → complex, covering ALL spec examples
});
```

Report the test file as `[filename].spec.ts` in the Test List summary.

## Red phase

Activate one test by converting exactly one `it.todo()` to an executable Vitest test. Leave every other test as `it.todo()`:

```typescript
// Convert from:
it.todo("should return 0 for empty input");

// To:
it("should return 0 for empty input", () => {
  expect(calculate("")).toBe(0);
});
```

Run `pnpm test:unit:basic` for both Red checks. First predict and verify the TypeScript load/compilation failure. For a missing function, a representative prediction is `Cannot find name 'calculate'`. Then add only a compilation scaffold:

```typescript
export const calculate = (input: string): number => {
  return undefined as unknown as number; // Intentionally wrong
};
```

Predict the Vitest assertion failure separately, including expected and received values. The scaffold above should advance the failure from compilation to runtime without implementing the behavior.

## Green phase

Run `pnpm test:unit:basic` after the minimal production change. Verify that the active test and all previous tests pass.

Use this TypeScript progression only as each active test forces it:

```typescript
// For first test "should return 0 for empty input":
export const calculate = (input: string): number => {
  return 0; // Minimal - just make the test pass
};

// For second test "should return number for single input":
export const calculate = (input: string): number => {
  if (input === "") return 0;
  return parseInt(input); // Still simple
};

// For third test "should add two numbers":
export const calculate = (input: string): number => {
  if (input === "") return 0;
  const numbers = input.split(",");
  if (numbers.length === 1) return parseInt(numbers[0]);
  return parseInt(numbers[0]) + parseInt(numbers[1]); // Only now add logic
};
```

The progression is hardcoded return, then a simple conditional, then generalization only when another active test requires it:

```typescript
// Hardcoded return
return 0;

// Simple conditional
if (input === "") return 0;
return parseInt(input);

// Generalization only when forced
return input.split(",").reduce((sum, n) => sum + parseInt(n), 0);
```

## Refactor phase and APP examples

For TypeScript, classify APP components with these representative forms:

- **Constant** (Mass: 1): `5`, `"hello"`, `true`
- **Binding/Scalar** (Mass: 1): `amount`, `result`
- **Invocation** (Mass: 2): `calculate()`, `Math.max()`
- **Conditional** (Mass: 4): `if`, `switch`, `?:`
- **Loop** (Mass: 5): `for`, `forEach`, `map`, and iteration performed by `reduce`
- **Assignment** (Mass: 6): `x = 5`, `count++`

Initial APP example:

```typescript
function calculate(numbers: number[]): number {
  return numbers.reduce((sum, num) => sum + num, 0);
}
```

Component count: one constant, three bindings, two invocations, one loop, no conditionals, and no assignments; total mass 13.

### Naming improvement

```typescript
// Before (mass: 13)
function calc(nums: number[]): number {
  return nums.reduce((s, n) => s + n, 0);
}

// After (mass: 13, clarity improved)
function sumNumbers(numbers: number[]): number {
  return numbers.reduce((sum, num) => sum + num, 0);
}
```

The mass stays 13 while Rule 2 improves because the names reveal intent.

### Extract duplicated knowledge

```typescript
// Before (mass: 22, duplication)
function differsByOneLetter(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diffs = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) diffs++;
  }
  return diffs === 1;
}

function isAdjacent(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let count = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) count++;
  }
  return count === 1;
}

// After (mass: reduced, no duplication)
const countDifferences = (a: string, b: string): number => {
  if (a.length !== b.length) return Infinity;
  return a.split('').reduce((count, char, i) =>
    char !== b[i] ? count + 1 : count, 0
  );
};

const differsByOneLetter = (a: string, b: string): boolean =>
  countDifferences(a, b) === 1;
```

This applies Rule 3, reduces duplication and mass, and improves maintainability.

### No refactoring needed

```typescript
function isEmpty(str: string): boolean {
  return str.length === 0;
}
```

If the name reveals intent, no duplication exists, the mass is already minimal, and no unnecessary abstraction remains, document that evaluation and leave the code unchanged.
