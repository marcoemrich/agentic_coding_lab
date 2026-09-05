# Analysis Report: 2026-09-05_09-44-20_claim-office-example-mapping_v6.1.5-pure-split-cc_opus-5-no-thinking

Generated: 2026-09-05T10:32:15+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1.5-pure-split-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 2873s |
| Started | 2026-09-05T09:44:20+00:00 |
| Ended | 2026-09-05T10:32:15+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 320
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 657
- **Active tests**: 41
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (41 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-05_09-44-20_claim-office-example-mapping_v6.1.5-pure-split-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-05_09-44-20_claim-office-example-mapping_v6.1.5-pure-split-cc_opus-5-no-thinking

unknown item type: broomstick
 ✓ src/claim-office.spec.ts  (41 tests) 314ms

 Test Files  1 passed (1)
      Tests  41 passed (41)
   Start at  10:32:16
   Duration  642ms (transform 89ms, setup 0ms, collect 97ms, tests 314ms, environment 0ms, prepare 79ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 58 | ×1 | 58 |
| Invocations | 79 | ×2 | 158 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 14 | ×5 | 70 |
| Assignments | 76 | ×6 | 456 |
| **Total Mass** | | | **794** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 226 |
| Functions | 32 |
| Longest Function | 20 lines |
| Avg LOC/Function | 3.41 |
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
| McCabe (Cyclomatic) | 4 | 1.41 | 0 |
| Cognitive (SonarJS) | 4 | 1.27 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 88107379 |
| Context Utilization | 186% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 41 |
| Avg Cycle Time | 110.08s |
| Avg Red Phase | 22.78s |
| Avg Green Phase | 24.64s |
| Avg Refactor Phase | 62.66s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 82 |
| Predictions Total | 82 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 22 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 20 |


