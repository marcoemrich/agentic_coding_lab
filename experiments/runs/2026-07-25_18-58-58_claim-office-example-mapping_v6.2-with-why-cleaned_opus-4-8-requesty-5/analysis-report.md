# Analysis Report: 2026-07-25_18-58-58_claim-office-example-mapping_v6.2-with-why-cleaned_opus-4-8-requesty-5

Generated: 2026-07-25T19:44:58+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned |
| Model | opus-4-8-requesty |
| Model Version(s) | claude-opus-4-8 |
| Thinking | true |
| Duration | 2757s |
| Started | 2026-07-25T18:58:58+00:00 |
| Ended | 2026-07-25T19:44:58+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 287
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 613
- **Active tests**: 35
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (35 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-25_18-58-58_claim-office-example-mapping_v6.2-with-why-cleaned_opus-4-8-requesty-5
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-25_18-58-58_claim-office-example-mapping_v6.2-with-why-cleaned_opus-4-8-requesty-5

 ✓ src/claim-office.spec.ts  (35 tests) 7ms

 Test Files  1 passed (1)
      Tests  35 passed (35)
   Start at  19:44:59
   Duration  206ms (transform 53ms, setup 0ms, collect 53ms, tests 7ms, environment 0ms, prepare 46ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 51 | ×1 | 51 |
| Invocations | 87 | ×2 | 174 |
| Conditionals | 8 | ×4 | 32 |
| Loops | 15 | ×5 | 75 |
| Assignments | 94 | ×6 | 564 |
| **Total Mass** | | | **896** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 226 |
| Functions | 27 |
| Longest Function | 10 lines |
| Avg LOC/Function | 4.15 |
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
| McCabe (Cyclomatic) | 4 | 1.38 | 0 |
| Cognitive (SonarJS) | 4 | 1.73 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 49525127 |
| Context Utilization | 182% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 35 |
| Avg Cycle Time | 105.34s |
| Avg Red Phase | 22.8s |
| Avg Green Phase | 23.02s |
| Avg Refactor Phase | 59.52s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 70 |
| Predictions Total | 70 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 18 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


