# Analysis Report: 2026-09-04_06-20-44_claim-office-example-mapping_v6.1.1-lab-split-cc_opus-5-no-thinking-3

Generated: 2026-09-04T07:05:32+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1.1-lab-split-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 2685s |
| Started | 2026-09-04T06:20:44+00:00 |
| Ended | 2026-09-04T07:05:32+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 304
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 776
- **Active tests**: 50
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (50 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-04_06-20-44_claim-office-example-mapping_v6.1.1-lab-split-cc_opus-5-no-thinking-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-04_06-20-44_claim-office-example-mapping_v6.1.1-lab-split-cc_opus-5-no-thinking-3

 ✓ src/claim-office.spec.ts  (50 tests) 491ms

 Test Files  1 passed (1)
      Tests  50 passed (50)
   Start at  07:05:33
   Duration  804ms (transform 91ms, setup 0ms, collect 90ms, tests 491ms, environment 0ms, prepare 74ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 70 | ×1 | 70 |
| Invocations | 72 | ×2 | 144 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 11 | ×5 | 55 |
| Assignments | 71 | ×6 | 426 |
| **Total Mass** | | | **755** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 201 |
| Functions | 25 |
| Longest Function | 14 lines |
| Avg LOC/Function | 5.24 |
| Median LOC/Function | 4.00 |
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
| McCabe (Cyclomatic) | 4 | 1.65 | 0 |
| Cognitive (SonarJS) | 3 | 1.62 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 86741467 |
| Context Utilization | 177% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 50 |
| Avg Cycle Time | 98.96s |
| Avg Red Phase | 19.16s |
| Avg Green Phase | 17.97s |
| Avg Refactor Phase | 61.83s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 100 |
| Predictions Total | 100 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 21 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 29 |


