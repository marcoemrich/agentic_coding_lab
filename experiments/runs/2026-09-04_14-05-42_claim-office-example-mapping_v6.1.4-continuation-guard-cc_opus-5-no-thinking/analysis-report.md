# Analysis Report: 2026-09-04_14-05-42_claim-office-example-mapping_v6.1.4-continuation-guard-cc_opus-5-no-thinking

Generated: 2026-09-04T15:01:09+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1.4-continuation-guard-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 3325s |
| Started | 2026-09-04T14:05:42+00:00 |
| Ended | 2026-09-04T15:01:09+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 384
- **Test files**: claim-office.spec.ts, cli.spec.ts
- **Test LOC** (total): 852
- **Active tests**: 46
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (46 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-04_14-05-42_claim-office-example-mapping_v6.1.4-continuation-guard-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-04_14-05-42_claim-office-example-mapping_v6.1.4-continuation-guard-cc_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (43 tests) 11ms
 ✓ src/cli.spec.ts  (3 tests) 1528ms

 Test Files  2 passed (2)
      Tests  46 passed (46)
   Start at  15:01:10
   Duration  2.04s (transform 82ms, setup 0ms, collect 94ms, tests 1.54s, environment 0ms, prepare 151ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 63 | ×1 | 63 |
| Invocations | 86 | ×2 | 172 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 12 | ×5 | 60 |
| Assignments | 90 | ×6 | 540 |
| **Total Mass** | | | **891** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 207 |
| Functions | 27 |
| Longest Function | 22 lines |
| Avg LOC/Function | 4.74 |
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
| McCabe (Cyclomatic) | 4 | 1.50 | 0 |
| Cognitive (SonarJS) | 4 | 1.69 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 111434042 |
| Context Utilization | 213% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 46 |
| Avg Cycle Time | 124.99s |
| Avg Red Phase | 23.47s |
| Avg Green Phase | 25.96s |
| Avg Refactor Phase | 75.56s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 92 |
| Predictions Total | 92 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 21 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 23 |


