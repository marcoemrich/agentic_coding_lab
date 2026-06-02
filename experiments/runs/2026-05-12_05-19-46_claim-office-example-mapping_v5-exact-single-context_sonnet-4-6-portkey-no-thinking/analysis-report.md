# Analysis Report: 2026-05-12_05-19-46_claim-office-example-mapping_v5-exact-single-context_sonnet-4-6-portkey-no-thinking

Generated: 2026-06-02T08:01:59+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5-exact-single-context |
| Model | sonnet-4-6-portkey-no-thinking |
| Model Version(s) | claude-sonnet-4-6 |
| Thinking | unknown |
| Duration | 1991s |
| Started | 2026-05-12T05:19:46+00:00 |
| Ended | 2026-05-12T05:52:59+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 197
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 170
- **Active tests**: 23
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (23 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_05-19-46_claim-office-example-mapping_v5-exact-single-context_sonnet-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_05-19-46_claim-office-example-mapping_v5-exact-single-context_sonnet-4-6-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (23 tests) 4ms

 Test Files  1 passed (1)
      Tests  23 passed (23)
   Start at  08:02:01
   Duration  355ms (transform 33ms, setup 0ms, collect 30ms, tests 4ms, environment 0ms, prepare 103ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 51% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 67 | ×1 | 67 |
| Invocations | 57 | ×2 | 114 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 9 | ×5 | 45 |
| Assignments | 64 | ×6 | 384 |
| **Total Mass** | | | **674** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 175 |
| Functions | 6 |
| Longest Function | 65 lines |
| Avg LOC/Function | 14.67 |
| Median LOC/Function | 4.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 6 |
| Duplication | 0 |
| Magic Numbers | 1 |
| Code Quality | 0 |
| **Total** | **7** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 14 | 2.77 | 1 |
| Cognitive (SonarJS) | 31 | 6.67 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 39740384 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 23 |
| Avg Cycle Time | 90.32s |
| Avg Red Phase | 25.11s |
| Avg Green Phase | 23.5s |
| Avg Refactor Phase | 41.71s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 45 |
| Predictions Total | 46 |
| Accuracy | 97% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 23 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 7 |


