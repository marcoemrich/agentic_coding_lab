# Analysis Report: 2026-05-21_12-21-26_claim-office-example-mapping_v4.2-shared-context_opus-4-6-portkey-no-thinking

Generated: 2026-05-21T13:51:27+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4.2-shared-context |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 5400s |
| Started | 2026-05-21T12:21:26+00:00 |
| Ended | 2026-05-21T13:51:27+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts
- **Implementation LOC** (total): 129
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 646
- **Active tests**: 38
- **Remaining todos**: 13

## Test Results

**Status**: ✅ All tests passing (38 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-21_12-21-26_claim-office-example-mapping_v4.2-shared-context_opus-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-21_12-21-26_claim-office-example-mapping_v4.2-shared-context_opus-4-6-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (51 tests | 13 skipped) 5ms

 Test Files  1 passed (1)
      Tests  38 passed | 13 todo (51)
   Start at  13:51:28
   Duration  173ms (transform 38ms, setup 0ms, collect 36ms, tests 5ms, environment 0ms, prepare 48ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 46 | ×1 | 46 |
| Invocations | 20 | ×2 | 40 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 9 | ×5 | 45 |
| Assignments | 40 | ×6 | 240 |
| **Total Mass** | | | **415** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 113 |
| Functions | 2 |
| Longest Function | 34 lines |
| Avg LOC/Function | 32.00 |
| Median LOC/Function | 32.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 3 |
| Code Quality | 0 |
| **Total** | **4** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 11 | 5.00 | 1 |
| Cognitive (SonarJS) | 14 | 7.67 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 11863833 |
| Context Utilization | 57% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 38 |
| Avg Cycle Time | 191.92s |
| Avg Red Phase | 58.41s |
| Avg Green Phase | 48.67s |
| Avg Refactor Phase | 84.84s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 143 |
| Predictions Total | 145 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 18 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 19 |


