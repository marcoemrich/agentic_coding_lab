# Analysis Report: 2026-05-30_04-34-58_claim-office-example-mapping_v6.5-end-refactor_opus-4-8-no-thinking

Generated: 2026-05-30T05:27:28+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.5-end-refactor |
| Model | opus-4-8-no-thinking |
| Model Version(s) | claude-opus-4-8 |
| Thinking | unknown |
| Duration | 3149s |
| Started | 2026-05-30T04:34:58+00:00 |
| Ended | 2026-05-30T05:27:28+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 283
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 602
- **Active tests**: 38
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (38 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-30_04-34-58_claim-office-example-mapping_v6.5-end-refactor_opus-4-8-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-30_04-34-58_claim-office-example-mapping_v6.5-end-refactor_opus-4-8-no-thinking

 ✓ src/claim-office.spec.ts  (38 tests) 8ms

 Test Files  1 passed (1)
      Tests  38 passed (38)
   Start at  05:27:29
   Duration  202ms (transform 55ms, setup 1ms, collect 54ms, tests 8ms, environment 0ms, prepare 56ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 60 | ×1 | 60 |
| Invocations | 99 | ×2 | 198 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 13 | ×5 | 65 |
| Assignments | 94 | ×6 | 564 |
| **Total Mass** | | | **935** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 207 |
| Functions | 35 |
| Longest Function | 10 lines |
| Avg LOC/Function | 3.54 |
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
| McCabe (Cyclomatic) | 3 | 1.30 | 0 |
| Cognitive (SonarJS) | 2 | 1.08 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 107756705 |
| Context Utilization | 212% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 38 |
| Avg Cycle Time | 105.38s |
| Avg Red Phase | 23.61s |
| Avg Green Phase | 23.02s |
| Avg Refactor Phase | 58.75s |

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
| Refactorings Applied | 21 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


