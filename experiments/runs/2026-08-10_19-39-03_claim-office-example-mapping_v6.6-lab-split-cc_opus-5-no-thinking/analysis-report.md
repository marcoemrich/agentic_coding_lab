# Analysis Report: 2026-08-10_19-39-03_claim-office-example-mapping_v6.6-lab-split-cc_opus-5-no-thinking

Generated: 2026-08-10T21:25:23+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.6-lab-split-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 6378s |
| Started | 2026-08-10T19:39:03+00:00 |
| Ended | 2026-08-10T21:25:23+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts, coverage.ts, pricing.ts, rejection.ts, rounding.ts
- **Implementation LOC** (total): 613
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 624
- **Active tests**: 38
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (43 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_19-39-03_claim-office-example-mapping_v6.6-lab-split-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_19-39-03_claim-office-example-mapping_v6.6-lab-split-cc_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (38 tests) 9ms
 ✓ src/cli.spec.ts  (5 tests) 1629ms

 Test Files  2 passed (2)
      Tests  43 passed (43)
   Start at  21:25:24
   Duration  1.98s (transform 78ms, setup 0ms, collect 88ms, tests 1.64s, environment 0ms, prepare 88ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 95 | ×1 | 95 |
| Invocations | 92 | ×2 | 184 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 19 | ×5 | 95 |
| Assignments | 106 | ×6 | 636 |
| **Total Mass** | | | **1058** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 341 |
| Functions | 33 |
| Longest Function | 14 lines |
| Avg LOC/Function | 2.91 |
| Median LOC/Function | 2.00 |
| Imports | 10 |

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
| McCabe (Cyclomatic) | 3 | 1.25 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 124358562 |
| Context Utilization | 226% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 43 |
| Avg Cycle Time | 161.99s |
| Avg Red Phase | 30.81s |
| Avg Green Phase | 37.5s |
| Avg Refactor Phase | 93.68s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 84 |
| Predictions Total | 86 |
| Accuracy | 97% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 42 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 21 |


