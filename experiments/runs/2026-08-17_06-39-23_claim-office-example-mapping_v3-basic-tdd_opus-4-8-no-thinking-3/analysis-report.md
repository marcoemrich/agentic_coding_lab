# Analysis Report: 2026-08-17_06-39-23_claim-office-example-mapping_v3-basic-tdd_opus-4-8-no-thinking-3

Generated: 2026-08-17T10:33:41+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v3-basic-tdd |
| Model | opus-4-8-no-thinking |
| Model Version(s) | claude-opus-4-8 |
| Thinking | unknown |
| Duration | 312s |
| Started | 2026-08-17T06:39:23+00:00 |
| Ended | 2026-08-17T06:44:37+00:00 |

## Code Metrics

- **Implementation files**: basePremium.ts, catalog.ts, claim.ts, cli.ts, node-shims.d.ts, premium.ts, rounding.ts, scenario.ts
- **Implementation LOC** (total): 306
- **Test file**: premium.spec.ts
- **Test file LOC**: 65
- **Active tests**: 8
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (44 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-08-17_06-39-23_claim-office-example-mapping_v3-basic-tdd_opus-4-8-no-thinking-3
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-08-17_06-39-23_claim-office-example-mapping_v3-basic-tdd_opus-4-8-no-thinking-3

 ✓ src/premium.spec.ts  (8 tests) 3ms
 ✓ src/catalog.spec.ts  (4 tests) 4ms
 ✓ src/basePremium.spec.ts  (7 tests) 2ms
 ✓ src/scenario.spec.ts  (4 tests) 4ms
 ✓ src/claim.spec.ts  (17 tests) 4ms
npm warn Unknown env config "npm-globalconfig". This will stop working in the next major version of npm.
npm warn Unknown env config "verify-deps-before-run". This will stop working in the next major version of npm.
npm warn Unknown env config "_jsr-registry". This will stop working in the next major version of npm.
npm warn Unknown env config "npm-globalconfig". This will stop working in the next major version of npm.
npm warn Unknown env config "verify-deps-before-run". This will stop working in the next major version of npm.
npm warn Unknown env config "_jsr-registry". This will stop working in the next major version of npm.
claim-office error: Unknown item type: broomstick
npm warn Unknown env config "npm-globalconfig". This will stop working in the next major version of npm.
npm warn Unknown env config "verify-deps-before-run". This will stop working in the next major version of npm.
npm warn Unknown env config "_jsr-registry". This will stop working in the next major version of npm.
claim-office error: Negative damage amount: -200
npm warn Unknown env config "npm-globalconfig". This will stop working in the next major version of npm.
npm warn Unknown env config "verify-deps-before-run". This will stop working in the next major version of npm.
npm warn Unknown env config "_jsr-registry". This will stop working in the next major version of npm.
 ✓ src/cli.spec.ts  (4 tests) 1224ms

 Test Files  6 passed (6)
      Tests  44 passed (44)
   Start at  10:33:42
   Duration  1.58s (transform 118ms, setup 0ms, collect 169ms, tests 1.24s, environment 1ms, prepare 700ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 80 | ×1 | 80 |
| Invocations | 101 | ×2 | 202 |
| Conditionals | 18 | ×4 | 72 |
| Loops | 10 | ×5 | 50 |
| Assignments | 68 | ×6 | 408 |
| **Total Mass** | | | **812** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 254 |
| Functions | 17 |
| Longest Function | 18 lines |
| Avg LOC/Function | 9.59 |
| Median LOC/Function | 8.00 |
| Imports | 11 |

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
| McCabe (Cyclomatic) | 5 | 1.85 | 0 |
| Cognitive (SonarJS) | 6 | 2.08 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 4639647 |
| Context Utilization | 37% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 7 |
| Avg Cycle Time | 13.96s |
| Avg Red Phase | 1.68s |
| Avg Green Phase | 2.71s |
| Avg Refactor Phase | 9.57s |

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
| Refactorings Applied | 1 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


