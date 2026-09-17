# Analysis Report: 2026-09-17_00-24-45_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-pi_gpt-5-6-sol-codex-3

Generated: 2026-09-17T01:39:02+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1.1-refactor-subagent-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 4444s |
| Started | 2026-09-17T00:24:50+00:00 |
| Ended | 2026-09-17T01:39:02+00:00 |

## Code Metrics

- **Implementation files**: claim-coverage.ts, claim-damage-validation.ts, claim-deductible.ts, claim-office.ts, claim-reimbursement.ts, cli.ts, item-catalogue.ts, policy-base-premium.ts, policy-payout-cap.ts
- **Implementation LOC** (total): 254
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 197
- **Active tests**: 37
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (37 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-17_00-24-45_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-pi_gpt-5-6-sol-codex-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-17_00-24-45_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-pi_gpt-5-6-sol-codex-3

 ✓ src/claim-office.spec.ts  (37 tests) 3806ms

 Test Files  1 passed (1)
      Tests  37 passed (37)
   Start at  01:39:03
   Duration  4.25s (transform 137ms, setup 0ms, collect 153ms, tests 3.81s, environment 0ms, prepare 104ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 94% |
| Branches | 87% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 76 | ×1 | 76 |
| Invocations | 96 | ×2 | 192 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 6 | ×5 | 30 |
| Assignments | 45 | ×6 | 270 |
| **Total Mass** | | | **628** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 216 |
| Functions | 30 |
| Longest Function | 12 lines |
| Avg LOC/Function | 4.03 |
| Median LOC/Function | 3.00 |
| Imports | 10 |

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
| McCabe (Cyclomatic) | 4 | 1.52 | 0 |
| Cognitive (SonarJS) | 3 | 1.21 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 15012350 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 37 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 74 |
| Predictions Total | 74 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 37 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


