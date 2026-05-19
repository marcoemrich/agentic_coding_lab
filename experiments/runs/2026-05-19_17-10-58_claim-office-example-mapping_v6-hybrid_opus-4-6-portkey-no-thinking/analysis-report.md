# Analysis Report: 2026-05-19_17-10-58_claim-office-example-mapping_v6-hybrid_opus-4-6-portkey-no-thinking

Generated: 2026-05-19T17:39:22+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6-hybrid |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 1702s |
| Started | 2026-05-19T17:10:58+00:00 |
| Ended | 2026-05-19T17:39:22+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 84
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 377
- **Active tests**: 23
- **Remaining todos**: 16

## Test Results

**Status**: ✅ All tests passing (23 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-19_17-10-58_claim-office-example-mapping_v6-hybrid_opus-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-19_17-10-58_claim-office-example-mapping_v6-hybrid_opus-4-6-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (39 tests | 16 skipped) 4ms

 Test Files  1 passed (1)
      Tests  23 passed | 16 todo (39)
   Start at  17:39:23
   Duration  193ms (transform 43ms, setup 0ms, collect 42ms, tests 4ms, environment 0ms, prepare 55ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 86% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 41 | ×1 | 41 |
| Invocations | 22 | ×2 | 44 |
| Conditionals | 6 | ×4 | 24 |
| Loops | 3 | ×5 | 15 |
| Assignments | 36 | ×6 | 216 |
| **Total Mass** | | | **340** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 72 |
| Functions | 5 |
| Longest Function | 23 lines |
| Avg LOC/Function | 11.20 |
| Median LOC/Function | 10.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 7 |
| Code Quality | 0 |
| **Total** | **7** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 7 | 2.38 | 0 |
| Cognitive (SonarJS) | 7 | 4.67 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 417652 |
| Context Utilization | 20% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 0 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
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
| Tests Passed Immediately | 0 |


