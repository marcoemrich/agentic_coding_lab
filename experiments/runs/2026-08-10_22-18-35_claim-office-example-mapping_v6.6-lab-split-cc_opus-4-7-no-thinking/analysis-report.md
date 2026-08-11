# Analysis Report: 2026-08-10_22-18-35_claim-office-example-mapping_v6.6-lab-split-cc_opus-4-7-no-thinking

Generated: 2026-08-10T23:42:47+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.6-lab-split-cc |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 5051s |
| Started | 2026-08-10T22:18:35+00:00 |
| Ended | 2026-08-10T23:42:47+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 278
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 434
- **Active tests**: 42
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (42 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_22-18-35_claim-office-example-mapping_v6.6-lab-split-cc_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_22-18-35_claim-office-example-mapping_v6.6-lab-split-cc_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (42 tests) 8ms

 Test Files  1 passed (1)
      Tests  42 passed (42)
   Start at  23:42:48
   Duration  262ms (transform 92ms, setup 0ms, collect 96ms, tests 8ms, environment 0ms, prepare 62ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 53 | ×1 | 53 |
| Invocations | 80 | ×2 | 160 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 7 | ×5 | 35 |
| Assignments | 83 | ×6 | 498 |
| **Total Mass** | | | **786** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 220 |
| Functions | 35 |
| Longest Function | 11 lines |
| Avg LOC/Function | 3.17 |
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
| McCabe (Cyclomatic) | 4 | 1.43 | 0 |
| Cognitive (SonarJS) | 4 | 1.27 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 80833724 |
| Context Utilization | 36% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 32 |
| Avg Cycle Time | 118.91s |
| Avg Red Phase | 24.63s |
| Avg Green Phase | 15.49s |
| Avg Refactor Phase | 78.79s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 63 |
| Predictions Total | 64 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 32 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


