# Analysis Report: 2026-05-12_05-06-15_claim-office-example-mapping_v5-exact-single-context_sonnet-4-6-portkey-no-thinking

Generated: 2026-06-02T08:01:24+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5-exact-single-context |
| Model | sonnet-4-6-portkey-no-thinking |
| Model Version(s) | claude-sonnet-4-6 |
| Thinking | unknown |
| Duration | 2716s |
| Started | 2026-05-12T05:06:15+00:00 |
| Ended | 2026-05-12T05:51:32+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 177
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 227
- **Active tests**: 27
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (27 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_05-06-15_claim-office-example-mapping_v5-exact-single-context_sonnet-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_05-06-15_claim-office-example-mapping_v5-exact-single-context_sonnet-4-6-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (27 tests) 4ms

 Test Files  1 passed (1)
      Tests  27 passed (27)
   Start at  08:01:26
   Duration  342ms (transform 31ms, setup 0ms, collect 29ms, tests 4ms, environment 0ms, prepare 86ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 65% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 60 | ×1 | 60 |
| Invocations | 47 | ×2 | 94 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 6 | ×5 | 30 |
| Assignments | 56 | ×6 | 336 |
| **Total Mass** | | | **588** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 150 |
| Functions | 12 |
| Longest Function | 38 lines |
| Avg LOC/Function | 7.33 |
| Median LOC/Function | 3.50 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 2 |
| Duplication | 0 |
| Magic Numbers | 11 |
| Code Quality | 0 |
| **Total** | **13** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 7 | 2.16 | 0 |
| Cognitive (SonarJS) | 8 | 2.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 51252626 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 28 |
| Avg Cycle Time | 107.25s |
| Avg Red Phase | 30.56s |
| Avg Green Phase | 33.83s |
| Avg Refactor Phase | 42.86s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 51 |
| Predictions Total | 54 |
| Accuracy | 94% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 24 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 5 |


