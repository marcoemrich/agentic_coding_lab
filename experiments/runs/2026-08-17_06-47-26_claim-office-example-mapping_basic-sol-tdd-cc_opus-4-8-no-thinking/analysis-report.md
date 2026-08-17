# Analysis Report: 2026-08-17_06-47-26_claim-office-example-mapping_basic-sol-tdd-cc_opus-4-8-no-thinking

Generated: 2026-08-17T10:34:57+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | basic-sol-tdd-cc |
| Model | opus-4-8-no-thinking |
| Model Version(s) | claude-opus-4-8 |
| Thinking | unknown |
| Duration | 1010s |
| Started | 2026-08-17T06:47:26+00:00 |
| Ended | 2026-08-17T07:04:17+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 267
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 556
- **Active tests**: 41
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (41 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-08-17_06-47-26_claim-office-example-mapping_basic-sol-tdd-cc_opus-4-8-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-08-17_06-47-26_claim-office-example-mapping_basic-sol-tdd-cc_opus-4-8-no-thinking

npm warn Unknown env config "npm-globalconfig". This will stop working in the next major version of npm.
npm warn Unknown env config "verify-deps-before-run". This will stop working in the next major version of npm.
npm warn Unknown env config "_jsr-registry". This will stop working in the next major version of npm.
 ✓ src/claim-office.spec.ts  (41 tests) 298ms

 Test Files  1 passed (1)
      Tests  41 passed (41)
   Start at  10:34:58
   Duration  649ms (transform 37ms, setup 0ms, collect 35ms, tests 298ms, environment 0ms, prepare 65ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 62 | ×1 | 62 |
| Invocations | 96 | ×2 | 192 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 13 | ×5 | 65 |
| Assignments | 65 | ×6 | 390 |
| **Total Mass** | | | **769** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 227 |
| Functions | 20 |
| Longest Function | 24 lines |
| Avg LOC/Function | 7.45 |
| Median LOC/Function | 7.00 |
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
| McCabe (Cyclomatic) | 6 | 1.63 | 0 |
| Cognitive (SonarJS) | 7 | 2.08 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 25664269 |
| Context Utilization | 71% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 33 |
| Avg Cycle Time | 17.03s |
| Avg Red Phase | 3.69s |
| Avg Green Phase | 9.08s |
| Avg Refactor Phase | 4.26s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 64 |
| Predictions Total | 64 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 32 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 18 |


