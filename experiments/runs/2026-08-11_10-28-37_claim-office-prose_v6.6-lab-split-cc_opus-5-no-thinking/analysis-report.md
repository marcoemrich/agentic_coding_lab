# Analysis Report: 2026-08-11_10-28-37_claim-office-prose_v6.6-lab-split-cc_opus-5-no-thinking

Generated: 2026-08-11T11:25:40+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-prose |
| Workflow | v6.6-lab-split-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 3422s |
| Started | 2026-08-11T10:28:37+00:00 |
| Ended | 2026-08-11T11:25:40+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 466
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 504
- **Active tests**: 30
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (31 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-11_10-28-37_claim-office-prose_v6.6-lab-split-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-11_10-28-37_claim-office-prose_v6.6-lab-split-cc_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (30 tests) 8ms
 ✓ src/cli.spec.ts  (1 test) 2ms

 Test Files  2 passed (2)
      Tests  31 passed (31)
   Start at  11:25:41
   Duration  401ms (transform 63ms, setup 0ms, collect 70ms, tests 10ms, environment 0ms, prepare 108ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 98% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 61 | ×1 | 61 |
| Invocations | 82 | ×2 | 164 |
| Conditionals | 9 | ×4 | 36 |
| Loops | 15 | ×5 | 75 |
| Assignments | 103 | ×6 | 618 |
| **Total Mass** | | | **954** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 319 |
| Functions | 34 |
| Longest Function | 8 lines |
| Avg LOC/Function | 2.82 |
| Median LOC/Function | 2.00 |
| Imports | 3 |

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
| McCabe (Cyclomatic) | 3 | 1.21 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 69870929 |
| Context Utilization | 160% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 31 |
| Avg Cycle Time | 121.40s |
| Avg Red Phase | 22.07s |
| Avg Green Phase | 30.59s |
| Avg Refactor Phase | 68.74s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 62 |
| Predictions Total | 62 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 29 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 14 |


