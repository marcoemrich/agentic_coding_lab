# Analysis Report: 2026-09-05_13-14-21_claim-office-example-mapping_v6.2.1-phase-continuation-pi_gpt-6-astra-codex-no-thinking

Generated: 2026-09-05T14:00:10+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2.1-phase-continuation-pi |
| Model | gpt-6-astra-codex-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 2747s |
| Started | 2026-09-05T13:14:21+00:00 |
| Ended | 2026-09-05T14:00:10+00:00 |

## Code Metrics

- **Implementation files**: cli.ts
- **Implementation LOC** (total): 43
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 163
- **Active tests**: 42
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (42 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-05_13-14-21_claim-office-example-mapping_v6.2.1-phase-continuation-pi_gpt-6-astra-codex-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-05_13-14-21_claim-office-example-mapping_v6.2.1-phase-continuation-pi_gpt-6-astra-codex-no-thinking

 ✓ src/claim-office.spec.ts  (42 tests) 8518ms

 Test Files  1 passed (1)
      Tests  42 passed (42)
   Start at  14:00:11
   Duration  8.86s (transform 75ms, setup 0ms, collect 65ms, tests 8.52s, environment 0ms, prepare 89ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 0% |
| Branches | 0% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 51 | ×1 | 51 |
| Invocations | 26 | ×2 | 52 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 7 | ×5 | 35 |
| Assignments | 22 | ×6 | 132 |
| **Total Mass** | | | **314** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 43 |
| Functions | 1 |
| Longest Function | 2 lines |
| Avg LOC/Function | 2.00 |
| Median LOC/Function | 2.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 15 |
| Code Quality | 0 |
| **Total** | **16** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 7 | 3.00 | 0 |
| Cognitive (SonarJS) | 6 | 3.20 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 6164562 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 42 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 84 |
| Predictions Total | 84 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 23 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


