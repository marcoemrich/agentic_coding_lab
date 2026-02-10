# TDD with TypeScript and Vitest

## Test File Creation
1. **Create specification file** with `.spec.ts` extension
2. **Import with explicit extensions** for local modules
3. **Use Vitest testing functions** (`describe`, `it`, `expect`)
4. **Follow TDD red-green-refactor** cycle
5. **Leverage TypeScript's type checking** during development

## Running Tests - CRITICAL REQUIREMENTS

**🚨 ALWAYS use pnpm with npm scripts**

### ✅ CORRECT - Use pnpm with npm scripts:
```bash
pnpm test                  # Run all tests
pnpm test:unit:basic      # Run basic unit tests only
pnpm test:watch           # Run tests in watch mode
pnpm run build            # Build the project
```

### ❌ WRONG - DO NOT use these:
```bash
npm test                          # Wrong package manager
npx vitest                        # Don't call vitest directly
vitest --run SomeFile.spec.tsx    # Don't call vitest directly
npx vitest SomeFile.spec.tsx      # Don't use npx
npm run test                      # Wrong package manager
```

### Why This Matters
- **npm scripts orchestrate multiple steps** (e.g., `test:unit` runs TypeScript compilation first)
- **Configuration is managed centrally** in package.json
- **Consistency across development and CI** environments
- **pnpm is the project's package manager** - using npm or npx causes inconsistencies

## Example Test Template
```typescript
// calculator.spec.ts
import { describe, it, expect } from "vitest";
import { calculate } from "./calculator.js";

describe("Calculator", () => {
  it.todo("should handle basic operations");
  it.todo("should validate input types");
  it.todo("should handle edge cases");
});
```
