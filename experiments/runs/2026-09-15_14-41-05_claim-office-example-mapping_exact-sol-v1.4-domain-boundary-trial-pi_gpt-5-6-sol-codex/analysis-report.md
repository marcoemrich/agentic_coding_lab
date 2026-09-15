# Analysis Report: 2026-09-15_14-41-05_claim-office-example-mapping_exact-sol-v1.4-domain-boundary-trial-pi_gpt-5-6-sol-codex

Generated: 2026-09-15T14:59:23+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-sol-v1.4-domain-boundary-trial-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1094s |
| Started | 2026-09-15T14:41:06+00:00 |
| Ended | 2026-09-15T14:59:23+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli-adapter.ts, cli.ts
- **Implementation LOC** (total): 183
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 194
- **Active tests**: 26
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (26 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-15_14-41-05_claim-office-example-mapping_exact-sol-v1.4-domain-boundary-trial-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-15_14-41-05_claim-office-example-mapping_exact-sol-v1.4-domain-boundary-trial-pi_gpt-5-6-sol-codex

 ✓ src/claim-office.spec.ts  (26 tests) 9ms

 Test Files  1 passed (1)
      Tests  26 passed (26)
   Start at  14:59:24
   Duration  299ms (transform 81ms, setup 0ms, collect 79ms, tests 9ms, environment 0ms, prepare 70ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 84% |
| Branches | 86% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 73 | ×1 | 73 |
| Invocations | 65 | ×2 | 130 |
| Conditionals | 18 | ×4 | 72 |
| Loops | 5 | ×5 | 25 |
| Assignments | 53 | ×6 | 318 |
| **Total Mass** | | | **618** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 163 |
| Functions | 12 |
| Longest Function | 20 lines |
| Avg LOC/Function | 6.33 |
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
| McCabe (Cyclomatic) | 5 | 2.10 | 0 |
| Cognitive (SonarJS) | 3 | 1.82 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 5712164 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 26 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 27 |
| Predictions Total | 28 |
| Accuracy | 96% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 26 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


