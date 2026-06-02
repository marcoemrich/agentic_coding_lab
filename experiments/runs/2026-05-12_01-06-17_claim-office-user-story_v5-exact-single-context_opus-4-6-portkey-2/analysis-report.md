# Analysis Report: 2026-05-12_01-06-17_claim-office-user-story_v5-exact-single-context_opus-4-6-portkey-2

Generated: 2026-06-02T07:55:59+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-user-story |
| Workflow | v5-exact-single-context |
| Model | opus-4-6-portkey |
| Model Version(s) | claude-opus-4-6 |
| Thinking | true |
| Duration | 1803s |
| Started | 2026-05-12T01:06:17+00:00 |
| Ended | 2026-05-12T01:36:22+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 147
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 268
- **Active tests**: 14
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (14 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_01-06-17_claim-office-user-story_v5-exact-single-context_opus-4-6-portkey-2
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_01-06-17_claim-office-user-story_v5-exact-single-context_opus-4-6-portkey-2

npm warn Unknown env config "verify-deps-before-run". This will stop working in the next major version of npm.
npm warn Unknown env config "npm-globalconfig". This will stop working in the next major version of npm.
npm warn Unknown env config "_jsr-registry". This will stop working in the next major version of npm.
 ✓ src/claim-office.spec.ts  (14 tests) 325ms

 Test Files  1 passed (1)
      Tests  14 passed (14)
   Start at  07:56:01
   Duration  690ms (transform 35ms, setup 1ms, collect 32ms, tests 325ms, environment 0ms, prepare 121ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 95% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 51 | ×1 | 51 |
| Invocations | 34 | ×2 | 68 |
| Conditionals | 7 | ×4 | 28 |
| Loops | 5 | ×5 | 25 |
| Assignments | 51 | ×6 | 306 |
| **Total Mass** | | | **478** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 131 |
| Functions | 3 |
| Longest Function | 39 lines |
| Avg LOC/Function | 24.33 |
| Median LOC/Function | 28.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 3 |
| Duplication | 0 |
| Magic Numbers | 11 |
| Code Quality | 0 |
| **Total** | **14** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 7 | 2.86 | 0 |
| Cognitive (SonarJS) | 12 | 4.75 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 38376351 |
| Context Utilization | 83% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 14 |
| Avg Cycle Time | 123.93s |
| Avg Red Phase | 38.42s |
| Avg Green Phase | 29.06s |
| Avg Refactor Phase | 56.45s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 27 |
| Predictions Total | 28 |
| Accuracy | 96% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 13 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


