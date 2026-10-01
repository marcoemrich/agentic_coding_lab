# Analysis Report: 2026-10-01_02-02-59_claim-office-example-mapping_exact-ptdd-v1-cc_opus-5-no-thinking

Generated: 2026-10-01T02:23:47+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 1245s |
| Started | 2026-10-01T02:02:59+00:00 |
| Ended | 2026-10-01T02:23:47+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 298
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 718
- **Active tests**: 62
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (62 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-01_02-02-59_claim-office-example-mapping_exact-ptdd-v1-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-01_02-02-59_claim-office-example-mapping_exact-ptdd-v1-cc_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (62 tests) 3592ms

 Test Files  1 passed (1)
      Tests  62 passed (62)
   Start at  02:23:48
   Duration  3.95s (transform 107ms, setup 0ms, collect 92ms, tests 3.59s, environment 0ms, prepare 87ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 64 | ×1 | 64 |
| Invocations | 97 | ×2 | 194 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 7 | ×5 | 35 |
| Assignments | 51 | ×6 | 306 |
| **Total Mass** | | | **651** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 247 |
| Functions | 27 |
| Longest Function | 22 lines |
| Avg LOC/Function | 5.74 |
| Median LOC/Function | 4.00 |
| Imports | 2 |

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
| McCabe (Cyclomatic) | 4 | 1.66 | 0 |
| Cognitive (SonarJS) | 5 | 1.47 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 21446275 |
| Context Utilization | 74% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 62 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 120 |
| Predictions Total | 124 |
| Accuracy | 96% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 62 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


