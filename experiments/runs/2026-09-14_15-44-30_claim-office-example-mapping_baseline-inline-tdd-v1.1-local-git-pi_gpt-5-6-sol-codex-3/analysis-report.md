# Analysis Report: 2026-09-14_15-44-30_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-pi_gpt-5-6-sol-codex-3

Generated: 2026-09-22T16:46:59+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | baseline-inline-tdd-v1.1-local-git-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 307s |
| Started | 2026-09-14T15:44:33+00:00 |
| Ended | 2026-09-14T15:49:46+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 199
- **Test files**: claim-office.spec.ts, cli.spec.ts
- **Test LOC** (total): 164
- **Active tests**: 15
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (23 passed)

```
[WARN] The "pnpm" field in package.json is no longer read by pnpm. The following keys were ignored: "pnpm.onlyBuiltDependencies". See https://pnpm.io/settings for the new home of each setting.

> tdd-experiment-run@ test /home/memrich/agentic_coding_lab/experiments/runs/2026-09-14_15-44-30_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-pi_gpt-5-6-sol-codex-3
> vitest run


 RUN  v1.6.1 /home/memrich/agentic_coding_lab/experiments/runs/2026-09-14_15-44-30_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-pi_gpt-5-6-sol-codex-3

 ✓ src/claim-office.spec.ts  (20 tests) 10ms
 ✓ src/cli.spec.ts  (3 tests) 972ms

 Test Files  2 passed (2)
      Tests  23 passed (23)
   Start at  16:47:01
   Duration  1.32s (transform 86ms, setup 1ms, collect 100ms, tests 982ms, environment 0ms, prepare 193ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 82% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 82 | ×1 | 82 |
| Invocations | 125 | ×2 | 250 |
| Conditionals | 30 | ×4 | 120 |
| Loops | 12 | ×5 | 60 |
| Assignments | 50 | ×6 | 300 |
| **Total Mass** | | | **812** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 173 |
| Functions | 22 |
| Longest Function | 17 lines |
| Avg LOC/Function | 5.73 |
| Median LOC/Function | 5.00 |
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
| McCabe (Cyclomatic) | 8 | 2.96 | 0 |
| Cognitive (SonarJS) | 7 | 2.83 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 406371 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 5 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0.0s |
| Avg Green Phase | 0.0s |
| Avg Refactor Phase | 0.0s |

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
| Refactorings Applied | 2 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


