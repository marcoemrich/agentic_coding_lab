# TDD with TypeScript and Vitest

- Spec files use the `.spec.ts` extension.
- Local module imports use explicit extensions.
- Tests use `describe`, `it`, `expect` from Vitest.
- Run tests with `pnpm test`.

The test list comes from the kata's specification — do not add generic
"validate input types" or "edge cases" tests unless the spec calls for
them.

## Test file template

```typescript
// some-feature.spec.ts
import { describe, it, expect } from "vitest";
import { someFeature } from "./some-feature.js";

describe("Some Feature", () => {
  it.todo("[first behaviour from the spec]");
  it.todo("[second behaviour from the spec]");
});
```
