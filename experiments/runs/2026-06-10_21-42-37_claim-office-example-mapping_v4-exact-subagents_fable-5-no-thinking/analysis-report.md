# Analysis Report: 2026-06-10_21-42-37_claim-office-example-mapping_v4-exact-subagents_fable-5-no-thinking

Generated: 2026-06-10T23:38:14+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4-exact-subagents |
| Model | fable-5-no-thinking |
| Model Version(s) | claude-fable-5 |
| Thinking | unknown |
| Duration | 6936s |
| Started | 2026-06-10T21:42:37+00:00 |
| Ended | 2026-06-10T23:38:14+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 237
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 589
- **Active tests**: 34
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (37 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-06-10_21-42-37_claim-office-example-mapping_v4-exact-subagents_fable-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-06-10_21-42-37_claim-office-example-mapping_v4-exact-subagents_fable-5-no-thinking

 ✓ src/claim-office.spec.ts  (34 tests) 7ms
 ✓ src/cli.spec.ts  (3 tests) 1018ms

 Test Files  2 passed (2)
      Tests  37 passed (37)
   Start at  23:38:15
   Duration  1.32s (transform 46ms, setup 0ms, collect 52ms, tests 1.02s, environment 0ms, prepare 91ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 56 | ×1 | 56 |
| Invocations | 55 | ×2 | 110 |
| Conditionals | 9 | ×4 | 36 |
| Loops | 8 | ×5 | 40 |
| Assignments | 75 | ×6 | 450 |
| **Total Mass** | | | **692** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 191 |
| Functions | 18 |
| Longest Function | 12 lines |
| Avg LOC/Function | 4.39 |
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
| McCabe (Cyclomatic) | 4 | 1.75 | 0 |
| Cognitive (SonarJS) | 4 | 1.80 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 16666925 |
| Context Utilization | 87% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 37 |
| Avg Cycle Time | 167.10s |
| Avg Red Phase | 49.53s |
| Avg Green Phase | 36.92s |
| Avg Refactor Phase | 80.65s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 73 |
| Predictions Total | 74 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 37 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 12 |


