# Analysis Report: 2026-10-01_01-33-11_claim-office-example-mapping_external-pocock-2026-09-04-cc_opus-5-5-no-thinking

Generated: 2026-10-01T01:37:42+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | external-pocock-2026-09-04-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5 |
| Thinking | unknown |
| Duration | 268s |
| Started | 2026-10-01T01:33:11+00:00 |
| Ended | 2026-10-01T01:37:42+00:00 |

## Code Metrics

- **Implementation files**: claimOffice.ts, cli.ts
- **Implementation LOC** (total): 126
- **Test files**: claimOffice.spec.ts, cli.spec.ts
- **Test LOC** (total): 229
- **Active tests**: 28
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (36 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-01_01-33-11_claim-office-example-mapping_external-pocock-2026-09-04-cc_opus-5-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-01_01-33-11_claim-office-example-mapping_external-pocock-2026-09-04-cc_opus-5-5-no-thinking

 ✓ src/claimOffice.spec.ts  (34 tests) 10ms
 ✓ src/cli.spec.ts  (2 tests) 1020ms

 Test Files  2 passed (2)
      Tests  36 passed (36)
   Start at  01:37:44
   Duration  1.61s (transform 98ms, setup 0ms, collect 77ms, tests 1.03s, environment 0ms, prepare 164ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 57 | ×1 | 57 |
| Invocations | 55 | ×2 | 110 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 7 | ×5 | 35 |
| Assignments | 55 | ×6 | 330 |
| **Total Mass** | | | **584** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 110 |
| Functions | 7 |
| Longest Function | 18 lines |
| Avg LOC/Function | 10.43 |
| Median LOC/Function | 12.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 2 |
| Code Quality | 0 |
| **Total** | **2** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 6 | 2.36 | 0 |
| Cognitive (SonarJS) | 8 | 3.43 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 4669128 |
| Context Utilization | 36% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 31 |
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


