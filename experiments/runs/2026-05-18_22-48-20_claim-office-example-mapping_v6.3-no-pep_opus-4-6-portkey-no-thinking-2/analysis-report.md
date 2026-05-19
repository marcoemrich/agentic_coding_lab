# Analysis Report: 2026-05-18_22-48-20_claim-office-example-mapping_v6.3-no-pep_opus-4-6-portkey-no-thinking-2

Generated: 2026-05-18T23:42:09+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.3-no-pep |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 3226s |
| Started | 2026-05-18T22:48:21+00:00 |
| Ended | 2026-05-18T23:42:09+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 226
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 429
- **Active tests**: 38
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (38 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-18_22-48-20_claim-office-example-mapping_v6.3-no-pep_opus-4-6-portkey-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-18_22-48-20_claim-office-example-mapping_v6.3-no-pep_opus-4-6-portkey-no-thinking-2

 ✓ src/claim-office.spec.ts  (38 tests) 760ms

 Test Files  1 passed (1)
      Tests  38 passed (38)
   Start at  23:42:10
   Duration  947ms (transform 41ms, setup 0ms, collect 39ms, tests 760ms, environment 0ms, prepare 54ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 73% |
| Branches | 90% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 65 | ×1 | 65 |
| Invocations | 58 | ×2 | 116 |
| Conditionals | 9 | ×4 | 36 |
| Loops | 9 | ×5 | 45 |
| Assignments | 77 | ×6 | 462 |
| **Total Mass** | | | **724** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 192 |
| Functions | 19 |
| Longest Function | 9 lines |
| Avg LOC/Function | 3.68 |
| Median LOC/Function | 2.00 |
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
| McCabe (Cyclomatic) | 6 | 1.69 | 0 |
| Cognitive (SonarJS) | 7 | 1.92 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 51329845 |
| Context Utilization | 83% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 38 |
| Avg Cycle Time | 162.43s |
| Avg Red Phase | 28.56s |
| Avg Green Phase | 28.09s |
| Avg Refactor Phase | 105.78s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 76 |
| Predictions Total | 76 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 13 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 14 |


