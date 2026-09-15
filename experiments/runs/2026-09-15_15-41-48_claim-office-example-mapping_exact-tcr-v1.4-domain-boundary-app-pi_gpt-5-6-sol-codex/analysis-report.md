# Analysis Report: 2026-09-15_15-41-48_claim-office-example-mapping_exact-tcr-v1.4-domain-boundary-app-pi_gpt-5-6-sol-codex

Generated: 2026-09-15T16:04:19+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-tcr-v1.4-domain-boundary-app-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1347s |
| Started | 2026-09-15T15:41:49+00:00 |
| Ended | 2026-09-15T16:04:19+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, office.ts
- **Implementation LOC** (total): 180
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 258
- **Active tests**: 34
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (34 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-15_15-41-48_claim-office-example-mapping_exact-tcr-v1.4-domain-boundary-app-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-15_15-41-48_claim-office-example-mapping_exact-tcr-v1.4-domain-boundary-app-pi_gpt-5-6-sol-codex

 ✓ src/claim-office.spec.ts  (34 tests) 3375ms

 Test Files  1 passed (1)
      Tests  34 passed (34)
   Start at  16:04:20
   Duration  3.68s (transform 75ms, setup 0ms, collect 71ms, tests 3.38s, environment 0ms, prepare 90ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 87% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 53 | ×1 | 53 |
| Invocations | 72 | ×2 | 144 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 6 | ×5 | 30 |
| Assignments | 54 | ×6 | 324 |
| **Total Mass** | | | **595** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 157 |
| Functions | 17 |
| Longest Function | 14 lines |
| Avg LOC/Function | 5.35 |
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
| McCabe (Cyclomatic) | 4 | 1.33 | 0 |
| Cognitive (SonarJS) | 2 | 1.11 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 5430837 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 34 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 68 |
| Predictions Total | 68 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 34 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


