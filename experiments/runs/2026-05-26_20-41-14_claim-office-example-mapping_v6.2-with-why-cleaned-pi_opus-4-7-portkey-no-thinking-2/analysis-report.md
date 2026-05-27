# Analysis Report: 2026-05-26_20-41-14_claim-office-example-mapping_v6.2-with-why-cleaned-pi_opus-4-7-portkey-no-thinking-2

Generated: 2026-05-27T00:48:43+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-pi |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1490s |
| Started | 2026-05-26T20:41:14+00:00 |
| Ended | 2026-05-26T21:06:05+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 311
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 398
- **Active tests**: 32
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (32 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_20-41-14_claim-office-example-mapping_v6.2-with-why-cleaned-pi_opus-4-7-portkey-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_20-41-14_claim-office-example-mapping_v6.2-with-why-cleaned-pi_opus-4-7-portkey-no-thinking-2

npm warn Unknown env config "verify-deps-before-run". This will stop working in the next major version of npm.
npm warn Unknown env config "_jsr-registry". This will stop working in the next major version of npm.
npm warn Unknown env config "npm-globalconfig". This will stop working in the next major version of npm.
 ✓ src/claim-office.spec.ts  (32 tests) 372ms

 Test Files  1 passed (1)
      Tests  32 passed (32)
   Start at  00:48:44
   Duration  717ms (transform 34ms, setup 0ms, collect 32ms, tests 372ms, environment 0ms, prepare 53ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 94% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 56 | ×1 | 56 |
| Invocations | 80 | ×2 | 160 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 9 | ×5 | 45 |
| Assignments | 86 | ×6 | 516 |
| **Total Mass** | | | **829** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 248 |
| Functions | 29 |
| Longest Function | 13 lines |
| Avg LOC/Function | 4.24 |
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
| McCabe (Cyclomatic) | 4 | 1.57 | 0 |
| Cognitive (SonarJS) | 3 | 1.64 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1716988 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 49 |
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
| Refactorings Applied | 15 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


