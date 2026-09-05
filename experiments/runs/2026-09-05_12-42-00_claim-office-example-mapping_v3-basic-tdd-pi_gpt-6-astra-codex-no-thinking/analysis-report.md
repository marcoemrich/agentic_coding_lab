# Analysis Report: 2026-09-05_12-42-00_claim-office-example-mapping_v3-basic-tdd-pi_gpt-6-astra-codex-no-thinking

Generated: 2026-09-05T12:47:54+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v3-basic-tdd-pi |
| Model | gpt-6-astra-codex-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 344s |
| Started | 2026-09-05T12:42:00+00:00 |
| Ended | 2026-09-05T12:47:54+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, office.ts
- **Implementation LOC** (total): 68
- **Test files**: cli.spec.ts, office.spec.ts
- **Test LOC** (total): 157
- **Active tests**: 27
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (63 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-05_12-42-00_claim-office-example-mapping_v3-basic-tdd-pi_gpt-6-astra-codex-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-05_12-42-00_claim-office-example-mapping_v3-basic-tdd-pi_gpt-6-astra-codex-no-thinking

 ✓ src/office.spec.ts  (53 tests) 32ms
 ✓ src/cli.spec.ts  (10 tests) 4586ms

 Test Files  2 passed (2)
      Tests  63 passed (63)
   Start at  12:47:56
   Duration  5.77s (transform 169ms, setup 1ms, collect 235ms, tests 4.62s, environment 0ms, prepare 342ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 82% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 59 | ×1 | 59 |
| Invocations | 39 | ×2 | 78 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 8 | ×5 | 40 |
| Assignments | 26 | ×6 | 156 |
| **Total Mass** | | | **389** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 63 |
| Functions | 1 |
| Longest Function | 42 lines |
| Avg LOC/Function | 42.00 |
| Median LOC/Function | 42.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 2 |
| Duplication | 0 |
| Magic Numbers | 13 |
| Code Quality | 0 |
| **Total** | **15** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 8 | 2.89 | 0 |
| Cognitive (SonarJS) | 9 | 4.75 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 508183 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 7 |
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
| Refactorings Applied | 1 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


