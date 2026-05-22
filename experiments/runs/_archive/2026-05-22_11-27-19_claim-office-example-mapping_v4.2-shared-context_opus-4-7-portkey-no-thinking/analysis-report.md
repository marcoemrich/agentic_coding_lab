# Analysis Report: 2026-05-22_11-27-19_claim-office-example-mapping_v4.2-shared-context_opus-4-7-portkey-no-thinking

Generated: 2026-05-22T12:50:51+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4.2-shared-context |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 5011s |
| Started | 2026-05-22T11:27:19+00:00 |
| Ended | 2026-05-22T12:50:51+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 199
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 771
- **Active tests**: 39
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (39 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-22_11-27-19_claim-office-example-mapping_v4.2-shared-context_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-22_11-27-19_claim-office-example-mapping_v4.2-shared-context_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (39 tests) 798ms

 Test Files  1 passed (1)
      Tests  39 passed (39)
   Start at  12:50:51
   Duration  989ms (transform 60ms, setup 0ms, collect 59ms, tests 798ms, environment 0ms, prepare 47ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 84% |
| Branches | 88% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 64 | ×1 | 64 |
| Invocations | 94 | ×2 | 188 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 10 | ×5 | 50 |
| Assignments | 60 | ×6 | 360 |
| **Total Mass** | | | **726** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 170 |
| Functions | 23 |
| Longest Function | 11 lines |
| Avg LOC/Function | 5.13 |
| Median LOC/Function | 3.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 3 |
| Code Quality | 0 |
| **Total** | **3** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 4 | 1.76 | 0 |
| Cognitive (SonarJS) | 4 | 1.80 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 17796795 |
| Context Utilization | 16% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 39 |
| Avg Cycle Time | 135.50s |
| Avg Red Phase | 49.96s |
| Avg Green Phase | 37.01s |
| Avg Refactor Phase | 48.53s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 42 |
| Predictions Total | 42 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 27 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 12 |


