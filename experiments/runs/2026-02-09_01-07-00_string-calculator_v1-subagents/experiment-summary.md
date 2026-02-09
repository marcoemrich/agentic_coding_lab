# TDD Experiment Summary

## Configuration
- **Workflow**: v1-subagents
- **Kata**: String Calculator
- **Timestamp**: 2026-02-09
- **Start time**: 2026-02-09T01:07:00+01:00

## Duration & Timings

### Total Duration
- **Total experiment time**: ~5 minutes 9 seconds (309,418 ms)

### Phase Timings

| Phase | Agent | Duration (ms) | Duration (s) |
|-------|-------|---------------|--------------|
| Test List | test-list | 30,875 | 30.9 |
| Cycle 1 - Red | red | 30,922 | 30.9 |
| Cycle 1 - Green | green | 19,163 | 19.2 |
| Cycle 1 - Refactor | refactor | 30,920 | 30.9 |
| Cycle 2 - Red | red | 23,610 | 23.6 |
| Cycle 2 - Green | green | 19,849 | 19.8 |
| Cycle 2 - Refactor | refactor | 49,310 | 49.3 |
| Cycle 3 - Red | red | 23,390 | 23.4 |
| Cycle 3 - Green | green | 20,466 | 20.5 |
| Cycle 3 - Refactor | refactor | 47,830 | 47.8 |
| Cycle 4 - Red | red | 33,206 | 33.2 |
| Cycle 4 - Green | green | 14,619 | 14.6 |
| Cycle 4 - Refactor | refactor | 45,228 | 45.2 |
| **Total** | | **389,388** | **389.4** |

### Token Usage by Phase

| Phase | Tokens Used |
|-------|-------------|
| Test List | 20,905 |
| Cycle 1 (R/G/R) | 21,507 + 20,529 + 21,863 = 63,899 |
| Cycle 2 (R/G/R) | 20,621 + 20,623 + 22,226 = 63,470 |
| Cycle 3 (R/G/R) | 20,691 + 20,721 + 23,350 = 64,762 |
| Cycle 4 (R/G/R) | 20,770 + 20,386 + 22,914 = 64,070 |
| **Total** | **277,106** |

### Context Utilization

**Context window size**: 200,000 tokens (Opus 4.6)

| Phase | Tokens Used | Context Remaining | Utilization |
|-------|-------------|-------------------|-------------|
| Test List | 20,905 | 179,095 | 10.5% |
| Cycle 1 - Red | 21,507 | 178,493 | 10.8% |
| Cycle 1 - Green | 20,529 | 179,471 | 10.3% |
| Cycle 1 - Refactor | 21,863 | 178,137 | 10.9% |
| Cycle 2 - Red | 20,621 | 179,379 | 10.3% |
| Cycle 2 - Green | 20,623 | 179,377 | 10.3% |
| Cycle 2 - Refactor | 22,226 | 177,774 | 11.1% |
| Cycle 3 - Red | 20,691 | 179,309 | 10.3% |
| Cycle 3 - Green | 20,721 | 179,279 | 10.4% |
| Cycle 3 - Refactor | 23,350 | 176,650 | 11.7% |
| Cycle 4 - Red | 20,770 | 179,230 | 10.4% |
| Cycle 4 - Green | 20,386 | 179,614 | 10.2% |
| Cycle 4 - Refactor | 22,914 | 177,086 | 11.5% |

**Note**: For v1-subagents, each agent starts with fresh context (~10-12% utilization per agent). Main context accumulates orchestration overhead only.

### Average Cycle Time
- **Average per TDD cycle**: ~65.1 seconds (Red + Green + Refactor)
- **Average Red phase**: 27.9 seconds
- **Average Green phase**: 18.5 seconds
- **Average Refactor phase**: 43.3 seconds

## Test List
1. should return 0 for empty string
2. should return the number for a single number
3. should return sum for two comma-separated numbers
4. should return sum for multiple comma-separated numbers

## Cycle Details

| # | Test | Red Prediction | Green Approach | Refactor | Mass |
|---|------|----------------|----------------|----------|------|
| 1 | Empty string → 0 | ✅ Expected 0, Received undefined | Hardcoded `return 0` | No changes needed | 2 |
| 2 | Single number → number | ✅ Expected 5, Received 0 | Added `if (numbers === "") return 0; return Number(numbers)` | No changes (evaluated ternary, kept if/return) | 9 |
| 3 | Two numbers → sum | ✅ Expected 3, Received NaN | Added `split(",").reduce()` | Renamed `parts`→`numberStrings`, `part`→`numStr` | 33 |
| 4 | Multiple numbers → sum | ✅ Predicted pass (test passed immediately) | No changes needed | No changes needed | 33 |

## Final Metrics
- **Total tests**: 4
- **All passing**: ✅
- **Final code mass**: 33
- **Refactorings applied**: 1 (naming improvement in cycle 3)
- **Prediction accuracy**: 4/4 = 100%

## Code

### Implementation (`src/string-calculator.ts`)
```typescript
export function add(numbers: string): number {
  if (numbers === "") return 0;
  const numberStrings = numbers.split(",");
  return numberStrings.reduce((sum, numStr) => sum + Number(numStr), 0);
}
```

### Tests (`src/string-calculator.spec.ts`)
```typescript
import { describe, it, expect } from "vitest";
import { add } from "./string-calculator.js";

describe("String Calculator", () => {
  it("should return 0 for empty string", () => {
    expect(add("")).toBe(0);
  });
  it("should return the number for a single number", () => {
    expect(add("5")).toBe(5);
  });
  it("should return sum for two comma-separated numbers", () => {
    expect(add("1,2")).toBe(3);
  });
  it("should return sum for multiple comma-separated numbers", () => {
    expect(add("1,2,3,4,5")).toBe(15);
  });
});
```

## Observations

1. **Test 4 passed immediately** - The `split/reduce` implementation from Test 3 naturally generalized to handle multiple numbers. This demonstrates how TDD's minimal implementations often become general solutions.

2. **Prediction accuracy was 100%** - All predictions matched actual behavior, indicating good understanding of the codebase evolution.

3. **Single refactoring applied** - Variable naming improvement in cycle 3 (`parts`→`numberStrings`) improved code clarity without changing mass.

4. **Mass progression**: 2 → 9 → 33 → 33 - Most complexity came from the comma-parsing logic in Test 3.

5. **TDD discipline observation** - Test 4 passing immediately suggests the test list could have been optimized. The "two numbers" and "multiple numbers" tests drive the same implementation behavior. However, having both tests provides better documentation of expected behavior.
