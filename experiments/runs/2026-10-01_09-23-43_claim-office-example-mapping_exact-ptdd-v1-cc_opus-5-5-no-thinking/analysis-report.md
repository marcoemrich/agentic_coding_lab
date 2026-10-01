# Analysis Report: 2026-10-01_09-23-43_claim-office-example-mapping_exact-ptdd-v1-cc_opus-5-5-no-thinking

Generated: 2026-10-01T09:39:16+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5 |
| Thinking | unknown |
| Duration | 930s |
| Started | 2026-10-01T09:23:43+00:00 |
| Ended | 2026-10-01T09:39:16+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, claim.ts, cli.ts, premium.ts, price-list.ts
- **Implementation LOC** (total): 225
- **Test files**: claim-office.spec.ts, cli.spec.ts
- **Test LOC** (total): 326
- **Active tests**: 49
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (49 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-01_09-23-43_claim-office-example-mapping_exact-ptdd-v1-cc_opus-5-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-01_09-23-43_claim-office-example-mapping_exact-ptdd-v1-cc_opus-5-5-no-thinking

 ✓ src/claim-office.spec.ts  (44 tests) 11ms
 ✓ src/cli.spec.ts  (5 tests) 946ms

 Test Files  2 passed (2)
      Tests  49 passed (49)
   Start at  09:39:17
   Duration  1.53s (transform 114ms, setup 0ms, collect 114ms, tests 957ms, environment 0ms, prepare 143ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 60 | ×1 | 60 |
| Invocations | 77 | ×2 | 154 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 9 | ×5 | 45 |
| Assignments | 48 | ×6 | 288 |
| **Total Mass** | | | **599** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 188 |
| Functions | 23 |
| Longest Function | 15 lines |
| Avg LOC/Function | 4.35 |
| Median LOC/Function | 3.00 |
| Imports | 8 |

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
| McCabe (Cyclomatic) | 4 | 1.43 | 0 |
| Cognitive (SonarJS) | 3 | 1.44 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 26353742 |
| Context Utilization | 69% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 11.82s |
| Avg Red Phase | 11.82s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 10 |
| Predictions Total | 10 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


