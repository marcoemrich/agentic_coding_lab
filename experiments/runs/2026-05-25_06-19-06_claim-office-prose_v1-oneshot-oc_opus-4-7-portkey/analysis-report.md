# Analysis Report: 2026-05-25_06-19-06_claim-office-prose_v1-oneshot-oc_opus-4-7-portkey

Generated: 2026-05-25T06:21:45+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-prose |
| Workflow | v1-oneshot-oc |
| Model | opus-4-7-portkey |
| Model Version(s) | N/A |
| Thinking | true |
| Duration | 158s |
| Started | 2026-05-25T06:19:06+00:00 |
| Ended | 2026-05-25T06:21:45+00:00 |

## Code Metrics

- **Implementation files**: claims.ts, cli.ts, pricing.ts, scenario.ts, types.ts
- **Implementation LOC** (total): 343
- **Test file**: claims.spec.ts
- **Test file LOC**: 89
- **Active tests**: 6
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (18 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-25_06-19-06_claim-office-prose_v1-oneshot-oc_opus-4-7-portkey
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-25_06-19-06_claim-office-prose_v1-oneshot-oc_opus-4-7-portkey

 ✓ src/claims.spec.ts  (6 tests) 2ms
 ✓ src/pricing.spec.ts  (9 tests) 2ms
 ✓ src/scenario.spec.ts  (3 tests) 3ms

 Test Files  3 passed (3)
      Tests  18 passed (18)
   Start at  06:21:45
   Duration  427ms (transform 40ms, setup 0ms, collect 50ms, tests 7ms, environment 0ms, prepare 134ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 88% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 97 | ×1 | 97 |
| Invocations | 106 | ×2 | 212 |
| Conditionals | 21 | ×4 | 84 |
| Loops | 18 | ×5 | 90 |
| Assignments | 72 | ×6 | 432 |
| **Total Mass** | | | **915** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 276 |
| Functions | 16 |
| Longest Function | 40 lines |
| Avg LOC/Function | 10.94 |
| Median LOC/Function | 6.50 |
| Imports | 8 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 9 |
| Code Quality | 0 |
| **Total** | **10** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 10 | 2.26 | 0 |
| Cognitive (SonarJS) | 14 | 3.90 | 1 |


