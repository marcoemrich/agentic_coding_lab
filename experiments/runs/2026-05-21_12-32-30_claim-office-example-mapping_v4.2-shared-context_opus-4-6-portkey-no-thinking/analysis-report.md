# Analysis Report: 2026-05-21_12-32-30_claim-office-example-mapping_v4.2-shared-context_opus-4-6-portkey-no-thinking

Generated: 2026-05-21T14:02:31+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4.2-shared-context |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6, <synthetic> |
| Thinking | unknown |
| Duration | 5400s |
| Started | 2026-05-21T12:32:30+00:00 |
| Ended | 2026-05-21T14:02:31+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts
- **Implementation LOC** (total): 103
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 908
- **Active tests**: 35
- **Remaining todos**: 13

## Test Results

**Status**: ✅ All tests passing (35 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-21_12-32-30_claim-office-example-mapping_v4.2-shared-context_opus-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-21_12-32-30_claim-office-example-mapping_v4.2-shared-context_opus-4-6-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (48 tests | 13 skipped) 15ms

 Test Files  1 passed (1)
      Tests  35 passed | 13 todo (48)
   Start at  14:02:32
   Duration  188ms (transform 43ms, setup 0ms, collect 45ms, tests 15ms, environment 0ms, prepare 43ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 46 | ×1 | 46 |
| Invocations | 24 | ×2 | 48 |
| Conditionals | 6 | ×4 | 24 |
| Loops | 5 | ×5 | 25 |
| Assignments | 47 | ×6 | 282 |
| **Total Mass** | | | **425** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 98 |
| Functions | 3 |
| Longest Function | 37 lines |
| Avg LOC/Function | 23.00 |
| Median LOC/Function | 19.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 2 |
| Duplication | 0 |
| Magic Numbers | 2 |
| Code Quality | 0 |
| **Total** | **4** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 10 | 4.75 | 0 |
| Cognitive (SonarJS) | 13 | 7.00 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 11943414 |
| Context Utilization | 57% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 36 |
| Avg Cycle Time | 210.46s |
| Avg Red Phase | 61.16s |
| Avg Green Phase | 52.17s |
| Avg Refactor Phase | 97.13s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 133 |
| Predictions Total | 133 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 16 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 20 |


