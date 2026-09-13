# Analysis Report: 2026-09-13_17-37-16_claim-office-example-mapping_exact-sol-v1.3-stack-profile-pi_gpt-5-6-sol-codex

Generated: 2026-09-13T17:53:00+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-sol-v1.3-stack-profile-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 939s |
| Started | 2026-09-13T17:37:17+00:00 |
| Ended | 2026-09-13T17:53:00+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 141
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 176
- **Active tests**: 34
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (34 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-13_17-37-16_claim-office-example-mapping_exact-sol-v1.3-stack-profile-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-13_17-37-16_claim-office-example-mapping_exact-sol-v1.3-stack-profile-pi_gpt-5-6-sol-codex

 ✓ src/claim-office.spec.ts  (34 tests) 4146ms

 Test Files  1 passed (1)
      Tests  34 passed (34)
   Start at  17:53:01
   Duration  4.53s (transform 86ms, setup 0ms, collect 89ms, tests 4.15s, environment 0ms, prepare 100ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 82% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 63 | ×1 | 63 |
| Invocations | 53 | ×2 | 106 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 9 | ×5 | 45 |
| Assignments | 51 | ×6 | 306 |
| **Total Mass** | | | **580** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 129 |
| Functions | 7 |
| Longest Function | 19 lines |
| Avg LOC/Function | 9.86 |
| Median LOC/Function | 8.00 |
| Imports | 1 |

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
| McCabe (Cyclomatic) | 5 | 2.47 | 0 |
| Cognitive (SonarJS) | 4 | 2.40 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3284793 |
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
| Predictions Correct | 57 |
| Predictions Total | 57 |
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


