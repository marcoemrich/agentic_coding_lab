# Analysis Report: 2026-05-21_23-29-03_claim-office-lite-example-mapping_v5-exact-single-context_opus-4-7-portkey-no-thinking

Generated: 2026-05-21T23:39:34+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-lite-example-mapping |
| Workflow | v5-exact-single-context |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 630s |
| Started | 2026-05-21T23:29:03+00:00 |
| Ended | 2026-05-21T23:39:34+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 173
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 448
- **Active tests**: 34
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (34 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-21_23-29-03_claim-office-lite-example-mapping_v5-exact-single-context_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-21_23-29-03_claim-office-lite-example-mapping_v5-exact-single-context_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (34 tests) 6ms

 Test Files  1 passed (1)
      Tests  34 passed (34)
   Start at  23:39:35
   Duration  179ms (transform 44ms, setup 0ms, collect 43ms, tests 6ms, environment 0ms, prepare 43ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 83% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 57 | ×1 | 57 |
| Invocations | 58 | ×2 | 116 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 7 | ×5 | 35 |
| Assignments | 79 | ×6 | 474 |
| **Total Mass** | | | **746** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 157 |
| Functions | 13 |
| Longest Function | 15 lines |
| Avg LOC/Function | 7.31 |
| Median LOC/Function | 7.00 |
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
| McCabe (Cyclomatic) | 6 | 2.05 | 0 |
| Cognitive (SonarJS) | 6 | 2.80 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 19977382 |
| Context Utilization | 13% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 3 |
| Avg Cycle Time | 199.01s |
| Avg Red Phase | 24.55s |
| Avg Green Phase | 11.67s |
| Avg Refactor Phase | 162.79s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 4 |
| Predictions Total | 4 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 3 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


