# Analysis Report: 2026-10-01_01-37-28_claim-office-example-mapping_external-pocock-2026-09-04-cc_opus-5-5-no-thinking

Generated: 2026-10-01T01:42:42+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | external-pocock-2026-09-04-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5 |
| Thinking | unknown |
| Duration | 311s |
| Started | 2026-10-01T01:37:28+00:00 |
| Ended | 2026-10-01T01:42:42+00:00 |

## Code Metrics

- **Implementation files**: claimOffice.ts, cli.ts
- **Implementation LOC** (total): 149
- **Test files**: claimOffice.spec.ts, cli.spec.ts
- **Test LOC** (total): 233
- **Active tests**: 21
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (42 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-01_01-37-28_claim-office-example-mapping_external-pocock-2026-09-04-cc_opus-5-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-01_01-37-28_claim-office-example-mapping_external-pocock-2026-09-04-cc_opus-5-5-no-thinking

 ✓ src/claimOffice.spec.ts  (40 tests) 9ms
 ✓ src/cli.spec.ts  (2 tests) 958ms

 Test Files  2 passed (2)
      Tests  42 passed (42)
   Start at  01:42:43
   Duration  1.48s (transform 97ms, setup 0ms, collect 92ms, tests 967ms, environment 0ms, prepare 159ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 60 | ×1 | 60 |
| Invocations | 52 | ×2 | 104 |
| Conditionals | 18 | ×4 | 72 |
| Loops | 6 | ×5 | 30 |
| Assignments | 49 | ×6 | 294 |
| **Total Mass** | | | **560** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 132 |
| Functions | 8 |
| Longest Function | 17 lines |
| Avg LOC/Function | 8.25 |
| Median LOC/Function | 8.00 |
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
| McCabe (Cyclomatic) | 4 | 2.06 | 0 |
| Cognitive (SonarJS) | 3 | 2.22 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 5005878 |
| Context Utilization | 38% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 32 |
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


