# Analysis Report: 2026-05-21_10-54-56_claim-office-example-mapping_v3-basic-tdd_opus-4-6-portkey-no-thinking

Generated: 2026-05-21T10:59:26+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v3-basic-tdd |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 268s |
| Started | 2026-05-21T10:54:56+00:00 |
| Ended | 2026-05-21T10:59:26+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 307
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 629
- **Active tests**: 42
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (42 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-21_10-54-56_claim-office-example-mapping_v3-basic-tdd_opus-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-21_10-54-56_claim-office-example-mapping_v3-basic-tdd_opus-4-6-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (42 tests) 7ms

 Test Files  1 passed (1)
      Tests  42 passed (42)
   Start at  10:59:26
   Duration  175ms (transform 43ms, setup 0ms, collect 45ms, tests 7ms, environment 0ms, prepare 41ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 75 | ×1 | 75 |
| Invocations | 103 | ×2 | 206 |
| Conditionals | 23 | ×4 | 92 |
| Loops | 16 | ×5 | 80 |
| Assignments | 71 | ×6 | 426 |
| **Total Mass** | | | **879** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 241 |
| Functions | 11 |
| Longest Function | 26 lines |
| Avg LOC/Function | 8.55 |
| Median LOC/Function | 4.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 3 |
| Duplication | 0 |
| Magic Numbers | 10 |
| Code Quality | 0 |
| **Total** | **13** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 20 | 3.80 | 1 |
| Cognitive (SonarJS) | 18 | 5.33 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2083561 |
| Context Utilization | 29% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 2 |
| Avg Cycle Time | 6.65s |
| Avg Red Phase | 6.65s |
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


