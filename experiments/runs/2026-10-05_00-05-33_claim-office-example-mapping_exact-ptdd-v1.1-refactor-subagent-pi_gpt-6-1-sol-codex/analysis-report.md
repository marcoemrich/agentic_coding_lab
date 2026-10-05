# Analysis Report: 2026-10-05_00-05-33_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-pi_gpt-6-1-sol-codex

Generated: 2026-10-05T01:35:31+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1.1-refactor-subagent-pi |
| Model | gpt-6-1-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 5394s |
| Started | 2026-10-05T00:05:34+00:00 |
| Ended | 2026-10-05T01:35:31+00:00 |

## Code Metrics

- **Implementation files**: claim-reimbursement.ts, cli.ts, insured-occurrence.ts, item-risk.ts, item.ts, payout-rounding.ts, policy-cap.ts, policy-valuation.ts, premium.ts, price-list.ts, scenario.ts
- **Implementation LOC** (total): 190
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 159
- **Active tests**: 42
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (42 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-05_00-05-33_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-pi_gpt-6-1-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-05_00-05-33_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-pi_gpt-6-1-sol-codex

 ✓ src/claim-office.spec.ts  (42 tests) 5595ms

 Test Files  1 passed (1)
      Tests  42 passed (42)
   Start at  01:35:32
   Duration  5.91s (transform 68ms, setup 0ms, collect 54ms, tests 5.59s, environment 0ms, prepare 79ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 0% |
| Branches | 0% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 77 | ×1 | 77 |
| Invocations | 86 | ×2 | 172 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 9 | ×5 | 45 |
| Assignments | 40 | ×6 | 240 |
| **Total Mass** | | | **578** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 159 |
| Functions | 26 |
| Longest Function | 16 lines |
| Avg LOC/Function | 4.19 |
| Median LOC/Function | 3.00 |
| Imports | 17 |

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
| Total Tokens | 17113707 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 42 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 83 |
| Predictions Total | 84 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 42 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


