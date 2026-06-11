# Analysis Report: 2026-06-10_23-38-32_claim-office-example-mapping_v4-exact-subagents_fable-5-no-thinking

Generated: 2026-06-11T03:05:08+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4-exact-subagents |
| Model | fable-5-no-thinking |
| Model Version(s) | claude-fable-5 |
| Thinking | unknown |
| Duration | 12394s |
| Started | 2026-06-10T23:38:32+00:00 |
| Ended | 2026-06-11T03:05:08+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 263
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 720
- **Active tests**: 45
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (50 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-06-10_23-38-32_claim-office-example-mapping_v4-exact-subagents_fable-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-06-10_23-38-32_claim-office-example-mapping_v4-exact-subagents_fable-5-no-thinking

 ✓ src/claim-office.spec.ts  (45 tests) 7ms
 ✓ src/cli.spec.ts  (5 tests) 777ms

 Test Files  2 passed (2)
      Tests  50 passed (50)
   Start at  03:05:09
   Duration  1.08s (transform 58ms, setup 0ms, collect 63ms, tests 784ms, environment 0ms, prepare 83ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 52 | ×1 | 52 |
| Invocations | 60 | ×2 | 120 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 6 | ×5 | 30 |
| Assignments | 87 | ×6 | 522 |
| **Total Mass** | | | **764** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 219 |
| Functions | 22 |
| Longest Function | 11 lines |
| Avg LOC/Function | 3.82 |
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
| McCabe (Cyclomatic) | 3 | 1.44 | 0 |
| Cognitive (SonarJS) | 2 | 1.08 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3162490 |
| Context Utilization | 43% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 7 |
| Avg Cycle Time | 214.09s |
| Avg Red Phase | 75.57s |
| Avg Green Phase | 49.35s |
| Avg Refactor Phase | 89.17s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 14 |
| Predictions Total | 14 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 6 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 5 |


