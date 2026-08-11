# Analysis Report: 2026-08-10_18-13-18_claim-office-example-mapping_v6.6-lab-split-cc_opus-5-no-thinking

Generated: 2026-08-10T19:38:48+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.6-lab-split-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 5129s |
| Started | 2026-08-10T18:13:18+00:00 |
| Ended | 2026-08-10T19:38:48+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 542
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 824
- **Active tests**: 39
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (39 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_18-13-18_claim-office-example-mapping_v6.6-lab-split-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_18-13-18_claim-office-example-mapping_v6.6-lab-split-cc_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (39 tests) 208ms

 Test Files  1 passed (1)
      Tests  39 passed (39)
   Start at  19:38:48
   Duration  383ms (transform 45ms, setup 0ms, collect 47ms, tests 208ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 75 | ×1 | 75 |
| Invocations | 88 | ×2 | 176 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 20 | ×5 | 100 |
| Assignments | 96 | ×6 | 576 |
| **Total Mass** | | | **979** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 448 |
| Functions | 37 |
| Longest Function | 17 lines |
| Avg LOC/Function | 3.19 |
| Median LOC/Function | 2.00 |
| Imports | 2 |

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
| Cognitive (SonarJS) | 3 | 1.29 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 137661870 |
| Context Utilization | 237% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 36 |
| Avg Cycle Time | 132.83s |
| Avg Red Phase | 28.04s |
| Avg Green Phase | 29.52s |
| Avg Refactor Phase | 75.27s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 70 |
| Predictions Total | 72 |
| Accuracy | 97% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 36 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


