# Analysis Report: 2026-10-01_01-07-05_claim-office-example-mapping_exact-hybrid-v2.4-lab-split-cc_opus-5-5-no-thinking

Generated: 2026-10-01T01:25:22+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-hybrid-v2.4-lab-split-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5 |
| Thinking | unknown |
| Duration | 1094s |
| Started | 2026-10-01T01:07:05+00:00 |
| Ended | 2026-10-01T01:25:22+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 221
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 331
- **Active tests**: 42
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (42 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-01_01-07-05_claim-office-example-mapping_exact-hybrid-v2.4-lab-split-cc_opus-5-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-01_01-07-05_claim-office-example-mapping_exact-hybrid-v2.4-lab-split-cc_opus-5-5-no-thinking

 ✓ src/claim-office.spec.ts  (42 tests) 1076ms

 Test Files  1 passed (1)
      Tests  42 passed (42)
   Start at  01:25:23
   Duration  1.48s (transform 125ms, setup 0ms, collect 118ms, tests 1.08s, environment 0ms, prepare 107ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 49 | ×1 | 49 |
| Invocations | 61 | ×2 | 122 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 7 | ×5 | 35 |
| Assignments | 71 | ×6 | 426 |
| **Total Mass** | | | **672** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 181 |
| Functions | 24 |
| Longest Function | 10 lines |
| Avg LOC/Function | 3.17 |
| Median LOC/Function | 2.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 1 |
| Code Quality | 0 |
| **Total** | **1** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 3 | 1.57 | 0 |
| Cognitive (SonarJS) | 2 | 1.14 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 40003807 |
| Context Utilization | 112% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 24 |
| Avg Cycle Time | 44.01s |
| Avg Red Phase | 11.73s |
| Avg Green Phase | 10.58s |
| Avg Refactor Phase | 21.7s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 0 |
| Predictions Total | 0 |
| Accuracy | N/A |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 24 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


