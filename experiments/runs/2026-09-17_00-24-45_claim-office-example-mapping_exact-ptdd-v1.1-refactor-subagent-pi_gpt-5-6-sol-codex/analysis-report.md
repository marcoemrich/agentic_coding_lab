# Analysis Report: 2026-09-17_00-24-45_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-pi_gpt-5-6-sol-codex

Generated: 2026-09-22T17:11:50+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1.1-refactor-subagent-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 4917s |
| Started | 2026-09-17T00:24:49+00:00 |
| Ended | 2026-09-17T01:46:55+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts, node-shim.d.ts
- **Implementation LOC** (total): 234
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 345
- **Active tests**: 35
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (35 passed)

```
[WARN] The "pnpm" field in package.json is no longer read by pnpm. The following keys were ignored: "pnpm.onlyBuiltDependencies". See https://pnpm.io/settings for the new home of each setting.

> tdd-experiment-run@ test /home/memrich/agentic_coding_lab/experiments/runs/2026-09-17_00-24-45_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/memrich/agentic_coding_lab/experiments/runs/2026-09-17_00-24-45_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-pi_gpt-5-6-sol-codex

 ✓ src/claim-office.spec.ts  (35 tests) 3254ms

 Test Files  1 passed (1)
      Tests  35 passed (35)
   Start at  17:11:52
   Duration  3.68s (transform 90ms, setup 0ms, collect 78ms, tests 3.25s, environment 0ms, prepare 92ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 60 | ×1 | 60 |
| Invocations | 95 | ×2 | 190 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 7 | ×5 | 35 |
| Assignments | 48 | ×6 | 288 |
| **Total Mass** | | | **633** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 200 |
| Functions | 29 |
| Longest Function | 19 lines |
| Avg LOC/Function | 4.66 |
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
| McCabe (Cyclomatic) | 3 | 1.34 | 0 |
| Cognitive (SonarJS) | 2 | 1.08 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 15551907 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 35 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0.0s |
| Avg Green Phase | 0.0s |
| Avg Refactor Phase | 0.0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 70 |
| Predictions Total | 70 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 36 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


