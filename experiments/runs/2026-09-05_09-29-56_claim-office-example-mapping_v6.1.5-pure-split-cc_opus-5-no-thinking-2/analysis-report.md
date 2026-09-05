# Analysis Report: 2026-09-05_09-29-56_claim-office-example-mapping_v6.1.5-pure-split-cc_opus-5-no-thinking-2

Generated: 2026-09-05T10:16:15+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1.5-pure-split-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 2775s |
| Started | 2026-09-05T09:29:56+00:00 |
| Ended | 2026-09-05T10:16:15+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 342
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 806
- **Active tests**: 45
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (44 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-05_09-29-56_claim-office-example-mapping_v6.1.5-pure-split-cc_opus-5-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-05_09-29-56_claim-office-example-mapping_v6.1.5-pure-split-cc_opus-5-no-thinking-2

 ✓ src/claim-office.spec.ts  (44 tests) 1018ms

 Test Files  1 passed (1)
      Tests  44 passed (44)
   Start at  10:16:16
   Duration  1.32s (transform 99ms, setup 0ms, collect 85ms, tests 1.02s, environment 0ms, prepare 77ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 52 | ×1 | 52 |
| Invocations | 62 | ×2 | 124 |
| Conditionals | 8 | ×4 | 32 |
| Loops | 6 | ×5 | 30 |
| Assignments | 75 | ×6 | 450 |
| **Total Mass** | | | **688** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 228 |
| Functions | 20 |
| Longest Function | 24 lines |
| Avg LOC/Function | 5.90 |
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
| McCabe (Cyclomatic) | 3 | 1.29 | 0 |
| Cognitive (SonarJS) | 2 | 1.22 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 93191628 |
| Context Utilization | 184% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 44 |
| Avg Cycle Time | 101.70s |
| Avg Red Phase | 22.48s |
| Avg Green Phase | 22.33s |
| Avg Refactor Phase | 56.89s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 88 |
| Predictions Total | 88 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 22 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 22 |


