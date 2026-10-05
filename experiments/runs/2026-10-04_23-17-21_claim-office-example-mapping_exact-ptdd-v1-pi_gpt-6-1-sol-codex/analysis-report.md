# Analysis Report: 2026-10-04_23-17-21_claim-office-example-mapping_exact-ptdd-v1-pi_gpt-6-1-sol-codex

Generated: 2026-10-04T23:55:23+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-pi |
| Model | gpt-6-1-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 2278s |
| Started | 2026-10-04T23:17:22+00:00 |
| Ended | 2026-10-04T23:55:23+00:00 |

## Code Metrics

- **Implementation files**: claims.ts, cli.ts, policy.ts, premium.ts, scenario.ts
- **Implementation LOC** (total): 141
- **Test files**: office.spec.ts
- **Test LOC** (total): 102
- **Active tests**: 50
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (50 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-04_23-17-21_claim-office-example-mapping_exact-ptdd-v1-pi_gpt-6-1-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-04_23-17-21_claim-office-example-mapping_exact-ptdd-v1-pi_gpt-6-1-sol-codex

 ✓ src/office.spec.ts  (50 tests) 8401ms

 Test Files  1 passed (1)
      Tests  50 passed (50)
   Start at  23:55:24
   Duration  8.69s (transform 51ms, setup 0ms, collect 39ms, tests 8.40s, environment 0ms, prepare 87ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 0% |
| Branches | 0% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 70 | ×1 | 70 |
| Invocations | 70 | ×2 | 140 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 8 | ×5 | 40 |
| Assignments | 47 | ×6 | 282 |
| **Total Mass** | | | **580** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 119 |
| Functions | 18 |
| Longest Function | 11 lines |
| Avg LOC/Function | 4.44 |
| Median LOC/Function | 3.50 |
| Imports | 9 |

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
| McCabe (Cyclomatic) | 3 | 1.52 | 0 |
| Cognitive (SonarJS) | 2 | 1.18 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 11650509 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 50 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 97 |
| Predictions Total | 100 |
| Accuracy | 97% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 50 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


