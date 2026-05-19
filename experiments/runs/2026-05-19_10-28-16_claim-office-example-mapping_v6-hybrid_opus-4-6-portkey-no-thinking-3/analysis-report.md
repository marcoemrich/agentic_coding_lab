# Analysis Report: 2026-05-19_10-28-16_claim-office-example-mapping_v6-hybrid_opus-4-6-portkey-no-thinking-3

Generated: 2026-05-19T11:07:51+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6-hybrid |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 2373s |
| Started | 2026-05-19T10:28:16+00:00 |
| Ended | 2026-05-19T11:07:51+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 255
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 606
- **Active tests**: 34
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (34 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-19_10-28-16_claim-office-example-mapping_v6-hybrid_opus-4-6-portkey-no-thinking-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-19_10-28-16_claim-office-example-mapping_v6-hybrid_opus-4-6-portkey-no-thinking-3

 ✓ src/claim-office.spec.ts  (34 tests) 8ms

 Test Files  1 passed (1)
      Tests  34 passed (34)
   Start at  11:07:52
   Duration  241ms (transform 54ms, setup 0ms, collect 71ms, tests 8ms, environment 0ms, prepare 54ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 86% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 70 | ×1 | 70 |
| Invocations | 59 | ×2 | 118 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 8 | ×5 | 40 |
| Assignments | 76 | ×6 | 456 |
| **Total Mass** | | | **744** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 214 |
| Functions | 10 |
| Longest Function | 28 lines |
| Avg LOC/Function | 8.70 |
| Median LOC/Function | 4.50 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 2 |
| Duplication | 0 |
| Magic Numbers | 3 |
| Code Quality | 0 |
| **Total** | **5** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 9 | 2.87 | 0 |
| Cognitive (SonarJS) | 11 | 4.62 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 39219701 |
| Context Utilization | 83% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 18 |
| Avg Cycle Time | 220.01s |
| Avg Red Phase | 36s |
| Avg Green Phase | 39.53s |
| Avg Refactor Phase | 144.48s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 41 |
| Predictions Total | 41 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 8 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 7 |


