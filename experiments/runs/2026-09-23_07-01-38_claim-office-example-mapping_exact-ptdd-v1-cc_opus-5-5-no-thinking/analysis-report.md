# Analysis Report: 2026-09-23_07-01-38_claim-office-example-mapping_exact-ptdd-v1-cc_opus-5-5-no-thinking

Generated: 2026-09-23T07:13:49+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5 |
| Thinking | unknown |
| Duration | 728s |
| Started | 2026-09-23T07:01:38+00:00 |
| Ended | 2026-09-23T07:13:49+00:00 |

## Code Metrics

- **Implementation files**: catalogue.ts, claimOffice.ts, claims.ts, cli.ts, premium.ts
- **Implementation LOC** (total): 244
- **Test files**: claimOffice.spec.ts, cli.spec.ts
- **Test LOC** (total): 258
- **Active tests**: 45
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (45 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-23_07-01-38_claim-office-example-mapping_exact-ptdd-v1-cc_opus-5-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-23_07-01-38_claim-office-example-mapping_exact-ptdd-v1-cc_opus-5-5-no-thinking

 ✓ src/claimOffice.spec.ts  (42 tests) 8ms
 ✓ src/cli.spec.ts  (3 tests) 471ms

 Test Files  2 passed (2)
      Tests  45 passed (45)
   Start at  07:13:50
   Duration  967ms (transform 77ms, setup 0ms, collect 90ms, tests 479ms, environment 0ms, prepare 136ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 95% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 61 | ×1 | 61 |
| Invocations | 90 | ×2 | 180 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 8 | ×5 | 40 |
| Assignments | 45 | ×6 | 270 |
| **Total Mass** | | | **611** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 203 |
| Functions | 26 |
| Longest Function | 11 lines |
| Avg LOC/Function | 4.46 |
| Median LOC/Function | 3.00 |
| Imports | 9 |

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
| McCabe (Cyclomatic) | 3 | 1.39 | 0 |
| Cognitive (SonarJS) | 2 | 1.40 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 21135606 |
| Context Utilization | 61% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 8.56s |
| Avg Red Phase | 8.56s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 2 |
| Predictions Total | 2 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


