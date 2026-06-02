# Analysis Report: 2026-05-12_23-14-06_claim-office-example-mapping_v5-exact-single-context_opus-4-7-no-thinking

Generated: 2026-06-02T08:13:13+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5-exact-single-context |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 734s |
| Started | 2026-05-12T23:14:06+00:00 |
| Ended | 2026-05-12T23:26:21+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 233
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 512
- **Active tests**: 30
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (30 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_23-14-06_claim-office-example-mapping_v5-exact-single-context_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_23-14-06_claim-office-example-mapping_v5-exact-single-context_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (30 tests) 6ms

 Test Files  1 passed (1)
      Tests  30 passed (30)
   Start at  08:13:14
   Duration  384ms (transform 36ms, setup 0ms, collect 33ms, tests 6ms, environment 0ms, prepare 75ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 90% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 74 | ×1 | 74 |
| Invocations | 73 | ×2 | 146 |
| Conditionals | 21 | ×4 | 84 |
| Loops | 13 | ×5 | 65 |
| Assignments | 95 | ×6 | 570 |
| **Total Mass** | | | **939** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 193 |
| Functions | 15 |
| Longest Function | 19 lines |
| Avg LOC/Function | 7.07 |
| Median LOC/Function | 5.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 2 |
| Duplication | 0 |
| Magic Numbers | 1 |
| Code Quality | 0 |
| **Total** | **3** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 10 | 2.32 | 0 |
| Cognitive (SonarJS) | 12 | 3.70 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 23265439 |
| Context Utilization | 14% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 4 |
| Avg Cycle Time | 176.51s |
| Avg Red Phase | 20.58s |
| Avg Green Phase | 142.18s |
| Avg Refactor Phase | 13.75s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 6 |
| Predictions Total | 6 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 3 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


