# Analysis Report: 2026-09-15_21-20-42_claim-office-example-mapping_exact-sol-v1.5-tcr-parity-domain-trial-cc_opus-5-no-thinking

Generated: 2026-09-15T21:54:54+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-sol-v1.5-tcr-parity-domain-trial-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 2049s |
| Started | 2026-09-15T21:20:42+00:00 |
| Ended | 2026-09-15T21:54:54+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 285
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 371
- **Active tests**: 50
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (50 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-15_21-20-42_claim-office-example-mapping_exact-sol-v1.5-tcr-parity-domain-trial-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-15_21-20-42_claim-office-example-mapping_exact-sol-v1.5-tcr-parity-domain-trial-cc_opus-5-no-thinking

MHPCO does not insure items of type "broomstick"
 ✓ src/claim-office.spec.ts  (50 tests) 1600ms

 Test Files  1 passed (1)
      Tests  50 passed (50)
   Start at  21:54:55
   Duration  1.91s (transform 88ms, setup 0ms, collect 86ms, tests 1.60s, environment 0ms, prepare 65ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 75% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 64 | ×1 | 64 |
| Invocations | 105 | ×2 | 210 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 9 | ×5 | 45 |
| Assignments | 50 | ×6 | 300 |
| **Total Mass** | | | **687** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 235 |
| Functions | 29 |
| Longest Function | 24 lines |
| Avg LOC/Function | 5.66 |
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
| McCabe (Cyclomatic) | 3 | 1.66 | 0 |
| Cognitive (SonarJS) | 3 | 1.73 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 44005407 |
| Context Utilization | 124% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 77 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 46 |
| Predictions Total | 48 |
| Accuracy | 95% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 50 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 27 |


