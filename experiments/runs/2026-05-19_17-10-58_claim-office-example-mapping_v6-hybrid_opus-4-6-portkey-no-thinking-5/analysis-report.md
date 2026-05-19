# Analysis Report: 2026-05-19_17-10-58_claim-office-example-mapping_v6-hybrid_opus-4-6-portkey-no-thinking-5

Generated: 2026-05-19T17:49:16+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6-hybrid |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 2296s |
| Started | 2026-05-19T17:10:58+00:00 |
| Ended | 2026-05-19T17:49:16+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 157
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 641
- **Active tests**: 38
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (38 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-19_17-10-58_claim-office-example-mapping_v6-hybrid_opus-4-6-portkey-no-thinking-5
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-19_17-10-58_claim-office-example-mapping_v6-hybrid_opus-4-6-portkey-no-thinking-5

 ✓ src/claim-office.spec.ts  (38 tests) 747ms

 Test Files  1 passed (1)
      Tests  38 passed (38)
   Start at  17:49:17
   Duration  922ms (transform 41ms, setup 0ms, collect 41ms, tests 747ms, environment 0ms, prepare 45ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 95% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 57 | ×1 | 57 |
| Invocations | 43 | ×2 | 86 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 8 | ×5 | 40 |
| Assignments | 58 | ×6 | 348 |
| **Total Mass** | | | **571** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 141 |
| Functions | 5 |
| Longest Function | 34 lines |
| Avg LOC/Function | 21.00 |
| Median LOC/Function | 18.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 2 |
| Duplication | 0 |
| Magic Numbers | 0 |
| Code Quality | 0 |
| **Total** | **2** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 10 | 3.33 | 0 |
| Cognitive (SonarJS) | 18 | 6.40 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 38293241 |
| Context Utilization | 83% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 30 |
| Avg Cycle Time | 148.00s |
| Avg Red Phase | 33.45s |
| Avg Green Phase | 26.8s |
| Avg Refactor Phase | 87.75s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 56 |
| Predictions Total | 56 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 8 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 12 |


