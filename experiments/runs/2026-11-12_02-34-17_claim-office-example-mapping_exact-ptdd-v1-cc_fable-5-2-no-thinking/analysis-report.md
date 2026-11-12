# Analysis Report: 2026-11-12_02-34-17_claim-office-example-mapping_exact-ptdd-v1-cc_fable-5-2-no-thinking

Generated: 2026-11-12T03:10:04+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-cc |
| Model | fable-5-2-no-thinking |
| Model Version(s) | claude-fable-5-2 |
| Thinking | unknown |
| Duration | 2144s |
| Started | 2026-11-12T02:34:17+00:00 |
| Ended | 2026-11-12T03:10:04+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, claim.ts, cli.ts, damage-payout.ts, item.ts, node-runtime.d.ts, percent.ts, policy.ts, premium.ts, price-list.ts, rounding.ts
- **Implementation LOC** (total): 312
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 439
- **Active tests**: 58
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (58 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-11-12_02-34-17_claim-office-example-mapping_exact-ptdd-v1-cc_fable-5-2-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-11-12_02-34-17_claim-office-example-mapping_exact-ptdd-v1-cc_fable-5-2-no-thinking

 ✓ src/claim-office.spec.ts  (58 tests) 659ms

 Test Files  1 passed (1)
      Tests  58 passed (58)
   Start at  03:10:05
   Duration  1.02s (transform 108ms, setup 0ms, collect 117ms, tests 659ms, environment 0ms, prepare 79ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 95% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 74 | ×1 | 74 |
| Invocations | 113 | ×2 | 226 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 10 | ×5 | 50 |
| Assignments | 48 | ×6 | 288 |
| **Total Mass** | | | **706** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 249 |
| Functions | 34 |
| Longest Function | 12 lines |
| Avg LOC/Function | 4.12 |
| Median LOC/Function | 3.00 |
| Imports | 18 |

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
| McCabe (Cyclomatic) | 3 | 1.35 | 0 |
| Cognitive (SonarJS) | 2 | 1.15 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 53791121 |
| Context Utilization | 119% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 355.10s |
| Avg Red Phase | 26.58s |
| Avg Green Phase | 1.26s |
| Avg Refactor Phase | 327.26s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 0 |
| Predictions Total | 0 |
| Accuracy | N/A |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 4 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


