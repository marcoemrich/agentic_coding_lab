# Analysis Report: 2026-05-09_14-24-02_claim-office-example-mapping_v3-basic-tdd_sonnet-4-6-no-thinking

Generated: 2026-05-10T14:58:01+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v3-basic-tdd |
| Model | sonnet-4-6-no-thinking |
| Model Version(s) | claude-sonnet-4-6 |
| Thinking | unknown |
| Duration | 403s |
| Started | 2026-05-09T14:24:02+00:00 |
| Ended | 2026-05-09T14:30:47+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts, types.ts
- **Implementation LOC** (total): 414
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 390
- **Active tests**: 34
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (34 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-09_14-24-02_claim-office-example-mapping_v3-basic-tdd_sonnet-4-6-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-09_14-24-02_claim-office-example-mapping_v3-basic-tdd_sonnet-4-6-no-thinking

 ✓ src/claim-office.spec.ts  (34 tests) 5ms

 Test Files  1 passed (1)
      Tests  34 passed (34)
   Start at  14:58:02
   Duration  381ms (transform 34ms, setup 0ms, collect 35ms, tests 5ms, environment 0ms, prepare 78ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 74% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 201 | ×1 | 201 |
| Invocations | 121 | ×2 | 242 |
| Conditionals | 25 | ×4 | 100 |
| Loops | 26 | ×5 | 130 |
| Assignments | 93 | ×6 | 558 |
| **Total Mass** | | | **1231** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 286 |
| Functions | 7 |
| Longest Function | 87 lines |
| Avg LOC/Function | 41.71 |
| Median LOC/Function | 40.00 |
| Imports | 3 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 7 |
| Duplication | 0 |
| Magic Numbers | 27 |
| Code Quality | 0 |
| **Total** | **34** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 18 | 4.67 | 2 |
| Cognitive (SonarJS) | 20 | 10.33 | 3 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3824855 |
| Context Utilization | 7% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 2 |
| Avg Cycle Time | 44.45s |
| Avg Red Phase | 26.61s |
| Avg Green Phase | 17.84s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 0 |
| Predictions Total | 0 |
| Accuracy | N/A |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


