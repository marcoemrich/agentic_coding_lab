# Analysis Report: 2026-09-05_13-14-15_claim-office-example-mapping_v6.2.1-phase-continuation-pi_gpt-6-astra-codex-no-thinking

Generated: 2026-09-05T13:53:46+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2.1-phase-continuation-pi |
| Model | gpt-6-astra-codex-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 2368s |
| Started | 2026-09-05T13:14:15+00:00 |
| Ended | 2026-09-05T13:53:46+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 65
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 225
- **Active tests**: 41
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (41 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-05_13-14-15_claim-office-example-mapping_v6.2.1-phase-continuation-pi_gpt-6-astra-codex-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-05_13-14-15_claim-office-example-mapping_v6.2.1-phase-continuation-pi_gpt-6-astra-codex-no-thinking

 ✓ src/claim-office.spec.ts  (41 tests) 1007ms

 Test Files  1 passed (1)
      Tests  41 passed (41)
   Start at  13:53:47
   Duration  1.31s (transform 80ms, setup 0ms, collect 71ms, tests 1.01s, environment 0ms, prepare 68ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 86% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 57 | ×1 | 57 |
| Invocations | 31 | ×2 | 62 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 6 | ×5 | 30 |
| Assignments | 27 | ×6 | 162 |
| **Total Mass** | | | **359** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 59 |
| Functions | 2 |
| Longest Function | 24 lines |
| Avg LOC/Function | 18.00 |
| Median LOC/Function | 18.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 9 |
| Code Quality | 0 |
| **Total** | **9** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 7 | 2.67 | 0 |
| Cognitive (SonarJS) | 5 | 2.80 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 7355822 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 41 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 48 |
| Predictions Total | 48 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 24 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


