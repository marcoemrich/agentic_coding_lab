# Analysis Report: 2026-09-17_00-24-43_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking-4

Generated: 2026-09-22T17:10:05+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1.1-refactor-subagent-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 5609s |
| Started | 2026-09-17T00:24:43+00:00 |
| Ended | 2026-09-17T01:58:22+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 542
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 418
- **Active tests**: 52
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (52 passed)

```
[WARN] The "pnpm" field in package.json is no longer read by pnpm. The following keys were ignored: "pnpm.onlyBuiltDependencies". See https://pnpm.io/settings for the new home of each setting.

> tdd-experiment-run@ test /home/memrich/agentic_coding_lab/experiments/runs/2026-09-17_00-24-43_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking-4
> vitest run


 RUN  v1.6.1 /home/memrich/agentic_coding_lab/experiments/runs/2026-09-17_00-24-43_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking-4

 ✓ src/claim-office.spec.ts  (52 tests) 2942ms

 Test Files  1 passed (1)
      Tests  52 passed (52)
   Start at  17:10:07
   Duration  3.43s (transform 79ms, setup 0ms, collect 81ms, tests 2.94s, environment 0ms, prepare 93ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 84% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 78 | ×1 | 78 |
| Invocations | 141 | ×2 | 282 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 18 | ×5 | 90 |
| Assignments | 39 | ×6 | 234 |
| **Total Mass** | | | **724** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 441 |
| Functions | 43 |
| Longest Function | 15 lines |
| Avg LOC/Function | 4.56 |
| Median LOC/Function | 3.00 |
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
| McCabe (Cyclomatic) | 3 | 1.30 | 0 |
| Cognitive (SonarJS) | 2 | 1.06 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 60459272 |
| Context Utilization | 138% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 52 |
| Avg Cycle Time | 69.93s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 69.93s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 103 |
| Predictions Total | 104 |
| Accuracy | 99% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 53 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


