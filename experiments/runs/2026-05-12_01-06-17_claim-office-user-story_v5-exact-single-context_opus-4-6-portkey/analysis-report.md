# Analysis Report: 2026-05-12_01-06-17_claim-office-user-story_v5-exact-single-context_opus-4-6-portkey

Generated: 2026-06-02T07:56:24+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-user-story |
| Workflow | v5-exact-single-context |
| Model | opus-4-6-portkey |
| Model Version(s) | claude-opus-4-6 |
| Thinking | true |
| Duration | 1987s |
| Started | 2026-05-12T01:06:17+00:00 |
| Ended | 2026-05-12T01:39:26+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 113
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 393
- **Active tests**: 15
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (15 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_01-06-17_claim-office-user-story_v5-exact-single-context_opus-4-6-portkey
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_01-06-17_claim-office-user-story_v5-exact-single-context_opus-4-6-portkey

npm warn Unknown env config "verify-deps-before-run". This will stop working in the next major version of npm.
npm warn Unknown env config "npm-globalconfig". This will stop working in the next major version of npm.
npm warn Unknown env config "_jsr-registry". This will stop working in the next major version of npm.
 ✓ src/claim-office.spec.ts  (15 tests) 454ms

 Test Files  1 passed (1)
      Tests  15 passed (15)
   Start at  07:56:26
   Duration  923ms (transform 53ms, setup 0ms, collect 45ms, tests 454ms, environment 0ms, prepare 99ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 51 | ×1 | 51 |
| Invocations | 28 | ×2 | 56 |
| Conditionals | 8 | ×4 | 32 |
| Loops | 5 | ×5 | 25 |
| Assignments | 48 | ×6 | 288 |
| **Total Mass** | | | **452** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 102 |
| Functions | 5 |
| Longest Function | 33 lines |
| Avg LOC/Function | 14.40 |
| Median LOC/Function | 7.00 |
| Imports | 2 |

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
| McCabe (Cyclomatic) | 7 | 2.75 | 0 |
| Cognitive (SonarJS) | 12 | 5.75 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 38793223 |
| Context Utilization | 83% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 15 |
| Avg Cycle Time | 125.38s |
| Avg Red Phase | 35.91s |
| Avg Green Phase | 32.82s |
| Avg Refactor Phase | 56.65s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 30 |
| Predictions Total | 30 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 15 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


