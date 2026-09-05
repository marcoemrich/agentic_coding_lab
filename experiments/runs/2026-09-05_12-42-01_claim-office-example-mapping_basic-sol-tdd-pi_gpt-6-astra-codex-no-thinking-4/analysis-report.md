# Analysis Report: 2026-09-05_12-42-01_claim-office-example-mapping_basic-sol-tdd-pi_gpt-6-astra-codex-no-thinking-4

Generated: 2026-09-05T13:13:26+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | basic-sol-tdd-pi |
| Model | gpt-6-astra-codex-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1876s |
| Started | 2026-09-05T12:42:01+00:00 |
| Ended | 2026-09-05T13:13:26+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, office.ts
- **Implementation LOC** (total): 79
- **Test files**: office.spec.ts
- **Test LOC** (total): 145
- **Active tests**: 39
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (39 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-05_12-42-01_claim-office-example-mapping_basic-sol-tdd-pi_gpt-6-astra-codex-no-thinking-4
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-05_12-42-01_claim-office-example-mapping_basic-sol-tdd-pi_gpt-6-astra-codex-no-thinking-4

 ✓ src/office.spec.ts  (39 tests) 12762ms

 Test Files  1 passed (1)
      Tests  39 passed (39)
   Start at  13:13:28
   Duration  13.28s (transform 106ms, setup 0ms, collect 75ms, tests 12.76s, environment 0ms, prepare 173ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 0% |
| Branches | 0% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 57 | ×1 | 57 |
| Invocations | 46 | ×2 | 92 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 5 | ×5 | 25 |
| Assignments | 36 | ×6 | 216 |
| **Total Mass** | | | **434** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 78 |
| Functions | 8 |
| Longest Function | 11 lines |
| Avg LOC/Function | 5.50 |
| Median LOC/Function | 5.00 |
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
| McCabe (Cyclomatic) | 4 | 1.93 | 0 |
| Cognitive (SonarJS) | 3 | 2.17 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 7145587 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 39 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 46 |
| Predictions Total | 46 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 39 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


