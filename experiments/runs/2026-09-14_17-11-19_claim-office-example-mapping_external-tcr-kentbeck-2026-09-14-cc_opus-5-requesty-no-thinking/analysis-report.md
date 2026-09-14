# Analysis Report: 2026-09-14_17-11-19_claim-office-example-mapping_external-tcr-kentbeck-2026-09-14-cc_opus-5-requesty-no-thinking

Generated: 2026-09-14T17:16:16+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | external-tcr-kentbeck-2026-09-14-cc |
| Model | opus-5-requesty-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 292s |
| Started | 2026-09-14T17:11:19+00:00 |
| Ended | 2026-09-14T17:16:16+00:00 |

## Code Metrics

- **Implementation files**: catalog.ts, claim.ts, cli.ts, policy.ts, policyAccount.ts, premium.ts, scenario.ts
- **Implementation LOC** (total): 258
- **Test files**: catalog.spec.ts, claim.spec.ts, cli.spec.ts, policy.spec.ts, policyAccount.spec.ts, premium.spec.ts, scenario.spec.ts
- **Test LOC** (total): 412
- **Active tests**: 41
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (41 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-14_17-11-19_claim-office-example-mapping_external-tcr-kentbeck-2026-09-14-cc_opus-5-requesty-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-14_17-11-19_claim-office-example-mapping_external-tcr-kentbeck-2026-09-14-cc_opus-5-requesty-no-thinking

 ✓ src/policyAccount.spec.ts  (10 tests) 5ms
 ✓ src/cli.spec.ts  (4 tests) 2084ms
 ✓ src/scenario.spec.ts  (6 tests) 6ms
 ✓ src/premium.spec.ts  (7 tests) 3ms
 ✓ src/policy.spec.ts  (6 tests) 3ms
 ✓ src/claim.spec.ts  (5 tests) 3ms
 ✓ src/catalog.spec.ts  (3 tests) 3ms

 Test Files  7 passed (7)
      Tests  41 passed (41)
   Start at  17:16:17
   Duration  3.85s (transform 120ms, setup 0ms, collect 175ms, tests 2.11s, environment 1ms, prepare 544ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 64 | ×1 | 64 |
| Invocations | 86 | ×2 | 172 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 9 | ×5 | 45 |
| Assignments | 57 | ×6 | 342 |
| **Total Mass** | | | **687** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 213 |
| Functions | 15 |
| Longest Function | 17 lines |
| Avg LOC/Function | 5.80 |
| Median LOC/Function | 4.00 |
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
| McCabe (Cyclomatic) | 6 | 1.84 | 0 |
| Cognitive (SonarJS) | 8 | 2.18 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 4116849 |
| Context Utilization | 33% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 11 |
| Avg Cycle Time | 2.86s |
| Avg Red Phase | 2.47s |
| Avg Green Phase | 0.39s |
| Avg Refactor Phase | 0s |

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
| Refactorings Applied | 1 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 4 |


