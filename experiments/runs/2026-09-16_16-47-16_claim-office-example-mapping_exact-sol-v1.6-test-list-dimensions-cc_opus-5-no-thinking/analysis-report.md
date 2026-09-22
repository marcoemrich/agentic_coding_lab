# Analysis Report: 2026-09-16_16-47-16_claim-office-example-mapping_exact-sol-v1.6-test-list-dimensions-cc_opus-5-no-thinking

Generated: 2026-09-22T17:03:02+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-sol-v1.6-test-list-dimensions-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 1126s |
| Started | 2026-09-16T16:47:16+00:00 |
| Ended | 2026-09-16T17:06:06+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 300
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 933
- **Active tests**: 58
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (58 passed)

```
[WARN] The "pnpm" field in package.json is no longer read by pnpm. The following keys were ignored: "pnpm.onlyBuiltDependencies". See https://pnpm.io/settings for the new home of each setting.

> tdd-experiment-run@ test /home/memrich/agentic_coding_lab/experiments/runs/2026-09-16_16-47-16_claim-office-example-mapping_exact-sol-v1.6-test-list-dimensions-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/agentic_coding_lab/experiments/runs/2026-09-16_16-47-16_claim-office-example-mapping_exact-sol-v1.6-test-list-dimensions-cc_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (58 tests) 3828ms

 Test Files  1 passed (1)
      Tests  58 passed (58)
   Start at  17:03:04
   Duration  4.24s (transform 80ms, setup 1ms, collect 79ms, tests 3.83s, environment 0ms, prepare 84ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 66 | ×1 | 66 |
| Invocations | 98 | ×2 | 196 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 13 | ×5 | 65 |
| Assignments | 54 | ×6 | 324 |
| **Total Mass** | | | **707** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 239 |
| Functions | 25 |
| Longest Function | 15 lines |
| Avg LOC/Function | 6.40 |
| Median LOC/Function | 6.00 |
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
| McCabe (Cyclomatic) | 3 | 1.51 | 0 |
| Cognitive (SonarJS) | 3 | 1.27 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 19724207 |
| Context Utilization | 79% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 3 |
| Avg Cycle Time | 28.82s |
| Avg Red Phase | 18.62s |
| Avg Green Phase | 5.22s |
| Avg Refactor Phase | 4.98s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 77 |
| Predictions Total | 78 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 39 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


