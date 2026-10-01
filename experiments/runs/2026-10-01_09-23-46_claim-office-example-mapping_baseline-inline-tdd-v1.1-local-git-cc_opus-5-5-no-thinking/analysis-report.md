# Analysis Report: 2026-10-01_09-23-46_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-5-no-thinking

Generated: 2026-10-01T09:25:55+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | baseline-inline-tdd-v1.1-local-git-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5 |
| Thinking | unknown |
| Duration | 126s |
| Started | 2026-10-01T09:23:46+00:00 |
| Ended | 2026-10-01T09:25:55+00:00 |

## Code Metrics

- **Implementation files**: catalog.ts, cli.ts, policy.ts, premium.ts, scenario.ts
- **Implementation LOC** (total): 233
- **Test files**: cli.spec.ts, policy.spec.ts, premium.spec.ts
- **Test LOC** (total): 239
- **Active tests**: 31
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (37 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-01_09-23-46_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-01_09-23-46_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-5-no-thinking

 ✓ src/policy.spec.ts  (16 tests) 6ms
 ✓ src/premium.spec.ts  (15 tests) 4ms
 ✓ src/cli.spec.ts  (6 tests) 1414ms

 Test Files  3 passed (3)
      Tests  37 passed (37)
   Start at  09:25:56
   Duration  2.09s (transform 82ms, setup 0ms, collect 98ms, tests 1.42s, environment 0ms, prepare 201ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 91% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 68 | ×1 | 68 |
| Invocations | 100 | ×2 | 200 |
| Conditionals | 21 | ×4 | 84 |
| Loops | 12 | ×5 | 60 |
| Assignments | 53 | ×6 | 318 |
| **Total Mass** | | | **730** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 195 |
| Functions | 14 |
| Longest Function | 28 lines |
| Avg LOC/Function | 7.14 |
| Median LOC/Function | 4.50 |
| Imports | 7 |

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
| McCabe (Cyclomatic) | 7 | 2.19 | 0 |
| Cognitive (SonarJS) | 8 | 2.62 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1659125 |
| Context Utilization | 28% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 3 |
| Avg Cycle Time | 6.51s |
| Avg Red Phase | 1.94s |
| Avg Green Phase | 4.57s |
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
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


