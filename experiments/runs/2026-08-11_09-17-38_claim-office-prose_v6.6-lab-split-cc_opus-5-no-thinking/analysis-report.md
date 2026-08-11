# Analysis Report: 2026-08-11_09-17-38_claim-office-prose_v6.6-lab-split-cc_opus-5-no-thinking

Generated: 2026-08-11T10:28:21+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-prose |
| Workflow | v6.6-lab-split-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 4242s |
| Started | 2026-08-11T09:17:38+00:00 |
| Ended | 2026-08-11T10:28:21+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 236
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 683
- **Active tests**: 39
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (40 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-11_09-17-38_claim-office-prose_v6.6-lab-split-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-11_09-17-38_claim-office-prose_v6.6-lab-split-cc_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (39 tests) 6ms
 ✓ src/cli.spec.ts  (1 test) 2ms

 Test Files  2 passed (2)
      Tests  40 passed (40)
   Start at  10:28:21
   Duration  318ms (transform 53ms, setup 0ms, collect 60ms, tests 8ms, environment 0ms, prepare 87ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 96% |
| Branches | 90% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 61 | ×1 | 61 |
| Invocations | 56 | ×2 | 112 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 6 | ×5 | 30 |
| Assignments | 78 | ×6 | 468 |
| **Total Mass** | | | **715** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 152 |
| Functions | 27 |
| Longest Function | 12 lines |
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
| McCabe (Cyclomatic) | 3 | 1.36 | 0 |
| Cognitive (SonarJS) | 2 | 1.09 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 101537473 |
| Context Utilization | 208% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 40 |
| Avg Cycle Time | 115.16s |
| Avg Red Phase | 25.95s |
| Avg Green Phase | 29.84s |
| Avg Refactor Phase | 59.37s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 80 |
| Predictions Total | 80 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 40 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 20 |


