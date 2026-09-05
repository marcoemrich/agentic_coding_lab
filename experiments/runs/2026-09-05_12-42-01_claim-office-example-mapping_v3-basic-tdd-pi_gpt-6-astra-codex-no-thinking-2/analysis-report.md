# Analysis Report: 2026-09-05_12-42-01_claim-office-example-mapping_v3-basic-tdd-pi_gpt-6-astra-codex-no-thinking-2

Generated: 2026-09-05T12:48:43+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v3-basic-tdd-pi |
| Model | gpt-6-astra-codex-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 392s |
| Started | 2026-09-05T12:42:01+00:00 |
| Ended | 2026-09-05T12:48:43+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, office.ts
- **Implementation LOC** (total): 72
- **Test files**: cli.spec.ts, office.spec.ts
- **Test LOC** (total): 144
- **Active tests**: 25
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (62 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-05_12-42-01_claim-office-example-mapping_v3-basic-tdd-pi_gpt-6-astra-codex-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-05_12-42-01_claim-office-example-mapping_v3-basic-tdd-pi_gpt-6-astra-codex-no-thinking-2

 ✓ src/office.spec.ts  (54 tests) 10ms
 ✓ src/cli.spec.ts  (8 tests) 3401ms

 Test Files  2 passed (2)
      Tests  62 passed (62)
   Start at  12:48:45
   Duration  4.49s (transform 160ms, setup 0ms, collect 172ms, tests 3.41s, environment 0ms, prepare 298ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 83% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 53 | ×1 | 53 |
| Invocations | 40 | ×2 | 80 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 6 | ×5 | 30 |
| Assignments | 24 | ×6 | 144 |
| **Total Mass** | | | **359** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 63 |
| Functions | 3 |
| Longest Function | 21 lines |
| Avg LOC/Function | 13.67 |
| Median LOC/Function | 16.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 15 |
| Code Quality | 0 |
| **Total** | **15** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 7 | 3.00 | 0 |
| Cognitive (SonarJS) | 9 | 5.75 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 576526 |
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


