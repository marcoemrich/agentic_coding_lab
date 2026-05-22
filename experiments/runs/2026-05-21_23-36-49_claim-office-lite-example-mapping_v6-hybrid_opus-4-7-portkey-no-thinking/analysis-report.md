# Analysis Report: 2026-05-21_23-36-49_claim-office-lite-example-mapping_v6-hybrid_opus-4-7-portkey-no-thinking

Generated: 2026-05-22T00:01:44+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-lite-example-mapping |
| Workflow | v6-hybrid |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 1494s |
| Started | 2026-05-21T23:36:49+00:00 |
| Ended | 2026-05-22T00:01:44+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 198
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 286
- **Active tests**: 29
- **Remaining todos**: 1

## Test Results

**Status**: ✅ All tests passing (29 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-21_23-36-49_claim-office-lite-example-mapping_v6-hybrid_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-21_23-36-49_claim-office-lite-example-mapping_v6-hybrid_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (30 tests | 1 skipped) 7ms

 Test Files  1 passed (1)
      Tests  29 passed | 1 todo (30)
   Start at  00:01:45
   Duration  189ms (transform 48ms, setup 0ms, collect 46ms, tests 7ms, environment 0ms, prepare 46ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 86% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 55 | ×1 | 55 |
| Invocations | 68 | ×2 | 136 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 8 | ×5 | 40 |
| Assignments | 68 | ×6 | 408 |
| **Total Mass** | | | **687** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 170 |
| Functions | 22 |
| Longest Function | 14 lines |
| Avg LOC/Function | 5.18 |
| Median LOC/Function | 4.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 2 |
| Code Quality | 0 |
| **Total** | **2** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 5 | 1.66 | 0 |
| Cognitive (SonarJS) | 4 | 1.69 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 35611726 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 29 |
| Avg Cycle Time | 89.71s |
| Avg Red Phase | 22.36s |
| Avg Green Phase | 22.52s |
| Avg Refactor Phase | 44.83s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 31 |
| Predictions Total | 31 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 11 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 15 |


