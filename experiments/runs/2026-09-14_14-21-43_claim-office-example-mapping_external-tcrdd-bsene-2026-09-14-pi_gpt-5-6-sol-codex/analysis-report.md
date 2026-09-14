# Analysis Report: 2026-09-14_14-21-43_claim-office-example-mapping_external-tcrdd-bsene-2026-09-14-pi_gpt-5-6-sol-codex

Generated: 2026-09-14T15:57:20+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | external-tcrdd-bsene-2026-09-14-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 947s |
| Started | 2026-09-14T14:21:44+00:00 |
| Ended | 2026-09-14T14:37:35+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 120
- **Test files**: claim-office.spec.ts, cli.spec.ts
- **Test LOC** (total): 292
- **Active tests**: 25
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (30 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-14_14-21-43_claim-office-example-mapping_external-tcrdd-bsene-2026-09-14-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-14_14-21-43_claim-office-example-mapping_external-tcrdd-bsene-2026-09-14-pi_gpt-5-6-sol-codex

 ✓ src/claim-office.spec.ts  (28 tests) 10ms
 ✓ src/cli.spec.ts  (2 tests) 1266ms

 Test Files  2 passed (2)
      Tests  30 passed (30)
   Start at  15:57:22
   Duration  1.63s (transform 92ms, setup 0ms, collect 119ms, tests 1.28s, environment 0ms, prepare 201ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 56 | ×1 | 56 |
| Invocations | 45 | ×2 | 90 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 8 | ×5 | 40 |
| Assignments | 45 | ×6 | 270 |
| **Total Mass** | | | **508** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 110 |
| Functions | 4 |
| Longest Function | 19 lines |
| Avg LOC/Function | 11.50 |
| Median LOC/Function | 12.50 |
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
| McCabe (Cyclomatic) | 7 | 2.08 | 0 |
| Cognitive (SonarJS) | 7 | 4.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2832331 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 18 |
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
| Refactorings Applied | 2 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


