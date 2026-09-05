# Analysis Report: 2026-09-05_12-42-00_claim-office-example-mapping_v3-basic-tdd-pi_gpt-6-astra-codex-no-thinking-2

Generated: 2026-09-05T12:48:25+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v3-basic-tdd-pi |
| Model | gpt-6-astra-codex-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 375s |
| Started | 2026-09-05T12:42:00+00:00 |
| Ended | 2026-09-05T12:48:25+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, office.ts
- **Implementation LOC** (total): 59
- **Test files**: cli.spec.ts, office.spec.ts
- **Test LOC** (total): 117
- **Active tests**: 31
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (65 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-05_12-42-00_claim-office-example-mapping_v3-basic-tdd-pi_gpt-6-astra-codex-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-05_12-42-00_claim-office-example-mapping_v3-basic-tdd-pi_gpt-6-astra-codex-no-thinking-2

 ✓ src/office.spec.ts  (58 tests) 15ms
 ✓ src/cli.spec.ts  (7 tests) 2273ms

 Test Files  2 passed (2)
      Tests  65 passed (65)
   Start at  12:48:27
   Duration  3.26s (transform 118ms, setup 0ms, collect 161ms, tests 2.29s, environment 0ms, prepare 298ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 79% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 57 | ×1 | 57 |
| Invocations | 36 | ×2 | 72 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 7 | ×5 | 35 |
| Assignments | 25 | ×6 | 150 |
| **Total Mass** | | | **358** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 53 |
| Functions | 1 |
| Longest Function | 38 lines |
| Avg LOC/Function | 38.00 |
| Median LOC/Function | 38.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 2 |
| Duplication | 0 |
| Magic Numbers | 15 |
| Code Quality | 0 |
| **Total** | **17** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 7 | 2.89 | 0 |
| Cognitive (SonarJS) | 8 | 4.75 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 587999 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 8 |
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


