# Analysis Report: 2026-07-25_03-39-47_claim-office-example-mapping_v6.2-with-why-cleaned-pi_glm-5-2

Generated: 2026-07-25T04:34:26+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-pi |
| Model | glm-5-2 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 3278s |
| Started | 2026-07-25T03:39:47+00:00 |
| Ended | 2026-07-25T04:34:26+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, quote.ts, scenario.ts
- **Implementation LOC** (total): 269
- **Test file**: cli.spec.ts
- **Test file LOC**: 71
- **Active tests**: 5
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (30 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-25_03-39-47_claim-office-example-mapping_v6.2-with-why-cleaned-pi_glm-5-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-25_03-39-47_claim-office-example-mapping_v6.2-with-why-cleaned-pi_glm-5-2

 ✓ src/claim.spec.ts  (10 tests) 2ms
 ✓ src/quote.spec.ts  (13 tests) 3ms
 ✓ src/cli.spec.ts  (5 tests) 3ms
 ✓ src/scenario.spec.ts  (2 tests) 2ms

 Test Files  4 passed (4)
      Tests  30 passed (30)
   Start at  04:34:38
   Duration  572ms (transform 49ms, setup 0ms, collect 66ms, tests 10ms, environment 0ms, prepare 190ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 59 | ×1 | 59 |
| Invocations | 75 | ×2 | 150 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 11 | ×5 | 55 |
| Assignments | 90 | ×6 | 540 |
| **Total Mass** | | | **872** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 231 |
| Functions | 22 |
| Longest Function | 19 lines |
| Avg LOC/Function | 4.59 |
| Median LOC/Function | 2.00 |
| Imports | 5 |

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
| McCabe (Cyclomatic) | 7 | 1.93 | 0 |
| Cognitive (SonarJS) | 9 | 2.54 | 0 |


