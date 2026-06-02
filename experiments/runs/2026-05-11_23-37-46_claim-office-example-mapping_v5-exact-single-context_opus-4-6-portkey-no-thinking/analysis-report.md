# Analysis Report: 2026-05-11_23-37-46_claim-office-example-mapping_v5-exact-single-context_opus-4-6-portkey-no-thinking

Generated: 2026-06-02T07:55:25+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5-exact-single-context |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 1942s |
| Started | 2026-05-11T23:37:46+00:00 |
| Ended | 2026-05-12T00:10:09+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 141
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 369
- **Active tests**: 36
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (36 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-11_23-37-46_claim-office-example-mapping_v5-exact-single-context_opus-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-11_23-37-46_claim-office-example-mapping_v5-exact-single-context_opus-4-6-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (36 tests) 6ms

 Test Files  1 passed (1)
      Tests  36 passed (36)
   Start at  07:55:27
   Duration  348ms (transform 37ms, setup 0ms, collect 31ms, tests 6ms, environment 0ms, prepare 99ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 85% |
| Branches | 87% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 61 | ×1 | 61 |
| Invocations | 42 | ×2 | 84 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 6 | ×5 | 30 |
| Assignments | 48 | ×6 | 288 |
| **Total Mass** | | | **523** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 131 |
| Functions | 2 |
| Longest Function | 64 lines |
| Avg LOC/Function | 33.00 |
| Median LOC/Function | 33.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 5 |
| Duplication | 0 |
| Magic Numbers | 12 |
| Code Quality | 0 |
| **Total** | **17** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 24 | 5.00 | 1 |
| Cognitive (SonarJS) | 50 | 25.50 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 49955095 |
| Context Utilization | 83% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 35 |
| Avg Cycle Time | 102.72s |
| Avg Red Phase | 28.4s |
| Avg Green Phase | 32.24s |
| Avg Refactor Phase | 42.08s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 70 |
| Predictions Total | 70 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 7 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 17 |


