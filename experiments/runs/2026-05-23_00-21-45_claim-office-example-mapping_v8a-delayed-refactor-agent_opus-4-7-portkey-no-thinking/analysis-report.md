# Analysis Report: 2026-05-23_00-21-45_claim-office-example-mapping_v8a-delayed-refactor-agent_opus-4-7-portkey-no-thinking

Generated: 2026-05-23T11:58:26+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v8a-delayed-refactor-agent |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 262s |
| Started | 2026-05-23T00:21:45+00:00 |
| Ended | 2026-05-23T00:26:08+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 305
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 419
- **Active tests**: 42
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (42 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-23_00-21-45_claim-office-example-mapping_v8a-delayed-refactor-agent_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-23_00-21-45_claim-office-example-mapping_v8a-delayed-refactor-agent_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (42 tests) 8ms

 Test Files  1 passed (1)
      Tests  42 passed (42)
   Start at  11:58:26
   Duration  407ms (transform 43ms, setup 0ms, collect 43ms, tests 8ms, environment 0ms, prepare 81ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 73 | ×1 | 73 |
| Invocations | 114 | ×2 | 228 |
| Conditionals | 22 | ×4 | 88 |
| Loops | 13 | ×5 | 65 |
| Assignments | 61 | ×6 | 366 |
| **Total Mass** | | | **820** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 235 |
| Functions | 21 |
| Longest Function | 29 lines |
| Avg LOC/Function | 9.14 |
| Median LOC/Function | 5.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 13 |
| Code Quality | 0 |
| **Total** | **13** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 6 | 1.91 | 0 |
| Cognitive (SonarJS) | 7 | 2.85 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1614731 |
| Context Utilization | 7% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 5 |
| Avg Cycle Time | 93.99s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 93.99s |

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
| Refactorings Applied | 1 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


