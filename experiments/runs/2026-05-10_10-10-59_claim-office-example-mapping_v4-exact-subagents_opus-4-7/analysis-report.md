# Analysis Report: 2026-05-10_10-10-59_claim-office-example-mapping_v4-exact-subagents_opus-4-7

Generated: 2026-05-10T15:00:57+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4-exact-subagents |
| Model | opus-4-7 |
| Model Version(s) | claude-opus-4-7 |
| Thinking | true |
| Duration | 5400s |
| Started | 2026-05-10T10:10:59+00:00 |
| Ended | 2026-05-10T11:41:01+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 164
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 448
- **Active tests**: 42
- **Remaining todos**: 7

## Test Results

**Status**: ✅ All tests passing (42 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-10_10-10-59_claim-office-example-mapping_v4-exact-subagents_opus-4-7
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-10_10-10-59_claim-office-example-mapping_v4-exact-subagents_opus-4-7

npm warn Unknown env config "verify-deps-before-run". This will stop working in the next major version of npm.
npm warn Unknown env config "_jsr-registry". This will stop working in the next major version of npm.
npm warn Unknown env config "npm-globalconfig". This will stop working in the next major version of npm.
 ✓ src/claim-office.spec.ts  (49 tests | 7 skipped) 350ms

 Test Files  1 passed (1)
      Tests  42 passed | 7 todo (49)
   Start at  15:00:57
   Duration  771ms (transform 42ms, setup 0ms, collect 39ms, tests 350ms, environment 0ms, prepare 90ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 97% |
| Branches | 89% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 53 | ×1 | 53 |
| Invocations | 53 | ×2 | 106 |
| Conditionals | 5 | ×4 | 20 |
| Loops | 6 | ×5 | 30 |
| Assignments | 70 | ×6 | 420 |
| **Total Mass** | | | **629** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 132 |
| Functions | 25 |
| Longest Function | 9 lines |
| Avg LOC/Function | 3.00 |
| Median LOC/Function | 2.00 |
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
| McCabe (Cyclomatic) | 3 | 1.31 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 12008767 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 42 |
| Avg Cycle Time | 170.49s |
| Avg Red Phase | 53.07s |
| Avg Green Phase | 45.04s |
| Avg Refactor Phase | 72.38s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 53 |
| Predictions Total | 54 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 19 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 25 |


