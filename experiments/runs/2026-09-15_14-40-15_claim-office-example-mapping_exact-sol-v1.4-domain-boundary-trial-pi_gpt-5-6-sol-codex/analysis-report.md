# Analysis Report: 2026-09-15_14-40-15_claim-office-example-mapping_exact-sol-v1.4-domain-boundary-trial-pi_gpt-5-6-sol-codex

Generated: 2026-09-15T14:54:39+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-sol-v1.4-domain-boundary-trial-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 860s |
| Started | 2026-09-15T14:40:16+00:00 |
| Ended | 2026-09-15T14:54:39+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 160
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 146
- **Active tests**: 21
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (21 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-15_14-40-15_claim-office-example-mapping_exact-sol-v1.4-domain-boundary-trial-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-15_14-40-15_claim-office-example-mapping_exact-sol-v1.4-domain-boundary-trial-pi_gpt-5-6-sol-codex

 ✓ src/claim-office.spec.ts  (21 tests) 605ms

 Test Files  1 passed (1)
      Tests  21 passed (21)
   Start at  14:54:40
   Duration  928ms (transform 92ms, setup 0ms, collect 70ms, tests 605ms, environment 0ms, prepare 92ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 64 | ×1 | 64 |
| Invocations | 69 | ×2 | 138 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 10 | ×5 | 50 |
| Assignments | 57 | ×6 | 342 |
| **Total Mass** | | | **650** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 146 |
| Functions | 10 |
| Longest Function | 17 lines |
| Avg LOC/Function | 9.60 |
| Median LOC/Function | 10.50 |
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
| McCabe (Cyclomatic) | 7 | 2.59 | 0 |
| Cognitive (SonarJS) | 7 | 2.42 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2734920 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 21 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 24 |
| Predictions Total | 24 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 21 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


