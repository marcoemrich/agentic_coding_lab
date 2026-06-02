# Analysis Report: 2026-05-12_04-55-32_claim-office-example-mapping_v5-exact-single-context_sonnet-4-6-portkey

Generated: 2026-06-02T08:00:06+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5-exact-single-context |
| Model | sonnet-4-6-portkey |
| Model Version(s) | claude-sonnet-4-6 |
| Thinking | true |
| Duration | 1838s |
| Started | 2026-05-12T04:55:32+00:00 |
| Ended | 2026-05-12T05:26:11+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 68
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 114
- **Active tests**: 13
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (13 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_04-55-32_claim-office-example-mapping_v5-exact-single-context_sonnet-4-6-portkey
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_04-55-32_claim-office-example-mapping_v5-exact-single-context_sonnet-4-6-portkey

 ✓ src/claim-office.spec.ts  (13 tests) 3ms

 Test Files  1 passed (1)
      Tests  13 passed (13)
   Start at  08:00:09
   Duration  373ms (transform 27ms, setup 0ms, collect 25ms, tests 3ms, environment 0ms, prepare 73ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 69% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 43 | ×1 | 43 |
| Invocations | 16 | ×2 | 32 |
| Conditionals | 9 | ×4 | 36 |
| Loops | 1 | ×5 | 5 |
| Assignments | 40 | ×6 | 240 |
| **Total Mass** | | | **356** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 61 |
| Functions | 2 |
| Longest Function | 13 lines |
| Avg LOC/Function | 11.00 |
| Median LOC/Function | 11.00 |
| Imports | 1 |

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
| McCabe (Cyclomatic) | 9 | 2.29 | 0 |
| Cognitive (SonarJS) | 7 | 4.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 29783417 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 13 |
| Avg Cycle Time | 137.14s |
| Avg Red Phase | 61.15s |
| Avg Green Phase | 33.97s |
| Avg Refactor Phase | 42.02s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 25 |
| Predictions Total | 26 |
| Accuracy | 96% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 13 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


