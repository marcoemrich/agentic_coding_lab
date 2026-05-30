# Analysis Report: 2026-05-30_03-12-24_claim-office-example-mapping_v6.4-metric-driven-refactor_opus-4-8-no-thinking

Generated: 2026-05-30T03:47:55+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.4-metric-driven-refactor |
| Model | opus-4-8-no-thinking |
| Model Version(s) | claude-opus-4-8 |
| Thinking | unknown |
| Duration | 2130s |
| Started | 2026-05-30T03:12:24+00:00 |
| Ended | 2026-05-30T03:47:55+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 267
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 550
- **Active tests**: 34
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (34 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-30_03-12-24_claim-office-example-mapping_v6.4-metric-driven-refactor_opus-4-8-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-30_03-12-24_claim-office-example-mapping_v6.4-metric-driven-refactor_opus-4-8-no-thinking

 ✓ src/claim-office.spec.ts  (34 tests) 8ms

 Test Files  1 passed (1)
      Tests  34 passed (34)
   Start at  03:47:55
   Duration  186ms (transform 41ms, setup 0ms, collect 52ms, tests 8ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 69 | ×1 | 69 |
| Invocations | 87 | ×2 | 174 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 13 | ×5 | 65 |
| Assignments | 86 | ×6 | 516 |
| **Total Mass** | | | **876** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 222 |
| Functions | 30 |
| Longest Function | 13 lines |
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
| McCabe (Cyclomatic) | 4 | 1.49 | 0 |
| Cognitive (SonarJS) | 4 | 1.56 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 53220050 |
| Context Utilization | 146% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 34 |
| Avg Cycle Time | 111.58s |
| Avg Red Phase | 24.16s |
| Avg Green Phase | 27.16s |
| Avg Refactor Phase | 60.26s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 67 |
| Predictions Total | 68 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 14 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 19 |


