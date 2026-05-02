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
