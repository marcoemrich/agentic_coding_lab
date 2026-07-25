# Analysis Report: 2026-07-25_03-37-07_claim-office-example-mapping_v6.2-with-why-cleaned-pi_deepseek-v4-pro-no-thinking

Generated: 2026-07-25T20:34:50+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-pi |
| Model | deepseek-v4-pro-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 56s |
| Started | 2026-07-25T03:37:07+00:00 |
| Ended | 2026-07-25T03:38:04+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 83
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 93
- **Active tests**: 0
- **Remaining todos**: 46

## Test Results

**Status**: ❌ Tests failed or not runnable

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-25_03-37-07_claim-office-example-mapping_v6.2-with-why-cleaned-pi_deepseek-v4-pro-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-25_03-37-07_claim-office-example-mapping_v6.2-with-why-cleaned-pi_deepseek-v4-pro-no-thinking

 ↓ src/claim-office.spec.ts  (46 tests | 46 skipped)

 Test Files  1 skipped (1)
      Tests  46 todo (46)
   Start at  20:34:51
   Duration  417ms (transform 25ms, setup 0ms, collect 27ms, tests 0ms, environment 0ms, prepare 104ms)
```

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 10 | ×1 | 10 |
| Invocations | 18 | ×2 | 36 |
| Conditionals | 5 | ×4 | 20 |
| Loops | 1 | ×5 | 5 |
| Assignments | 8 | ×6 | 48 |
| **Total Mass** | | | **119** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 62 |
| Functions | 2 |
| Longest Function | 26 lines |
| Avg LOC/Function | 15.00 |
| Median LOC/Function | 15.00 |
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
| McCabe (Cyclomatic) | 5 | 3.00 | 0 |
| Cognitive (SonarJS) | 5 | 5.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 162369 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 0 |
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
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


