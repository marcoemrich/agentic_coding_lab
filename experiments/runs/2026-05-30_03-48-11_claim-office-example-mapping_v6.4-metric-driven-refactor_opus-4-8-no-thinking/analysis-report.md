# Analysis Report: 2026-05-30_03-48-11_claim-office-example-mapping_v6.4-metric-driven-refactor_opus-4-8-no-thinking

Generated: 2026-05-30T04:34:42+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.4-metric-driven-refactor |
| Model | opus-4-8-no-thinking |
| Model Version(s) | claude-opus-4-8, <synthetic> |
| Thinking | unknown |
| Duration | 2790s |
| Started | 2026-05-30T03:48:11+00:00 |
| Ended | 2026-05-30T04:34:42+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 277
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 574
- **Active tests**: 39
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (39 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-30_03-48-11_claim-office-example-mapping_v6.4-metric-driven-refactor_opus-4-8-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-30_03-48-11_claim-office-example-mapping_v6.4-metric-driven-refactor_opus-4-8-no-thinking

 ✓ src/claim-office.spec.ts  (39 tests) 7ms

 Test Files  1 passed (1)
      Tests  39 passed (39)
   Start at  04:34:43
   Duration  175ms (transform 42ms, setup 1ms, collect 42ms, tests 7ms, environment 0ms, prepare 41ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 57 | ×1 | 57 |
| Invocations | 80 | ×2 | 160 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 8 | ×5 | 40 |
| Assignments | 101 | ×6 | 606 |
| **Total Mass** | | | **907** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 230 |
| Functions | 30 |
| Longest Function | 19 lines |
| Avg LOC/Function | 4.17 |
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
| McCabe (Cyclomatic) | 4 | 1.35 | 0 |
| Cognitive (SonarJS) | 2 | 1.21 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 73241513 |
| Context Utilization | 175% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 39 |
| Avg Cycle Time | 110.77s |
| Avg Red Phase | 24.45s |
| Avg Green Phase | 22.78s |
| Avg Refactor Phase | 63.54s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 78 |
| Predictions Total | 78 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 21 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 19 |


