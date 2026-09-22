# Analysis Report: 2026-09-16_08-30-59_claim-office-example-mapping_exact-sol-v1.6-test-list-dimensions-cc_opus-5-no-thinking

Generated: 2026-09-22T16:54:15+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-sol-v1.6-test-list-dimensions-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 1307s |
| Started | 2026-09-16T08:30:59+00:00 |
| Ended | 2026-09-16T08:52:49+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 282
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 412
- **Active tests**: 57
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (57 passed)

```
[WARN] The "pnpm" field in package.json is no longer read by pnpm. The following keys were ignored: "pnpm.onlyBuiltDependencies". See https://pnpm.io/settings for the new home of each setting.

> tdd-experiment-run@ test /home/memrich/agentic_coding_lab/experiments/runs/2026-09-16_08-30-59_claim-office-example-mapping_exact-sol-v1.6-test-list-dimensions-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/agentic_coding_lab/experiments/runs/2026-09-16_08-30-59_claim-office-example-mapping_exact-sol-v1.6-test-list-dimensions-cc_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (57 tests) 3800ms

 Test Files  1 passed (1)
      Tests  57 passed (57)
   Start at  16:54:17
   Duration  4.22s (transform 82ms, setup 0ms, collect 81ms, tests 3.80s, environment 0ms, prepare 86ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 85% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 61 | ×1 | 61 |
| Invocations | 107 | ×2 | 214 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 8 | ×5 | 40 |
| Assignments | 62 | ×6 | 372 |
| **Total Mass** | | | **747** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 231 |
| Functions | 28 |
| Longest Function | 9 lines |
| Avg LOC/Function | 4.89 |
| Median LOC/Function | 4.50 |
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
| McCabe (Cyclomatic) | 3 | 1.40 | 0 |
| Cognitive (SonarJS) | 2 | 1.21 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 24221158 |
| Context Utilization | 81% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 21 |
| Avg Cycle Time | 6.01s |
| Avg Red Phase | 3.23s |
| Avg Green Phase | 2.78s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 114 |
| Predictions Total | 114 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 62 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 20 |


