# Analysis Report: 2026-05-12_07-22-03_claim-office-prose_v5-exact-single-context_opus-4-6-portkey-no-thinking-2

Generated: 2026-06-02T08:04:35+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-prose |
| Workflow | v5-exact-single-context |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 1792s |
| Started | 2026-05-12T07:22:03+00:00 |
| Ended | 2026-05-12T07:51:58+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 152
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 446
- **Active tests**: 20
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (20 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_07-22-03_claim-office-prose_v5-exact-single-context_opus-4-6-portkey-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_07-22-03_claim-office-prose_v5-exact-single-context_opus-4-6-portkey-no-thinking-2

npm warn Unknown env config "verify-deps-before-run". This will stop working in the next major version of npm.
npm warn Unknown env config "npm-globalconfig". This will stop working in the next major version of npm.
npm warn Unknown env config "_jsr-registry". This will stop working in the next major version of npm.
 ✓ src/claim-office.spec.ts  (20 tests) 334ms

 Test Files  1 passed (1)
      Tests  20 passed (20)
   Start at  08:04:37
   Duration  693ms (transform 35ms, setup 0ms, collect 32ms, tests 334ms, environment 0ms, prepare 59ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 96% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 49 | ×1 | 49 |
| Invocations | 38 | ×2 | 76 |
| Conditionals | 7 | ×4 | 28 |
| Loops | 6 | ×5 | 30 |
| Assignments | 49 | ×6 | 294 |
| **Total Mass** | | | **477** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 134 |
| Functions | 7 |
| Longest Function | 35 lines |
| Avg LOC/Function | 10.86 |
| Median LOC/Function | 6.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 1 |
| Code Quality | 0 |
| **Total** | **2** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 4 | 1.79 | 0 |
| Cognitive (SonarJS) | 4 | 2.33 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 35657842 |
| Context Utilization | 83% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 20 |
| Avg Cycle Time | 126.49s |
| Avg Red Phase | 34.67s |
| Avg Green Phase | 38.56s |
| Avg Refactor Phase | 53.26s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 40 |
| Predictions Total | 40 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 11 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 9 |


