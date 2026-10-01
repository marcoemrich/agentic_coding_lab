# Analysis Report: 2026-10-01_01-06-09_claim-office-example-mapping_exact-hybrid-v2.4-lab-split-cc_opus-5-5-no-thinking

Generated: 2026-10-01T01:25:49+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-hybrid-v2.4-lab-split-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5 |
| Thinking | unknown |
| Duration | 1177s |
| Started | 2026-10-01T01:06:09+00:00 |
| Ended | 2026-10-01T01:25:49+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 297
- **Test files**: claim-office.spec.ts, cli.spec.ts
- **Test LOC** (total): 265
- **Active tests**: 38
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (38 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-01_01-06-09_claim-office-example-mapping_exact-hybrid-v2.4-lab-split-cc_opus-5-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-01_01-06-09_claim-office-example-mapping_exact-hybrid-v2.4-lab-split-cc_opus-5-5-no-thinking

 ✓ src/claim-office.spec.ts  (36 tests) 9ms
 ✓ src/cli.spec.ts  (2 tests) 1027ms

 Test Files  2 passed (2)
      Tests  38 passed (38)
   Start at  01:25:50
   Duration  1.53s (transform 92ms, setup 0ms, collect 76ms, tests 1.04s, environment 0ms, prepare 139ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 51 | ×1 | 51 |
| Invocations | 83 | ×2 | 166 |
| Conditionals | 9 | ×4 | 36 |
| Loops | 11 | ×5 | 55 |
| Assignments | 100 | ×6 | 600 |
| **Total Mass** | | | **908** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 219 |
| Functions | 29 |
| Longest Function | 25 lines |
| Avg LOC/Function | 3.72 |
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
| McCabe (Cyclomatic) | 3 | 1.26 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 48372389 |
| Context Utilization | 116% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 38 |
| Avg Cycle Time | 43.61s |
| Avg Red Phase | 7.66s |
| Avg Green Phase | 10.73s |
| Avg Refactor Phase | 25.22s |

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
| Tests Passed Immediately | 15 |


