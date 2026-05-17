# Analysis Report: 2026-05-17_01-11-17_claim-office-example-mapping_v7-hybrid-green-refactor_opus-4-7-no-thinking

Generated: 2026-05-17T01:47:12+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v7-hybrid-green-refactor |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 2154s |
| Started | 2026-05-17T01:11:17+00:00 |
| Ended | 2026-05-17T01:47:12+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 268
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 278
- **Active tests**: 31
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (31 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-17_01-11-17_claim-office-example-mapping_v7-hybrid-green-refactor_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-17_01-11-17_claim-office-example-mapping_v7-hybrid-green-refactor_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (31 tests) 1379ms

 Test Files  1 passed (1)
      Tests  31 passed (31)
   Start at  01:47:13
   Duration  1.54s (transform 40ms, setup 0ms, collect 35ms, tests 1.38s, environment 0ms, prepare 46ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 60% |
| Branches | 88% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 54 | ×1 | 54 |
| Invocations | 70 | ×2 | 140 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 6 | ×5 | 30 |
| Assignments | 92 | ×6 | 552 |
| **Total Mass** | | | **840** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 223 |
| Functions | 25 |
| Longest Function | 9 lines |
| Avg LOC/Function | 4.32 |
| Median LOC/Function | 4.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 2 |
| Code Quality | 0 |
| **Total** | **2** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 5 | 1.61 | 0 |
| Cognitive (SonarJS) | 5 | 1.75 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 25153959 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 32 |
| Avg Cycle Time | 119.56s |
| Avg Red Phase | 26.13s |
| Avg Green Phase | 30.93s |
| Avg Refactor Phase | 62.5s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 29 |
| Predictions Total | 29 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 10 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 13 |


