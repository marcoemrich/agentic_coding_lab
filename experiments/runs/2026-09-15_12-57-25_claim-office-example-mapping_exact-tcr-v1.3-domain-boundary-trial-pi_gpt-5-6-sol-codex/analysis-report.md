# Analysis Report: 2026-09-15_12-57-25_claim-office-example-mapping_exact-tcr-v1.3-domain-boundary-trial-pi_gpt-5-6-sol-codex

Generated: 2026-09-15T13:28:53+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-tcr-v1.3-domain-boundary-trial-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1884s |
| Started | 2026-09-15T12:57:26+00:00 |
| Ended | 2026-09-15T13:28:53+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts, premium.ts
- **Implementation LOC** (total): 162
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 247
- **Active tests**: 40
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (40 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-15_12-57-25_claim-office-example-mapping_exact-tcr-v1.3-domain-boundary-trial-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-15_12-57-25_claim-office-example-mapping_exact-tcr-v1.3-domain-boundary-trial-pi_gpt-5-6-sol-codex

 ✓ src/claim-office.spec.ts  (40 tests) 6681ms

 Test Files  1 passed (1)
      Tests  40 passed (40)
   Start at  13:28:54
   Duration  6.93s (transform 44ms, setup 0ms, collect 45ms, tests 6.68s, environment 0ms, prepare 69ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 0% |
| Branches | 0% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 50 | ×1 | 50 |
| Invocations | 73 | ×2 | 146 |
| Conditionals | 8 | ×4 | 32 |
| Loops | 11 | ×5 | 55 |
| Assignments | 43 | ×6 | 258 |
| **Total Mass** | | | **541** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 141 |
| Functions | 15 |
| Longest Function | 13 lines |
| Avg LOC/Function | 5.67 |
| Median LOC/Function | 5.00 |
| Imports | 3 |

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
| McCabe (Cyclomatic) | 3 | 1.45 | 0 |
| Cognitive (SonarJS) | 3 | 1.67 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 9830011 |
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
| Predictions Correct | 80 |
| Predictions Total | 80 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 40 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


