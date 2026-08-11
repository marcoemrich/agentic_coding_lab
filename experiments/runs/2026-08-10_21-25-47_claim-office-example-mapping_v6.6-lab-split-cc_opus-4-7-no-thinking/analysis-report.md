# Analysis Report: 2026-08-10_21-25-47_claim-office-example-mapping_v6.6-lab-split-cc_opus-4-7-no-thinking

Generated: 2026-08-10T22:18:19+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.6-lab-split-cc |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 3151s |
| Started | 2026-08-10T21:25:47+00:00 |
| Ended | 2026-08-10T22:18:19+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 235
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 342
- **Active tests**: 22
- **Remaining todos**: 24

## Test Results

**Status**: ✅ All tests passing (22 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_21-25-47_claim-office-example-mapping_v6.6-lab-split-cc_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_21-25-47_claim-office-example-mapping_v6.6-lab-split-cc_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (46 tests | 24 skipped) 5ms

 Test Files  1 passed (1)
      Tests  22 passed | 24 todo (46)
   Start at  22:18:20
   Duration  168ms (transform 38ms, setup 0ms, collect 36ms, tests 5ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 60 | ×1 | 60 |
| Invocations | 78 | ×2 | 156 |
| Conditionals | 8 | ×4 | 32 |
| Loops | 9 | ×5 | 45 |
| Assignments | 95 | ×6 | 570 |
| **Total Mass** | | | **863** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 191 |
| Functions | 32 |
| Longest Function | 12 lines |
| Avg LOC/Function | 3.78 |
| Median LOC/Function | 2.00 |
| Imports | 1 |

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
| McCabe (Cyclomatic) | 3 | 1.31 | 0 |
| Cognitive (SonarJS) | 2 | 1.25 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 55624756 |
| Context Utilization | 27% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 19 |
| Avg Cycle Time | 147.24s |
| Avg Red Phase | 38.35s |
| Avg Green Phase | 35.91s |
| Avg Refactor Phase | 72.98s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 34 |
| Predictions Total | 34 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 18 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


