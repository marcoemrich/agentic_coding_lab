# Analysis Report: 2026-09-15_10-23-14_claim-office-example-mapping_exact-tcr-v1.2-domain-responsibility-pi_gpt-5-6-sol-codex

Generated: 2026-09-15T10:41:46+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-tcr-v1.2-domain-responsibility-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1106s |
| Started | 2026-09-15T10:23:16+00:00 |
| Ended | 2026-09-15T10:41:45+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 146
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 236
- **Active tests**: 36
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (36 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-15_10-23-14_claim-office-example-mapping_exact-tcr-v1.2-domain-responsibility-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-15_10-23-14_claim-office-example-mapping_exact-tcr-v1.2-domain-responsibility-pi_gpt-5-6-sol-codex

 ✓ src/claim-office.spec.ts  (36 tests) 551ms

 Test Files  1 passed (1)
      Tests  36 passed (36)
   Start at  10:41:47
   Duration  842ms (transform 63ms, setup 0ms, collect 64ms, tests 551ms, environment 0ms, prepare 75ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 90% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 61 | ×1 | 61 |
| Invocations | 55 | ×2 | 110 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 6 | ×5 | 30 |
| Assignments | 51 | ×6 | 306 |
| **Total Mass** | | | **547** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 132 |
| Functions | 9 |
| Longest Function | 16 lines |
| Avg LOC/Function | 7.44 |
| Median LOC/Function | 7.00 |
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
| McCabe (Cyclomatic) | 3 | 1.42 | 0 |
| Cognitive (SonarJS) | 2 | 1.43 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 6114129 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 36 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 72 |
| Predictions Total | 72 |
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


