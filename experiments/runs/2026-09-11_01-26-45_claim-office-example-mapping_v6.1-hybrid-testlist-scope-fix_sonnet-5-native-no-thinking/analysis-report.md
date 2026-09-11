# Analysis Report: 2026-09-11_01-26-45_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_sonnet-5-native-no-thinking

Generated: 2026-09-11T02:07:16+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-hybrid-testlist-scope-fix |
| Model | sonnet-5-native-no-thinking |
| Model Version(s) | claude-sonnet-5 |
| Thinking | unknown |
| Duration | 2429s |
| Started | 2026-09-11T01:26:45+00:00 |
| Ended | 2026-09-11T02:07:16+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, quote.ts
- **Implementation LOC** (total): 333
- **Test files**: claim.spec.ts, quote.spec.ts
- **Test LOC** (total): 373
- **Active tests**: 41
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (41 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-11_01-26-45_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_sonnet-5-native-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-11_01-26-45_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_sonnet-5-native-no-thinking

 ✓ src/quote.spec.ts  (22 tests) 7ms
 ✓ src/claim.spec.ts  (19 tests) 7ms

 Test Files  2 passed (2)
      Tests  41 passed (41)
   Start at  02:07:17
   Duration  566ms (transform 72ms, setup 0ms, collect 86ms, tests 14ms, environment 0ms, prepare 168ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 73% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 76 | ×1 | 76 |
| Invocations | 89 | ×2 | 178 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 15 | ×5 | 75 |
| Assignments | 78 | ×6 | 468 |
| **Total Mass** | | | **861** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 244 |
| Functions | 15 |
| Longest Function | 31 lines |
| Avg LOC/Function | 6.47 |
| Median LOC/Function | 6.00 |
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
| McCabe (Cyclomatic) | 4 | 2.00 | 0 |
| Cognitive (SonarJS) | 4 | 2.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 116167468 |
| Context Utilization | 217% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 41 |
| Avg Cycle Time | 87.33s |
| Avg Red Phase | 13.36s |
| Avg Green Phase | 21.58s |
| Avg Refactor Phase | 52.39s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 8 |
| Predictions Total | 8 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 26 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 20 |


