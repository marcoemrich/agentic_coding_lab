# Analysis Report: 2026-05-18_22-51-54_claim-office-example-mapping_v6.5-lean_opus-4-6-portkey-no-thinking

Generated: 2026-05-18T23:45:35+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.5-lean |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 3220s |
| Started | 2026-05-18T22:51:54+00:00 |
| Ended | 2026-05-18T23:45:35+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 205
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 548
- **Active tests**: 31
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (31 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-18_22-51-54_claim-office-example-mapping_v6.5-lean_opus-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-18_22-51-54_claim-office-example-mapping_v6.5-lean_opus-4-6-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (31 tests) 7ms

 Test Files  1 passed (1)
      Tests  31 passed (31)
   Start at  23:45:36
   Duration  194ms (transform 42ms, setup 0ms, collect 43ms, tests 7ms, environment 0ms, prepare 52ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 60 | ×1 | 60 |
| Invocations | 80 | ×2 | 160 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 11 | ×5 | 55 |
| Assignments | 53 | ×6 | 318 |
| **Total Mass** | | | **641** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 179 |
| Functions | 17 |
| Longest Function | 18 lines |
| Avg LOC/Function | 5.94 |
| Median LOC/Function | 5.00 |
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
| McCabe (Cyclomatic) | 6 | 1.77 | 0 |
| Cognitive (SonarJS) | 7 | 2.25 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 43075179 |
| Context Utilization | 83% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 30 |
| Avg Cycle Time | 179.78s |
| Avg Red Phase | 32.43s |
| Avg Green Phase | 32.01s |
| Avg Refactor Phase | 115.34s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 28 |
| Predictions Total | 28 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 14 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 14 |


