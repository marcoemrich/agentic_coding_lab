# Analysis Report: 2026-09-05_09-29-56_claim-office-example-mapping_v6.1.5-pure-split-cc_opus-5-no-thinking

Generated: 2026-09-05T10:24:32+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1.5-pure-split-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 3271s |
| Started | 2026-09-05T09:29:56+00:00 |
| Ended | 2026-09-05T10:24:32+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 378
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 1016
- **Active tests**: 50
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (50 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-05_09-29-56_claim-office-example-mapping_v6.1.5-pure-split-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-05_09-29-56_claim-office-example-mapping_v6.1.5-pure-split-cc_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (50 tests) 2019ms

 Test Files  1 passed (1)
      Tests  50 passed (50)
   Start at  10:24:33
   Duration  2.38s (transform 122ms, setup 0ms, collect 124ms, tests 2.02s, environment 0ms, prepare 82ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 72 | ×1 | 72 |
| Invocations | 77 | ×2 | 154 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 9 | ×5 | 45 |
| Assignments | 78 | ×6 | 468 |
| **Total Mass** | | | **783** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 263 |
| Functions | 22 |
| Longest Function | 25 lines |
| Avg LOC/Function | 5.00 |
| Median LOC/Function | 2.00 |
| Imports | 2 |

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
| McCabe (Cyclomatic) | 4 | 1.67 | 0 |
| Cognitive (SonarJS) | 5 | 1.92 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 107549160 |
| Context Utilization | 200% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 50 |
| Avg Cycle Time | 108.37s |
| Avg Red Phase | 21.56s |
| Avg Green Phase | 19.77s |
| Avg Refactor Phase | 67.04s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 102 |
| Predictions Total | 102 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 25 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 26 |


