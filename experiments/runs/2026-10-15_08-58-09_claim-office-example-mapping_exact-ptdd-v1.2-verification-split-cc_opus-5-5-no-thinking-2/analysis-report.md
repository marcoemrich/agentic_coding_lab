# Analysis Report: 2026-10-15_08-58-09_claim-office-example-mapping_exact-ptdd-v1.2-verification-split-cc_opus-5-5-no-thinking-2

Generated: 2026-10-15T09:16:03+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1.2-verification-split-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5 |
| Thinking | unknown |
| Duration | 1070s |
| Started | 2026-10-15T08:58:09+00:00 |
| Ended | 2026-10-15T09:16:03+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, claim.ts, cli.ts, premium.ts, price-list.ts
- **Implementation LOC** (total): 224
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 303
- **Active tests**: 46
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (46 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-15_08-58-09_claim-office-example-mapping_exact-ptdd-v1.2-verification-split-cc_opus-5-5-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-15_08-58-09_claim-office-example-mapping_exact-ptdd-v1.2-verification-split-cc_opus-5-5-no-thinking-2

 ✓ src/claim-office.spec.ts  (46 tests) 1049ms

 Test Files  1 passed (1)
      Tests  46 passed (46)
   Start at  09:16:04
   Duration  1.42s (transform 105ms, setup 0ms, collect 111ms, tests 1.05s, environment 0ms, prepare 95ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 60 | ×1 | 60 |
| Invocations | 84 | ×2 | 168 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 9 | ×5 | 45 |
| Assignments | 54 | ×6 | 324 |
| **Total Mass** | | | **645** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 183 |
| Functions | 21 |
| Longest Function | 14 lines |
| Avg LOC/Function | 5.43 |
| Median LOC/Function | 5.00 |
| Imports | 7 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 0 |
| Code Quality | 0 |
| **Total** | **0** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 3 | 1.48 | 0 |
| Cognitive (SonarJS) | 2 | 1.36 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 28079146 |
| Context Utilization | 76% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 11.17s |
| Avg Red Phase | 11.17s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 0 |
| Predictions Total | 0 |
| Accuracy | N/A |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


