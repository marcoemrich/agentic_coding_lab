# Analysis Report: 2026-08-17_06-45-48_claim-office-example-mapping_basic-sol-tdd-cc_opus-4-8-no-thinking

Generated: 2026-08-17T10:34:36+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | basic-sol-tdd-cc |
| Model | opus-4-8-no-thinking |
| Model Version(s) | claude-opus-4-8 |
| Thinking | unknown |
| Duration | 1038s |
| Started | 2026-08-17T06:45:48+00:00 |
| Ended | 2026-08-17T07:03:08+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 280
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 412
- **Active tests**: 39
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (41 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-08-17_06-45-48_claim-office-example-mapping_basic-sol-tdd-cc_opus-4-8-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-08-17_06-45-48_claim-office-example-mapping_basic-sol-tdd-cc_opus-4-8-no-thinking

 ✓ src/claim-office.spec.ts  (39 tests) 7ms
npm warn Unknown env config "npm-globalconfig". This will stop working in the next major version of npm.
npm warn Unknown env config "verify-deps-before-run". This will stop working in the next major version of npm.
npm warn Unknown env config "_jsr-registry". This will stop working in the next major version of npm.
npm warn Unknown env config "npm-globalconfig". This will stop working in the next major version of npm.
npm warn Unknown env config "verify-deps-before-run". This will stop working in the next major version of npm.
npm warn Unknown env config "_jsr-registry". This will stop working in the next major version of npm.
Unknown item type: broomstick
 ✓ src/cli.spec.ts  (2 tests) 591ms

 Test Files  2 passed (2)
      Tests  41 passed (41)
   Start at  10:34:37
   Duration  972ms (transform 46ms, setup 0ms, collect 53ms, tests 598ms, environment 0ms, prepare 195ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 58 | ×1 | 58 |
| Invocations | 101 | ×2 | 202 |
| Conditionals | 18 | ×4 | 72 |
| Loops | 11 | ×5 | 55 |
| Assignments | 60 | ×6 | 360 |
| **Total Mass** | | | **747** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 235 |
| Functions | 25 |
| Longest Function | 18 lines |
| Avg LOC/Function | 6.16 |
| Median LOC/Function | 6.00 |
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
| McCabe (Cyclomatic) | 4 | 1.63 | 0 |
| Cognitive (SonarJS) | 4 | 1.35 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 26828143 |
| Context Utilization | 75% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 19 |
| Avg Cycle Time | 18.68s |
| Avg Red Phase | 10.95s |
| Avg Green Phase | 7.73s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 36 |
| Predictions Total | 36 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 31 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


