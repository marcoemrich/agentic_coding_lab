# Analysis Report: 2026-09-24_04-57-11_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-pi_gpt-6-sol-codex

Generated: 2026-09-24T05:04:43+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1.1-refactor-subagent-pi |
| Model | gpt-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 447s |
| Started | 2026-09-24T04:57:12+00:00 |
| Ended | 2026-09-24T05:04:43+00:00 |

## Code Metrics

- **Implementation files**: catalogue.ts, claim.ts, cli.ts, premium.ts
- **Implementation LOC** (total): 120
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 86
- **Active tests**: 47
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (47 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-24_04-57-11_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-pi_gpt-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-24_04-57-11_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-pi_gpt-6-sol-codex

 ✓ src/claim-office.spec.ts  (47 tests) 4586ms

 Test Files  1 passed (1)
      Tests  47 passed (47)
   Start at  05:04:44
   Duration  4.91s (transform 59ms, setup 0ms, collect 52ms, tests 4.59s, environment 0ms, prepare 86ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 0% |
| Branches | 0% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 69 | ×1 | 69 |
| Invocations | 58 | ×2 | 116 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 7 | ×5 | 35 |
| Assignments | 44 | ×6 | 264 |
| **Total Mass** | | | **540** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 106 |
| Functions | 9 |
| Longest Function | 18 lines |
| Avg LOC/Function | 7.22 |
| Median LOC/Function | 5.00 |
| Imports | 6 |

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
| McCabe (Cyclomatic) | 5 | 2.38 | 0 |
| Cognitive (SonarJS) | 8 | 3.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 871311 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 2 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 4 |
| Predictions Total | 4 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 2 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


