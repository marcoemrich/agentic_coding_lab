# Analysis Report: 2026-09-05_11-07-00_claim-office-example-mapping_v6.1.5-pure-split-cc_opus-5-no-thinking

Generated: 2026-09-05T12:01:30+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1.5-pure-split-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 3266s |
| Started | 2026-09-05T11:07:00+00:00 |
| Ended | 2026-09-05T12:01:30+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 437
- **Test files**: claim-office.spec.ts, cli.spec.ts
- **Test LOC** (total): 1211
- **Active tests**: 52
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (52 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-05_11-07-00_claim-office-example-mapping_v6.1.5-pure-split-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-05_11-07-00_claim-office-example-mapping_v6.1.5-pure-split-cc_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (48 tests) 16ms
 ✓ src/cli.spec.ts  (4 tests) 2191ms

 Test Files  2 passed (2)
      Tests  52 passed (52)
   Start at  12:01:31
   Duration  2.85s (transform 132ms, setup 0ms, collect 149ms, tests 2.21s, environment 0ms, prepare 156ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 94% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 62 | ×1 | 62 |
| Invocations | 75 | ×2 | 150 |
| Conditionals | 9 | ×4 | 36 |
| Loops | 14 | ×5 | 70 |
| Assignments | 85 | ×6 | 510 |
| **Total Mass** | | | **828** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 356 |
| Functions | 26 |
| Longest Function | 10 lines |
| Avg LOC/Function | 3.69 |
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
| McCabe (Cyclomatic) | 5 | 1.57 | 0 |
| Cognitive (SonarJS) | 3 | 1.62 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 104715088 |
| Context Utilization | 202% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 52 |
| Avg Cycle Time | 102.22s |
| Avg Red Phase | 20.76s |
| Avg Green Phase | 23.02s |
| Avg Refactor Phase | 58.44s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 104 |
| Predictions Total | 104 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 28 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 30 |


