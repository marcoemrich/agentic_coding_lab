# Analysis Report: 2026-10-04_23-06-46_claim-office-example-mapping_baseline-inline-tdd-v1-pi_gpt-6-1-sol-codex-2

Generated: 2026-10-04T23:14:40+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | baseline-inline-tdd-v1-pi |
| Model | gpt-6-1-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 466s |
| Started | 2026-10-04T23:06:48+00:00 |
| Ended | 2026-10-04T23:14:40+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, office.ts, validation.ts
- **Implementation LOC** (total): 166
- **Test files**: cli.spec.ts, office.spec.ts
- **Test LOC** (total): 203
- **Active tests**: 21
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (67 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-04_23-06-46_claim-office-example-mapping_baseline-inline-tdd-v1-pi_gpt-6-1-sol-codex-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-04_23-06-46_claim-office-example-mapping_baseline-inline-tdd-v1-pi_gpt-6-1-sol-codex-2

 ✓ src/office.spec.ts  (45 tests) 8ms
 ✓ src/cli.spec.ts  (22 tests) 4243ms

 Test Files  2 passed (2)
      Tests  67 passed (67)
   Start at  23:14:41
   Duration  4.84s (transform 104ms, setup 0ms, collect 127ms, tests 4.25s, environment 0ms, prepare 154ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 80% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 80 | ×1 | 80 |
| Invocations | 92 | ×2 | 184 |
| Conditionals | 22 | ×4 | 88 |
| Loops | 8 | ×5 | 40 |
| Assignments | 41 | ×6 | 246 |
| **Total Mass** | | | **638** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 148 |
| Functions | 14 |
| Longest Function | 20 lines |
| Avg LOC/Function | 7.57 |
| Median LOC/Function | 7.00 |
| Imports | 4 |

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
| McCabe (Cyclomatic) | 9 | 3.27 | 0 |
| Cognitive (SonarJS) | 10 | 3.42 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1066793 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 11 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

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
| Refactorings Applied | 1 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


