# Analysis Report: 2026-07-25_18-58-58_claim-office-example-mapping_v6.2-with-why-cleaned_opus-4-8-requesty-2

Generated: 2026-07-25T20:00:55+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned |
| Model | opus-4-8-requesty |
| Model Version(s) | claude-opus-4-8 |
| Thinking | true |
| Duration | 3714s |
| Started | 2026-07-25T18:58:58+00:00 |
| Ended | 2026-07-25T20:00:55+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 244
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 596
- **Active tests**: 39
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (39 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-25_18-58-58_claim-office-example-mapping_v6.2-with-why-cleaned_opus-4-8-requesty-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-25_18-58-58_claim-office-example-mapping_v6.2-with-why-cleaned_opus-4-8-requesty-2

 ✓ src/claim-office.spec.ts  (39 tests) 6ms

 Test Files  1 passed (1)
      Tests  39 passed (39)
   Start at  20:00:56
   Duration  204ms (transform 61ms, setup 0ms, collect 62ms, tests 6ms, environment 0ms, prepare 51ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 51 | ×1 | 51 |
| Invocations | 71 | ×2 | 142 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 5 | ×5 | 25 |
| Assignments | 99 | ×6 | 594 |
| **Total Mass** | | | **852** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 189 |
| Functions | 27 |
| Longest Function | 12 lines |
| Avg LOC/Function | 4.00 |
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
| McCabe (Cyclomatic) | 3 | 1.33 | 0 |
| Cognitive (SonarJS) | 2 | 1.17 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 50495699 |
| Context Utilization | 179% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 39 |
| Avg Cycle Time | 101.58s |
| Avg Red Phase | 21.3s |
| Avg Green Phase | 23.8s |
| Avg Refactor Phase | 56.48s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 45 |
| Predictions Total | 46 |
| Accuracy | 97% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 39 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 16 |


