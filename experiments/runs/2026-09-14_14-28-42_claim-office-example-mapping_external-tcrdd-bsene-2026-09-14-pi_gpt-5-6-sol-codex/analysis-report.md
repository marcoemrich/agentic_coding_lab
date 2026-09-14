# Analysis Report: 2026-09-14_14-28-42_claim-office-example-mapping_external-tcrdd-bsene-2026-09-14-pi_gpt-5-6-sol-codex

Generated: 2026-09-14T15:58:24+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | external-tcrdd-bsene-2026-09-14-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 698s |
| Started | 2026-09-14T14:28:43+00:00 |
| Ended | 2026-09-14T14:40:24+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, office.ts
- **Implementation LOC** (total): 126
- **Test files**: cli.spec.ts, office.spec.ts
- **Test LOC** (total): 219
- **Active tests**: 18
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (18 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-14_14-28-42_claim-office-example-mapping_external-tcrdd-bsene-2026-09-14-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-14_14-28-42_claim-office-example-mapping_external-tcrdd-bsene-2026-09-14-pi_gpt-5-6-sol-codex

 ✓ src/office.spec.ts  (15 tests) 8ms
 ✓ src/cli.spec.ts  (3 tests) 1377ms

 Test Files  2 passed (2)
      Tests  18 passed (18)
   Start at  15:58:25
   Duration  1.75s (transform 106ms, setup 0ms, collect 114ms, tests 1.39s, environment 0ms, prepare 217ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 58 | ×1 | 58 |
| Invocations | 35 | ×2 | 70 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 5 | ×5 | 25 |
| Assignments | 43 | ×6 | 258 |
| **Total Mass** | | | **475** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 115 |
| Functions | 4 |
| Longest Function | 22 lines |
| Avg LOC/Function | 12.75 |
| Median LOC/Function | 13.50 |
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
| McCabe (Cyclomatic) | 5 | 2.60 | 0 |
| Cognitive (SonarJS) | 7 | 3.80 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2460161 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 19 |
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
| Refactorings Applied | 3 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


