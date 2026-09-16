# Analysis Report: 2026-09-16_16-24-38_claim-office-example-mapping_exact-sol-v1.5-tcr-parity-domain-trial-cc_opus-5-no-thinking

Generated: 2026-09-16T16:46:22+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-sol-v1.5-tcr-parity-domain-trial-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 1286s |
| Started | 2026-09-16T16:24:39+00:00 |
| Ended | 2026-09-16T16:46:22+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, claims.ts, cli.ts, price-list.ts, quoting.ts
- **Implementation LOC** (total): 252
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 471
- **Active tests**: 51
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (51 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-16_16-24-38_claim-office-example-mapping_exact-sol-v1.5-tcr-parity-domain-trial-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-16_16-24-38_claim-office-example-mapping_exact-sol-v1.5-tcr-parity-domain-trial-cc_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (51 tests) 3640ms

 Test Files  1 passed (1)
      Tests  51 passed (51)
   Start at  16:46:24
   Duration  4.36s (transform 278ms, setup 0ms, collect 228ms, tests 3.64s, environment 0ms, prepare 206ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 71 | ×1 | 71 |
| Invocations | 90 | ×2 | 180 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 11 | ×5 | 55 |
| Assignments | 48 | ×6 | 288 |
| **Total Mass** | | | **650** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 197 |
| Functions | 23 |
| Longest Function | 11 lines |
| Avg LOC/Function | 5.00 |
| Median LOC/Function | 4.00 |
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
| McCabe (Cyclomatic) | 3 | 1.48 | 0 |
| Cognitive (SonarJS) | 2 | 1.33 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 19202735 |
| Context Utilization | 76% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 80 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 102 |
| Predictions Total | 104 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 51 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 30 |


