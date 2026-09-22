# Analysis Report: 2026-09-16_16-52-58_claim-office-example-mapping_exact-sol-v1.6-test-list-dimensions-pi_gpt-5-6-sol-codex

Generated: 2026-09-22T17:05:59+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-sol-v1.6-test-list-dimensions-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1903s |
| Started | 2026-09-16T16:52:59+00:00 |
| Ended | 2026-09-16T17:24:46+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 158
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 242
- **Active tests**: 39
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (39 passed)

```
[WARN] The "pnpm" field in package.json is no longer read by pnpm. The following keys were ignored: "pnpm.onlyBuiltDependencies". See https://pnpm.io/settings for the new home of each setting.

> tdd-experiment-run@ test /home/memrich/agentic_coding_lab/experiments/runs/2026-09-16_16-52-58_claim-office-example-mapping_exact-sol-v1.6-test-list-dimensions-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/memrich/agentic_coding_lab/experiments/runs/2026-09-16_16-52-58_claim-office-example-mapping_exact-sol-v1.6-test-list-dimensions-pi_gpt-5-6-sol-codex

 ✓ src/claim-office.spec.ts  (39 tests) 3122ms

 Test Files  1 passed (1)
      Tests  39 passed (39)
   Start at  17:06:01
   Duration  3.52s (transform 80ms, setup 0ms, collect 75ms, tests 3.12s, environment 0ms, prepare 85ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 61 | ×1 | 61 |
| Invocations | 83 | ×2 | 166 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 10 | ×5 | 50 |
| Assignments | 40 | ×6 | 240 |
| **Total Mass** | | | **573** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 136 |
| Functions | 19 |
| Longest Function | 20 lines |
| Avg LOC/Function | 4.53 |
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
| McCabe (Cyclomatic) | 3 | 1.47 | 0 |
| Cognitive (SonarJS) | 3 | 1.55 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 9965386 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 40 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0.0s |
| Avg Green Phase | 0.0s |
| Avg Refactor Phase | 0.0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 107 |
| Predictions Total | 109 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 40 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


