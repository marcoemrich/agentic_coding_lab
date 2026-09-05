# Analysis Report: 2026-09-05_13-13-49_claim-office-example-mapping_v6.2.1-phase-continuation-pi_gpt-6-astra-codex-no-thinking

Generated: 2026-09-05T14:00:26+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2.1-phase-continuation-pi |
| Model | gpt-6-astra-codex-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 2793s |
| Started | 2026-09-05T13:13:49+00:00 |
| Ended | 2026-09-05T14:00:26+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 49
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 154
- **Active tests**: 40
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (40 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-05_13-13-49_claim-office-example-mapping_v6.2.1-phase-continuation-pi_gpt-6-astra-codex-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-05_13-13-49_claim-office-example-mapping_v6.2.1-phase-continuation-pi_gpt-6-astra-codex-no-thinking

 ✓ src/claim-office.spec.ts  (40 tests) 7777ms

 Test Files  1 passed (1)
      Tests  40 passed (40)
   Start at  14:00:27
   Duration  8.16s (transform 105ms, setup 0ms, collect 84ms, tests 7.78s, environment 0ms, prepare 96ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 0% |
| Branches | 0% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 56 | ×1 | 56 |
| Invocations | 39 | ×2 | 78 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 5 | ×5 | 25 |
| Assignments | 18 | ×6 | 108 |
| **Total Mass** | | | **327** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 47 |
| Functions | 3 |
| Longest Function | 29 lines |
| Avg LOC/Function | 13.33 |
| Median LOC/Function | 8.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 21 |
| Code Quality | 0 |
| **Total** | **21** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 7 | 2.70 | 0 |
| Cognitive (SonarJS) | 6 | 3.17 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 6801289 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 40 |
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
| Refactorings Applied | 23 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


