# Analysis Report: 2026-10-01_01-38-09_claim-office-example-mapping_external-pocock-2026-09-04-cc_opus-5-5-no-thinking

Generated: 2026-10-01T01:43:33+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | external-pocock-2026-09-04-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5 |
| Thinking | unknown |
| Duration | 320s |
| Started | 2026-10-01T01:38:09+00:00 |
| Ended | 2026-10-01T01:43:33+00:00 |

## Code Metrics

- **Implementation files**: claimOffice.ts, cli.ts
- **Implementation LOC** (total): 185
- **Test files**: claimOffice.spec.ts, cli.spec.ts
- **Test LOC** (total): 251
- **Active tests**: 28
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (42 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-01_01-38-09_claim-office-example-mapping_external-pocock-2026-09-04-cc_opus-5-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-01_01-38-09_claim-office-example-mapping_external-pocock-2026-09-04-cc_opus-5-5-no-thinking

 ✓ src/claimOffice.spec.ts  (39 tests) 8ms
 ✓ src/cli.spec.ts  (3 tests) 459ms

 Test Files  2 passed (2)
      Tests  42 passed (42)
   Start at  01:43:34
   Duration  943ms (transform 73ms, setup 0ms, collect 71ms, tests 467ms, environment 0ms, prepare 145ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 55 | ×1 | 55 |
| Invocations | 68 | ×2 | 136 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 9 | ×5 | 45 |
| Assignments | 50 | ×6 | 300 |
| **Total Mass** | | | **596** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 158 |
| Functions | 10 |
| Longest Function | 20 lines |
| Avg LOC/Function | 9.30 |
| Median LOC/Function | 7.50 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 8 |
| Code Quality | 0 |
| **Total** | **8** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 7 | 2.40 | 0 |
| Cognitive (SonarJS) | 8 | 2.89 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 5740290 |
| Context Utilization | 39% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 35 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

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
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


