# Analysis Report: 2026-08-11_01-07-01_claim-office-example-mapping_v6.6-lab-split-cc_opus-5-no-thinking

Generated: 2026-08-11T02:54:32+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.6-lab-split-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 6450s |
| Started | 2026-08-11T01:07:01+00:00 |
| Ended | 2026-08-11T02:54:32+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 618
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 982
- **Active tests**: 52
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (57 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-11_01-07-01_claim-office-example-mapping_v6.6-lab-split-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-11_01-07-01_claim-office-example-mapping_v6.6-lab-split-cc_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (52 tests) 9ms
 ✓ src/cli.spec.ts  (5 tests) 502ms

 Test Files  2 passed (2)
      Tests  57 passed (57)
   Start at  02:54:33
   Duration  812ms (transform 52ms, setup 0ms, collect 57ms, tests 511ms, environment 0ms, prepare 83ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 75 | ×1 | 75 |
| Invocations | 117 | ×2 | 234 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 22 | ×5 | 110 |
| Assignments | 104 | ×6 | 624 |
| **Total Mass** | | | **1083** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 326 |
| Functions | 47 |
| Longest Function | 18 lines |
| Avg LOC/Function | 3.43 |
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
| McCabe (Cyclomatic) | 4 | 1.32 | 0 |
| Cognitive (SonarJS) | 3 | 1.36 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 176135411 |
| Context Utilization | 279% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 57 |
| Avg Cycle Time | 127.36s |
| Avg Red Phase | 26.08s |
| Avg Green Phase | 31.14s |
| Avg Refactor Phase | 70.14s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 114 |
| Predictions Total | 114 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 57 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 33 |


