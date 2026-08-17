# Analysis Report: 2026-08-17_06-44-58_claim-office-example-mapping_basic-sol-tdd-cc_opus-4-8-no-thinking

Generated: 2026-08-17T10:34:26+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | basic-sol-tdd-cc |
| Model | opus-4-8-no-thinking |
| Model Version(s) | claude-opus-4-8 |
| Thinking | unknown |
| Duration | 890s |
| Started | 2026-08-17T06:44:58+00:00 |
| Ended | 2026-08-17T06:59:49+00:00 |

## Code Metrics

- **Implementation files**: claimOffice.ts, cli.ts, node-shims.d.ts
- **Implementation LOC** (total): 276
- **Test file**: claimOffice.spec.ts
- **Test file LOC**: 511
- **Active tests**: 33
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (33 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-08-17_06-44-58_claim-office-example-mapping_basic-sol-tdd-cc_opus-4-8-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-08-17_06-44-58_claim-office-example-mapping_basic-sol-tdd-cc_opus-4-8-no-thinking

npm warn Unknown env config "npm-globalconfig". This will stop working in the next major version of npm.
npm warn Unknown env config "verify-deps-before-run". This will stop working in the next major version of npm.
npm warn Unknown env config "_jsr-registry". This will stop working in the next major version of npm.
npm warn Unknown env config "npm-globalconfig". This will stop working in the next major version of npm.
npm warn Unknown env config "verify-deps-before-run". This will stop working in the next major version of npm.
npm warn Unknown env config "_jsr-registry". This will stop working in the next major version of npm.
Unknown item type: "broomstick"
 ✓ src/claimOffice.spec.ts  (33 tests) 601ms

 Test Files  1 passed (1)
      Tests  33 passed (33)
   Start at  10:34:26
   Duration  915ms (transform 36ms, setup 0ms, collect 33ms, tests 601ms, environment 0ms, prepare 79ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 69 | ×1 | 69 |
| Invocations | 90 | ×2 | 180 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 12 | ×5 | 60 |
| Assignments | 54 | ×6 | 324 |
| **Total Mass** | | | **693** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 233 |
| Functions | 21 |
| Longest Function | 18 lines |
| Avg LOC/Function | 6.43 |
| Median LOC/Function | 6.00 |
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
| McCabe (Cyclomatic) | 4 | 1.74 | 0 |
| Cognitive (SonarJS) | 3 | 1.69 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 22050494 |
| Context Utilization | 66% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 50 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

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
| Refactorings Applied | 32 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


