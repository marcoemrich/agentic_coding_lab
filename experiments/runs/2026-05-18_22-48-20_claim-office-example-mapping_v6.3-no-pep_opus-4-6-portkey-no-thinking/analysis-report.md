# Analysis Report: 2026-05-18_22-48-20_claim-office-example-mapping_v6.3-no-pep_opus-4-6-portkey-no-thinking

Generated: 2026-05-18T23:41:53+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.3-no-pep |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 3210s |
| Started | 2026-05-18T22:48:20+00:00 |
| Ended | 2026-05-18T23:41:53+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 165
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 798
- **Active tests**: 40
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (40 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-18_22-48-20_claim-office-example-mapping_v6.3-no-pep_opus-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-18_22-48-20_claim-office-example-mapping_v6.3-no-pep_opus-4-6-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (40 tests) 818ms

 Test Files  1 passed (1)
      Tests  40 passed (40)
   Start at  23:41:54
   Duration  1.05s (transform 55ms, setup 0ms, collect 72ms, tests 818ms, environment 0ms, prepare 60ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 95% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 57 | ×1 | 57 |
| Invocations | 53 | ×2 | 106 |
| Conditionals | 9 | ×4 | 36 |
| Loops | 11 | ×5 | 55 |
| Assignments | 63 | ×6 | 378 |
| **Total Mass** | | | **632** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 144 |
| Functions | 11 |
| Longest Function | 21 lines |
| Avg LOC/Function | 10.00 |
| Median LOC/Function | 8.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 1 |
| Code Quality | 0 |
| **Total** | **1** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 7 | 1.91 | 0 |
| Cognitive (SonarJS) | 9 | 2.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 53099807 |
| Context Utilization | 83% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 38 |
| Avg Cycle Time | 179.25s |
| Avg Red Phase | 28.43s |
| Avg Green Phase | 34.6s |
| Avg Refactor Phase | 116.22s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 75 |
| Predictions Total | 76 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 11 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 17 |


