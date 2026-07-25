# Analysis Report: 2026-07-25_01-23-55_claim-office-example-mapping_v6.2-with-why-cleaned-pi_minimax-m3-no-thinking-4

Generated: 2026-07-25T03:04:04+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-pi |
| Model | minimax-m3-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 6008s |
| Started | 2026-07-25T01:23:55+00:00 |
| Ended | 2026-07-25T03:04:04+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, scenario.ts
- **Implementation LOC** (total): 291
- **Test file**: scenario.spec.ts
- **Test file LOC**: 678
- **Active tests**: 41
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (41 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-25_01-23-55_claim-office-example-mapping_v6.2-with-why-cleaned-pi_minimax-m3-no-thinking-4
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-25_01-23-55_claim-office-example-mapping_v6.2-with-why-cleaned-pi_minimax-m3-no-thinking-4

 ✓ src/scenario.spec.ts  (41 tests) 8ms

 Test Files  1 passed (1)
      Tests  41 passed (41)
   Start at  03:04:13
   Duration  204ms (transform 46ms, setup 0ms, collect 46ms, tests 8ms, environment 0ms, prepare 51ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 60 | ×1 | 60 |
| Invocations | 86 | ×2 | 172 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 13 | ×5 | 65 |
| Assignments | 78 | ×6 | 468 |
| **Total Mass** | | | **833** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 249 |
| Functions | 16 |
| Longest Function | 33 lines |
| Avg LOC/Function | 10.94 |
| Median LOC/Function | 7.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 1 |
| Code Quality | 0 |
| **Total** | **2** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 8 | 2.88 | 0 |
| Cognitive (SonarJS) | 10 | 3.31 | 0 |


