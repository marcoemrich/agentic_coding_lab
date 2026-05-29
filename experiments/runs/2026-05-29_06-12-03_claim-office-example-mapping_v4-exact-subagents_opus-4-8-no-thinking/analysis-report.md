# Analysis Report: 2026-05-29_06-12-03_claim-office-example-mapping_v4-exact-subagents_opus-4-8-no-thinking

Generated: 2026-05-29T07:22:32+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4-exact-subagents |
| Model | opus-4-8-no-thinking |
| Model Version(s) | claude-opus-4-8 |
| Thinking | unknown |
| Duration | 4227s |
| Started | 2026-05-29T06:12:03+00:00 |
| Ended | 2026-05-29T07:22:32+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 349
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 286
- **Active tests**: 41
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (41 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-29_06-12-03_claim-office-example-mapping_v4-exact-subagents_opus-4-8-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-29_06-12-03_claim-office-example-mapping_v4-exact-subagents_opus-4-8-no-thinking

 ✓ src/claim-office.spec.ts  (41 tests) 6ms

 Test Files  1 passed (1)
      Tests  41 passed (41)
   Start at  07:22:32
   Duration  199ms (transform 41ms, setup 1ms, collect 54ms, tests 6ms, environment 0ms, prepare 53ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 66% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 65 | ×1 | 65 |
| Invocations | 106 | ×2 | 212 |
| Conditionals | 21 | ×4 | 84 |
| Loops | 11 | ×5 | 55 |
| Assignments | 70 | ×6 | 420 |
| **Total Mass** | | | **836** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 288 |
| Functions | 23 |
| Longest Function | 39 lines |
| Avg LOC/Function | 7.52 |
| Median LOC/Function | 7.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 0 |
| Code Quality | 0 |
| **Total** | **1** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 4 | 1.79 | 0 |
| Cognitive (SonarJS) | 5 | 2.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 24182091 |
| Context Utilization | 102% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 41 |
| Avg Cycle Time | 115.19s |
| Avg Red Phase | 36.3s |
| Avg Green Phase | 25.44s |
| Avg Refactor Phase | 53.45s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 79 |
| Predictions Total | 82 |
| Accuracy | 96% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 23 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 19 |


