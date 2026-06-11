# Analysis Report: 2026-06-10_03-09-21_claim-office-example-mapping_v4-exact-subagents_fable-5-no-thinking

Generated: 2026-06-10T05:03:35+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4-exact-subagents |
| Model | fable-5-no-thinking |
| Model Version(s) | claude-fable-5 |
| Thinking | unknown |
| Duration | 6853s |
| Started | 2026-06-10T03:09:21+00:00 |
| Ended | 2026-06-10T05:03:35+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 276
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 818
- **Active tests**: 44
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (46 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-06-10_03-09-21_claim-office-example-mapping_v4-exact-subagents_fable-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-06-10_03-09-21_claim-office-example-mapping_v4-exact-subagents_fable-5-no-thinking

 ✓ src/claim-office.spec.ts  (44 tests) 8ms
 ✓ src/cli.spec.ts  (2 tests) 736ms

 Test Files  2 passed (2)
      Tests  46 passed (46)
   Start at  05:03:36
   Duration  1.06s (transform 63ms, setup 0ms, collect 64ms, tests 744ms, environment 0ms, prepare 93ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 50 | ×1 | 50 |
| Invocations | 68 | ×2 | 136 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 8 | ×5 | 40 |
| Assignments | 88 | ×6 | 528 |
| **Total Mass** | | | **802** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 235 |
| Functions | 23 |
| Longest Function | 13 lines |
| Avg LOC/Function | 3.74 |
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
| McCabe (Cyclomatic) | 4 | 1.71 | 0 |
| Cognitive (SonarJS) | 4 | 1.56 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 16534780 |
| Context Utilization | 88% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 46 |
| Avg Cycle Time | 177.00s |
| Avg Red Phase | 52.9s |
| Avg Green Phase | 38.77s |
| Avg Refactor Phase | 85.33s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 92 |
| Predictions Total | 92 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 27 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 20 |


