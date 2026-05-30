# Analysis Report: 2026-05-29_19-33-19_claim-office-example-mapping_v6.2-with-why-cleaned_opus-4-8-no-thinking

Generated: 2026-05-29T20:38:40+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned |
| Model | opus-4-8-no-thinking |
| Model Version(s) | claude-opus-4-8 |
| Thinking | unknown |
| Duration | 3919s |
| Started | 2026-05-29T19:33:19+00:00 |
| Ended | 2026-05-29T20:38:40+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 392
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 406
- **Active tests**: 39
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (39 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-29_19-33-19_claim-office-example-mapping_v6.2-with-why-cleaned_opus-4-8-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-29_19-33-19_claim-office-example-mapping_v6.2-with-why-cleaned_opus-4-8-no-thinking

 ✓ src/claim-office.spec.ts  (39 tests) 6ms

 Test Files  1 passed (1)
      Tests  39 passed (39)
   Start at  20:38:41
   Duration  175ms (transform 39ms, setup 0ms, collect 38ms, tests 6ms, environment 0ms, prepare 44ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 75% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 62 | ×1 | 62 |
| Invocations | 108 | ×2 | 216 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 8 | ×5 | 40 |
| Assignments | 97 | ×6 | 582 |
| **Total Mass** | | | **964** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 267 |
| Functions | 37 |
| Longest Function | 28 lines |
| Avg LOC/Function | 3.35 |
| Median LOC/Function | 2.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 1 |
| Code Quality | 0 |
| **Total** | **1** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 4 | 1.45 | 0 |
| Cognitive (SonarJS) | 4 | 1.29 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 99670521 |
| Context Utilization | 199% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 39 |
| Avg Cycle Time | 111.69s |
| Avg Red Phase | 21.81s |
| Avg Green Phase | 27.78s |
| Avg Refactor Phase | 62.1s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 77 |
| Predictions Total | 77 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 39 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 18 |


