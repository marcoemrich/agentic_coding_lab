# Analysis Report: 2026-10-01_07-25-47_claim-office-example-mapping_exact-ptdd-v1-cc_opus-5-5-no-thinking-2

Generated: 2026-10-01T07:40:55+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5 |
| Thinking | unknown |
| Duration | 903s |
| Started | 2026-10-01T07:25:47+00:00 |
| Ended | 2026-10-01T07:40:54+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, claim.ts, cli.ts, item.ts, premium.ts
- **Implementation LOC** (total): 228
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 263
- **Active tests**: 48
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (48 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-01_07-25-47_claim-office-example-mapping_exact-ptdd-v1-cc_opus-5-5-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-01_07-25-47_claim-office-example-mapping_exact-ptdd-v1-cc_opus-5-5-no-thinking-2

 ✓ src/claim-office.spec.ts  (48 tests) 3106ms

 Test Files  1 passed (1)
      Tests  48 passed (48)
   Start at  07:40:56
   Duration  3.54s (transform 124ms, setup 0ms, collect 135ms, tests 3.11s, environment 0ms, prepare 92ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 90% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 58 | ×1 | 58 |
| Invocations | 83 | ×2 | 166 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 8 | ×5 | 40 |
| Assignments | 51 | ×6 | 306 |
| **Total Mass** | | | **630** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 191 |
| Functions | 20 |
| Longest Function | 13 lines |
| Avg LOC/Function | 5.60 |
| Median LOC/Function | 5.00 |
| Imports | 6 |

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
| McCabe (Cyclomatic) | 4 | 1.41 | 0 |
| Cognitive (SonarJS) | 3 | 1.75 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 22775249 |
| Context Utilization | 66% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 7.02s |
| Avg Red Phase | 7.02s |
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


