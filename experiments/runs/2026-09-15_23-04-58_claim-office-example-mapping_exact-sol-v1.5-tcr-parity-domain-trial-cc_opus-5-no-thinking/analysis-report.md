# Analysis Report: 2026-09-15_23-04-58_claim-office-example-mapping_exact-sol-v1.5-tcr-parity-domain-trial-cc_opus-5-no-thinking

Generated: 2026-09-15T23:25:09+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-sol-v1.5-tcr-parity-domain-trial-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 1208s |
| Started | 2026-09-15T23:04:58+00:00 |
| Ended | 2026-09-15T23:25:09+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 309
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 718
- **Active tests**: 54
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (54 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-15_23-04-58_claim-office-example-mapping_exact-sol-v1.5-tcr-parity-domain-trial-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-15_23-04-58_claim-office-example-mapping_exact-sol-v1.5-tcr-parity-domain-trial-cc_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (54 tests) 2001ms

 Test Files  1 passed (1)
      Tests  54 passed (54)
   Start at  23:25:10
   Duration  2.31s (transform 90ms, setup 0ms, collect 86ms, tests 2.00s, environment 0ms, prepare 68ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 66 | ×1 | 66 |
| Invocations | 103 | ×2 | 206 |
| Conditionals | 18 | ×4 | 72 |
| Loops | 11 | ×5 | 55 |
| Assignments | 48 | ×6 | 288 |
| **Total Mass** | | | **687** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 247 |
| Functions | 29 |
| Longest Function | 21 lines |
| Avg LOC/Function | 5.45 |
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
| McCabe (Cyclomatic) | 3 | 1.63 | 0 |
| Cognitive (SonarJS) | 3 | 1.56 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 18708389 |
| Context Utilization | 68% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 54 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 106 |
| Predictions Total | 108 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 54 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


