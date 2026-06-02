# Analysis Report: 2026-05-12_08-36-07_claim-office-example-mapping_v5-exact-single-context_haiku-4-5-portkey-no-thinking

Generated: 2026-06-02T08:09:20+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5-exact-single-context |
| Model | haiku-4-5-portkey-no-thinking |
| Model Version(s) | claude-haiku-4-5-20251001 |
| Thinking | unknown |
| Duration | 424s |
| Started | 2026-05-12T08:36:07+00:00 |
| Ended | 2026-05-12T08:43:12+00:00 |

## Code Metrics

- **Implementation files**: mhpco.ts
- **Implementation LOC** (total): 84
- **Test file**: mhpco.spec.ts
- **Test file LOC**: 89
- **Active tests**: 11
- **Remaining todos**: 6

## Test Results

**Status**: ✅ All tests passing (11 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_08-36-07_claim-office-example-mapping_v5-exact-single-context_haiku-4-5-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_08-36-07_claim-office-example-mapping_v5-exact-single-context_haiku-4-5-portkey-no-thinking

 ✓ src/mhpco.spec.ts  (17 tests | 6 skipped) 2ms

 Test Files  1 passed (1)
      Tests  11 passed | 6 todo (17)
   Start at  08:09:22
   Duration  330ms (transform 26ms, setup 0ms, collect 22ms, tests 2ms, environment 0ms, prepare 68ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 70% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 18 | ×1 | 18 |
| Invocations | 6 | ×2 | 12 |
| Conditionals | 1 | ×4 | 4 |
| Loops | 2 | ×5 | 10 |
| Assignments | 17 | ×6 | 102 |
| **Total Mass** | | | **146** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 69 |
| Functions | 5 |
| Longest Function | 9 lines |
| Avg LOC/Function | 4.00 |
| Median LOC/Function | 3.00 |
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
| McCabe (Cyclomatic) | 2 | 1.43 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 16405850 |
| Context Utilization | 65% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 11 |
| Avg Cycle Time | 45.63s |
| Avg Red Phase | 13.27s |
| Avg Green Phase | 12.51s |
| Avg Refactor Phase | 19.85s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 16 |
| Predictions Total | 16 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 8 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 3 |


