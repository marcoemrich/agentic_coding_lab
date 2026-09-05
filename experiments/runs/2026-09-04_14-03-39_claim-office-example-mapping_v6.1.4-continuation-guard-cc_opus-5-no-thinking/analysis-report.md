# Analysis Report: 2026-09-04_14-03-39_claim-office-example-mapping_v6.1.4-continuation-guard-cc_opus-5-no-thinking

Generated: 2026-09-04T14:59:12+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1.4-continuation-guard-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 3331s |
| Started | 2026-09-04T14:03:39+00:00 |
| Ended | 2026-09-04T14:59:12+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 557
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 930
- **Active tests**: 50
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (50 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-04_14-03-39_claim-office-example-mapping_v6.1.4-continuation-guard-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-04_14-03-39_claim-office-example-mapping_v6.1.4-continuation-guard-cc_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (50 tests) 1692ms

 Test Files  1 passed (1)
      Tests  50 passed (50)
   Start at  14:59:13
   Duration  2.10s (transform 140ms, setup 0ms, collect 119ms, tests 1.69s, environment 0ms, prepare 98ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 60 | ×1 | 60 |
| Invocations | 86 | ×2 | 172 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 24 | ×5 | 120 |
| Assignments | 119 | ×6 | 714 |
| **Total Mass** | | | **1110** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 343 |
| Functions | 25 |
| Longest Function | 24 lines |
| Avg LOC/Function | 4.76 |
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
| McCabe (Cyclomatic) | 4 | 1.42 | 0 |
| Cognitive (SonarJS) | 3 | 1.29 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 116583677 |
| Context Utilization | 208% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 50 |
| Avg Cycle Time | 123.62s |
| Avg Red Phase | 20.88s |
| Avg Green Phase | 26.59s |
| Avg Refactor Phase | 76.15s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 98 |
| Predictions Total | 100 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 22 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 29 |


