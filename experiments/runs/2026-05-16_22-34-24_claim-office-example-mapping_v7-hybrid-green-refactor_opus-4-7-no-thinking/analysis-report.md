# Analysis Report: 2026-05-16_22-34-24_claim-office-example-mapping_v7-hybrid-green-refactor_opus-4-7-no-thinking

Generated: 2026-05-16T22:57:36+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v7-hybrid-green-refactor |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 1391s |
| Started | 2026-05-16T22:34:24+00:00 |
| Ended | 2026-05-16T22:57:36+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 146
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 811
- **Active tests**: 45
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (45 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-16_22-34-24_claim-office-example-mapping_v7-hybrid-green-refactor_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-16_22-34-24_claim-office-example-mapping_v7-hybrid-green-refactor_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (45 tests) 6ms

 Test Files  1 passed (1)
      Tests  45 passed (45)
   Start at  22:57:37
   Duration  212ms (transform 65ms, setup 0ms, collect 62ms, tests 6ms, environment 0ms, prepare 54ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 84% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 54 | ×1 | 54 |
| Invocations | 61 | ×2 | 122 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 11 | ×5 | 55 |
| Assignments | 47 | ×6 | 282 |
| **Total Mass** | | | **565** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 136 |
| Functions | 5 |
| Longest Function | 86 lines |
| Avg LOC/Function | 22.40 |
| Median LOC/Function | 7.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 6 |
| Duplication | 0 |
| Magic Numbers | 9 |
| Code Quality | 0 |
| **Total** | **15** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 27 | 6.17 | 1 |
| Cognitive (SonarJS) | 58 | 16.00 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 21338284 |
| Context Utilization | 14% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 5 |
| Avg Cycle Time | 131.10s |
| Avg Red Phase | 26.56s |
| Avg Green Phase | 55.57s |
| Avg Refactor Phase | 48.97s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 13 |
| Predictions Total | 13 |
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


