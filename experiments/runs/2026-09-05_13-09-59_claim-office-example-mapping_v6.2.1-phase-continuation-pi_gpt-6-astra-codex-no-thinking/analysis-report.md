# Analysis Report: 2026-09-05_13-09-59_claim-office-example-mapping_v6.2.1-phase-continuation-pi_gpt-6-astra-codex-no-thinking

Generated: 2026-09-05T13:53:52+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2.1-phase-continuation-pi |
| Model | gpt-6-astra-codex-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 2630s |
| Started | 2026-09-05T13:09:59+00:00 |
| Ended | 2026-09-05T13:53:52+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 88
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 203
- **Active tests**: 45
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (45 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-05_13-09-59_claim-office-example-mapping_v6.2.1-phase-continuation-pi_gpt-6-astra-codex-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-05_13-09-59_claim-office-example-mapping_v6.2.1-phase-continuation-pi_gpt-6-astra-codex-no-thinking

 ✓ src/claim-office.spec.ts  (45 tests) 1311ms

 Test Files  1 passed (1)
      Tests  45 passed (45)
   Start at  13:53:54
   Duration  1.78s (transform 133ms, setup 0ms, collect 120ms, tests 1.31s, environment 0ms, prepare 107ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 94% |
| Branches | 87% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 62 | ×1 | 62 |
| Invocations | 40 | ×2 | 80 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 5 | ×5 | 25 |
| Assignments | 28 | ×6 | 168 |
| **Total Mass** | | | **387** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 79 |
| Functions | 6 |
| Longest Function | 18 lines |
| Avg LOC/Function | 9.33 |
| Median LOC/Function | 9.50 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 19 |
| Code Quality | 0 |
| **Total** | **19** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 5 | 2.00 | 0 |
| Cognitive (SonarJS) | 4 | 1.71 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 8316040 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 45 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 90 |
| Predictions Total | 90 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 26 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


