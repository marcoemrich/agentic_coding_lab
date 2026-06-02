# Analysis Report: 2026-05-12_09-04-53_claim-office-user-story_v5-exact-single-context_opus-4-6-portkey

Generated: 2026-06-02T08:10:34+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-user-story |
| Workflow | v5-exact-single-context |
| Model | opus-4-6-portkey |
| Model Version(s) | claude-opus-4-6 |
| Thinking | true |
| Duration | 1878s |
| Started | 2026-05-12T09:04:53+00:00 |
| Ended | 2026-05-12T09:36:12+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 130
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 230
- **Active tests**: 14
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (14 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_09-04-53_claim-office-user-story_v5-exact-single-context_opus-4-6-portkey
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_09-04-53_claim-office-user-story_v5-exact-single-context_opus-4-6-portkey

npm warn Unknown env config "verify-deps-before-run". This will stop working in the next major version of npm.
npm warn Unknown env config "npm-globalconfig". This will stop working in the next major version of npm.
npm warn Unknown env config "_jsr-registry". This will stop working in the next major version of npm.
 ✓ src/claim-office.spec.ts  (14 tests) 338ms

 Test Files  1 passed (1)
      Tests  14 passed (14)
   Start at  08:10:36
   Duration  714ms (transform 32ms, setup 0ms, collect 27ms, tests 338ms, environment 0ms, prepare 86ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 94% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 48 | ×1 | 48 |
| Invocations | 43 | ×2 | 86 |
| Conditionals | 8 | ×4 | 32 |
| Loops | 5 | ×5 | 25 |
| Assignments | 46 | ×6 | 276 |
| **Total Mass** | | | **467** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 113 |
| Functions | 8 |
| Longest Function | 22 lines |
| Avg LOC/Function | 10.50 |
| Median LOC/Function | 8.50 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 15 |
| Code Quality | 0 |
| **Total** | **15** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 6 | 3.38 | 0 |
| Cognitive (SonarJS) | 6 | 4.17 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 37556307 |
| Context Utilization | 83% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 14 |
| Avg Cycle Time | 127.26s |
| Avg Red Phase | 44.3s |
| Avg Green Phase | 30.38s |
| Avg Refactor Phase | 52.58s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 26 |
| Predictions Total | 26 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 14 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


