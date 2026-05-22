# Analysis Report: 2026-05-21_23-45-25_claim-office-lite-example-mapping_v6-hybrid_opus-4-7-portkey-no-thinking

Generated: 2026-05-22T00:05:30+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-lite-example-mapping |
| Workflow | v6-hybrid |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 1204s |
| Started | 2026-05-21T23:45:25+00:00 |
| Ended | 2026-05-22T00:05:30+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 162
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 396
- **Active tests**: 30
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (30 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-21_23-45-25_claim-office-lite-example-mapping_v6-hybrid_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-21_23-45-25_claim-office-lite-example-mapping_v6-hybrid_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (30 tests) 9ms

 Test Files  1 passed (1)
      Tests  30 passed (30)
   Start at  00:05:31
   Duration  214ms (transform 45ms, setup 0ms, collect 52ms, tests 9ms, environment 0ms, prepare 53ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 85% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 48 | ×1 | 48 |
| Invocations | 62 | ×2 | 124 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 11 | ×5 | 55 |
| Assignments | 74 | ×6 | 444 |
| **Total Mass** | | | **723** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 143 |
| Functions | 14 |
| Longest Function | 15 lines |
| Avg LOC/Function | 7.21 |
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
| McCabe (Cyclomatic) | 6 | 2.00 | 0 |
| Cognitive (SonarJS) | 7 | 2.45 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 29632255 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 23 |
| Avg Cycle Time | 97.63s |
| Avg Red Phase | 23.31s |
| Avg Green Phase | 19.83s |
| Avg Refactor Phase | 54.49s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 7 |
| Predictions Total | 7 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 8 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 13 |


