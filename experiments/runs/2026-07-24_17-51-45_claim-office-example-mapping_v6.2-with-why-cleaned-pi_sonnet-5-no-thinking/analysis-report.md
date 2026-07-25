# Analysis Report: 2026-07-24_17-51-45_claim-office-example-mapping_v6.2-with-why-cleaned-pi_sonnet-5-no-thinking

Generated: 2026-07-24T18:59:25+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-pi |
| Model | sonnet-5-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 4059s |
| Started | 2026-07-24T17:51:45+00:00 |
| Ended | 2026-07-24T18:59:25+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, quote.ts
- **Implementation LOC** (total): 317
- **Test file**: cli.spec.ts
- **Test file LOC**: 117
- **Active tests**: 5
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (26 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-24_17-51-45_claim-office-example-mapping_v6.2-with-why-cleaned-pi_sonnet-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-24_17-51-45_claim-office-example-mapping_v6.2-with-why-cleaned-pi_sonnet-5-no-thinking

 ✓ src/claim.spec.ts  (12 tests) 2ms
 ✓ src/quote.spec.ts  (9 tests) 4ms
Error: Unknown item type: "broomstick"
Error: Damaged item type "amulet" is not part of the referenced policy
Error: Damage amount cannot be negative: -200
Error: Claim references 2 "sword" damages but only 1 are insured
 ✓ src/cli.spec.ts  (5 tests) 1402ms

 Test Files  3 passed (3)
      Tests  26 passed (26)
   Start at  18:59:26
   Duration  1.83s (transform 47ms, setup 0ms, collect 54ms, tests 1.41s, environment 0ms, prepare 136ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 56% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 76 | ×1 | 76 |
| Invocations | 68 | ×2 | 136 |
| Conditionals | 18 | ×4 | 72 |
| Loops | 12 | ×5 | 60 |
| Assignments | 74 | ×6 | 444 |
| **Total Mass** | | | **788** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 255 |
| Functions | 18 |
| Longest Function | 23 lines |
| Avg LOC/Function | 4.67 |
| Median LOC/Function | 3.00 |
| Imports | 5 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 3 |
| Code Quality | 0 |
| **Total** | **4** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 7 | 2.04 | 0 |
| Cognitive (SonarJS) | 8 | 2.64 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2614111 |
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
| Predictions Correct | 35 |
| Predictions Total | 36 |
| Accuracy | 97% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 18 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


