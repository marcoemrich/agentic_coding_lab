# Analysis Report: 2026-05-12_04-34-31_claim-office-example-mapping_v5-exact-single-context_sonnet-4-6-portkey

Generated: 2026-05-12T22:38:02+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5-exact-single-context |
| Model | sonnet-4-6-portkey |
| Model Version(s) | claude-sonnet-4-6 |
| Thinking | true |
| Duration | 3617s |
| Started | 2026-05-12T04:34:31+00:00 |
| Ended | 2026-05-12T05:34:49+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 106
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 132
- **Active tests**: 22
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (22 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_04-34-31_claim-office-example-mapping_v5-exact-single-context_sonnet-4-6-portkey
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_04-34-31_claim-office-example-mapping_v5-exact-single-context_sonnet-4-6-portkey

 ✓ src/claim-office.spec.ts  (22 tests) 4ms

 Test Files  1 passed (1)
      Tests  22 passed (22)
   Start at  22:38:03
   Duration  353ms (transform 27ms, setup 0ms, collect 27ms, tests 4ms, environment 0ms, prepare 78ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 61% |
| Branches | 88% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 54 | ×1 | 54 |
| Invocations | 28 | ×2 | 56 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 4 | ×5 | 20 |
| Assignments | 51 | ×6 | 306 |
| **Total Mass** | | | **488** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 98 |
| Functions | 7 |
| Longest Function | 37 lines |
| Avg LOC/Function | 6.86 |
| Median LOC/Function | 2.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 2 |
| Code Quality | 0 |
| **Total** | **3** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 6 | 2.70 | 0 |
| Cognitive (SonarJS) | 7 | 2.38 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 48959198 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 22 |
| Avg Cycle Time | 174.03s |
| Avg Red Phase | 48.4s |
| Avg Green Phase | 41.72s |
| Avg Refactor Phase | 83.91s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 43 |
| Predictions Total | 44 |
| Accuracy | 97% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 21 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 7 |


