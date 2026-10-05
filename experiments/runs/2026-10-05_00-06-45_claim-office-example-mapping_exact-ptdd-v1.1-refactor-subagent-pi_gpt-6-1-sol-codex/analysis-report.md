# Analysis Report: 2026-10-05_00-06-45_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-pi_gpt-6-1-sol-codex

Generated: 2026-10-05T01:33:26+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1.1-refactor-subagent-pi |
| Model | gpt-6-1-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 5198s |
| Started | 2026-10-05T00:06:46+00:00 |
| Ended | 2026-10-05T01:33:26+00:00 |

## Code Metrics

- **Implementation files**: building-block.ts, catalogue.ts, claim.ts, cli.ts, follow-up-contract.ts, item-risk.ts, item.ts, loyalty.ts, policy.ts, premium.ts, scenario.ts
- **Implementation LOC** (total): 182
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 211
- **Active tests**: 42
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (42 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-05_00-06-45_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-pi_gpt-6-1-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-05_00-06-45_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-pi_gpt-6-1-sol-codex

 ✓ src/claim-office.spec.ts  (42 tests) 8988ms

 Test Files  1 passed (1)
      Tests  42 passed (42)
   Start at  01:33:27
   Duration  9.33s (transform 72ms, setup 0ms, collect 69ms, tests 8.99s, environment 0ms, prepare 74ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 0% |
| Branches | 0% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 80 | ×1 | 80 |
| Invocations | 77 | ×2 | 154 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 7 | ×5 | 35 |
| Assignments | 47 | ×6 | 282 |
| **Total Mass** | | | **595** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 155 |
| Functions | 22 |
| Longest Function | 17 lines |
| Avg LOC/Function | 4.64 |
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
| McCabe (Cyclomatic) | 3 | 1.38 | 0 |
| Cognitive (SonarJS) | 2 | 1.20 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 15575362 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 43 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 85 |
| Predictions Total | 86 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 43 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


