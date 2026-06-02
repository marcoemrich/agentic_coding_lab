# Analysis Report: 2026-05-12_04-00-43_claim-office-example-mapping_v5-exact-single-context_haiku-4-5-portkey-no-thinking

Generated: 2026-06-02T07:58:04+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5-exact-single-context |
| Model | haiku-4-5-portkey-no-thinking |
| Model Version(s) | claude-haiku-4-5-20251001 |
| Thinking | unknown |
| Duration | 376s |
| Started | 2026-05-12T04:00:43+00:00 |
| Ended | 2026-05-12T04:07:01+00:00 |

## Code Metrics

- **Implementation files**: mhpco.ts
- **Implementation LOC** (total): 92
- **Test file**: mhpco.spec.ts
- **Test file LOC**: 53
- **Active tests**: 8
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (8 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_04-00-43_claim-office-example-mapping_v5-exact-single-context_haiku-4-5-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_04-00-43_claim-office-example-mapping_v5-exact-single-context_haiku-4-5-portkey-no-thinking

 ✓ src/mhpco.spec.ts  (8 tests) 2ms

 Test Files  1 passed (1)
      Tests  8 passed (8)
   Start at  07:58:06
   Duration  333ms (transform 26ms, setup 0ms, collect 19ms, tests 2ms, environment 0ms, prepare 94ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 86% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 19 | ×1 | 19 |
| Invocations | 11 | ×2 | 22 |
| Conditionals | 6 | ×4 | 24 |
| Loops | 1 | ×5 | 5 |
| Assignments | 20 | ×6 | 120 |
| **Total Mass** | | | **190** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 72 |
| Functions | 7 |
| Longest Function | 10 lines |
| Avg LOC/Function | 6.00 |
| Median LOC/Function | 5.00 |
| Imports | 0 |

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
| McCabe (Cyclomatic) | 3 | 1.56 | 0 |
| Cognitive (SonarJS) | 2 | 1.33 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 15319189 |
| Context Utilization | 63% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 7 |
| Avg Cycle Time | 51.33s |
| Avg Red Phase | 14.6s |
| Avg Green Phase | 12.46s |
| Avg Refactor Phase | 24.27s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 14 |
| Predictions Total | 14 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 7 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


