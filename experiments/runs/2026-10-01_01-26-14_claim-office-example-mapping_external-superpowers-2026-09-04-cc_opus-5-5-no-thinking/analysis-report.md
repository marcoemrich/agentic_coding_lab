# Analysis Report: 2026-10-01_01-26-14_claim-office-example-mapping_external-superpowers-2026-09-04-cc_opus-5-5-no-thinking

Generated: 2026-10-01T01:31:41+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | external-superpowers-2026-09-04-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5 |
| Thinking | unknown |
| Duration | 323s |
| Started | 2026-10-01T01:26:15+00:00 |
| Ended | 2026-10-01T01:31:41+00:00 |

## Code Metrics

- **Implementation files**: claimOffice.ts, cli.ts
- **Implementation LOC** (total): 160
- **Test files**: claimOffice.spec.ts, cli.spec.ts
- **Test LOC** (total): 267
- **Active tests**: 28
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (43 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-01_01-26-14_claim-office-example-mapping_external-superpowers-2026-09-04-cc_opus-5-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-01_01-26-14_claim-office-example-mapping_external-superpowers-2026-09-04-cc_opus-5-5-no-thinking

 ✓ src/claimOffice.spec.ts  (41 tests) 10ms
 ✓ src/cli.spec.ts  (2 tests) 1033ms

 Test Files  2 passed (2)
      Tests  43 passed (43)
   Start at  01:31:42
   Duration  1.61s (transform 96ms, setup 0ms, collect 105ms, tests 1.04s, environment 0ms, prepare 163ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 51 | ×1 | 51 |
| Invocations | 69 | ×2 | 138 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 8 | ×5 | 40 |
| Assignments | 61 | ×6 | 366 |
| **Total Mass** | | | **655** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 129 |
| Functions | 12 |
| Longest Function | 16 lines |
| Avg LOC/Function | 6.83 |
| Median LOC/Function | 5.50 |
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
| McCabe (Cyclomatic) | 5 | 2.00 | 0 |
| Cognitive (SonarJS) | 5 | 2.22 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 6617226 |
| Context Utilization | 42% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 42 |
| Avg Cycle Time | 0.80s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0.34s |
| Avg Refactor Phase | 0.46s |

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
| Refactorings Applied | 2 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


