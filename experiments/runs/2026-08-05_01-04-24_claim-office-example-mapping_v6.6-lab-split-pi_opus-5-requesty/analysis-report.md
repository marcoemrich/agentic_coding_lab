# Analysis Report: 2026-08-05_01-04-24_claim-office-example-mapping_v6.6-lab-split-pi_opus-5-requesty

Generated: 2026-08-05T02:02:51+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.6-lab-split-pi |
| Model | opus-5-requesty |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 3506s |
| Started | 2026-08-05T01:04:24+00:00 |
| Ended | 2026-08-05T02:02:51+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 292
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 478
- **Active tests**: 42
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (42 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-05_01-04-24_claim-office-example-mapping_v6.6-lab-split-pi_opus-5-requesty
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-05_01-04-24_claim-office-example-mapping_v6.6-lab-split-pi_opus-5-requesty

 ✓ src/claim-office.spec.ts  (42 tests) 557ms

 Test Files  1 passed (1)
      Tests  42 passed (42)
   Start at  02:02:52
   Duration  721ms (transform 38ms, setup 1ms, collect 37ms, tests 557ms, environment 0ms, prepare 41ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 94% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 60 | ×1 | 60 |
| Invocations | 63 | ×2 | 126 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 9 | ×5 | 45 |
| Assignments | 68 | ×6 | 408 |
| **Total Mass** | | | **679** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 219 |
| Functions | 24 |
| Longest Function | 15 lines |
| Avg LOC/Function | 3.62 |
| Median LOC/Function | 2.00 |
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
| McCabe (Cyclomatic) | 3 | 1.55 | 0 |
| Cognitive (SonarJS) | 3 | 1.36 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 15585158 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 43 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 37 |
| Predictions Total | 37 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 20 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


