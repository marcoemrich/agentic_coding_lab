# Analysis Report: 2026-07-25_01-23-55_claim-office-example-mapping_v6.2-with-why-cleaned-pi_minimax-m3-no-thinking-2

Generated: 2026-07-25T03:11:32+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-pi |
| Model | minimax-m3-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 6456s |
| Started | 2026-07-25T01:23:55+00:00 |
| Ended | 2026-07-25T03:11:32+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, quote.ts, scenario.ts
- **Implementation LOC** (total): 267
- **Test file**: claim.spec.ts
- **Test file LOC**: 78
- **Active tests**: 14
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (44 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-25_01-23-55_claim-office-example-mapping_v6.2-with-why-cleaned-pi_minimax-m3-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-25_01-23-55_claim-office-example-mapping_v6.2-with-why-cleaned-pi_minimax-m3-no-thinking-2

 ✓ src/quote.spec.ts  (22 tests) 5ms
 ✓ src/claim.spec.ts  (14 tests) 4ms
 ✓ src/scenario.spec.ts  (8 tests) 3ms

 Test Files  3 passed (3)
      Tests  44 passed (44)
   Start at  03:11:53
   Duration  415ms (transform 45ms, setup 0ms, collect 53ms, tests 12ms, environment 0ms, prepare 125ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 86% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 64 | ×1 | 64 |
| Invocations | 68 | ×2 | 136 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 6 | ×5 | 30 |
| Assignments | 58 | ×6 | 348 |
| **Total Mass** | | | **638** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 239 |
| Functions | 10 |
| Longest Function | 28 lines |
| Avg LOC/Function | 12.10 |
| Median LOC/Function | 9.00 |
| Imports | 4 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 2 |
| Code Quality | 0 |
| **Total** | **2** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 6 | 3.17 | 0 |
| Cognitive (SonarJS) | 7 | 3.20 | 0 |


