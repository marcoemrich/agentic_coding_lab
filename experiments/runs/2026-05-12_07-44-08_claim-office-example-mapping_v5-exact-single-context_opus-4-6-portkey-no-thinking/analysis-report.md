# Analysis Report: 2026-05-12_07-44-08_claim-office-example-mapping_v5-exact-single-context_opus-4-6-portkey-no-thinking

Generated: 2026-06-02T08:05:58+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5-exact-single-context |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 2308s |
| Started | 2026-05-12T07:44:08+00:00 |
| Ended | 2026-05-12T08:22:37+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 189
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 743
- **Active tests**: 36
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (36 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_07-44-08_claim-office-example-mapping_v5-exact-single-context_opus-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_07-44-08_claim-office-example-mapping_v5-exact-single-context_opus-4-6-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (36 tests) 6ms

 Test Files  1 passed (1)
      Tests  36 passed (36)
   Start at  08:05:58
   Duration  368ms (transform 42ms, setup 0ms, collect 41ms, tests 6ms, environment 0ms, prepare 82ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 62 | ×1 | 62 |
| Invocations | 61 | ×2 | 122 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 11 | ×5 | 55 |
| Assignments | 58 | ×6 | 348 |
| **Total Mass** | | | **639** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 175 |
| Functions | 7 |
| Longest Function | 19 lines |
| Avg LOC/Function | 9.57 |
| Median LOC/Function | 7.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 2 |
| Duplication | 0 |
| Magic Numbers | 1 |
| Code Quality | 0 |
| **Total** | **3** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 12 | 4.30 | 1 |
| Cognitive (SonarJS) | 15 | 5.62 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 46713470 |
| Context Utilization | 83% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 28 |
| Avg Cycle Time | 138.62s |
| Avg Red Phase | 36.09s |
| Avg Green Phase | 42.48s |
| Avg Refactor Phase | 60.05s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 54 |
| Predictions Total | 54 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 7 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 10 |


