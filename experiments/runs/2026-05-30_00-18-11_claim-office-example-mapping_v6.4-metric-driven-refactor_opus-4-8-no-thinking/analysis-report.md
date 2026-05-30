# Analysis Report: 2026-05-30_00-18-11_claim-office-example-mapping_v6.4-metric-driven-refactor_opus-4-8-no-thinking

Generated: 2026-05-30T01:29:58+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.4-metric-driven-refactor |
| Model | opus-4-8-no-thinking |
| Model Version(s) | claude-opus-4-8 |
| Thinking | unknown |
| Duration | 4306s |
| Started | 2026-05-30T00:18:11+00:00 |
| Ended | 2026-05-30T01:29:58+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 271
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 679
- **Active tests**: 45
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (45 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-30_00-18-11_claim-office-example-mapping_v6.4-metric-driven-refactor_opus-4-8-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-30_00-18-11_claim-office-example-mapping_v6.4-metric-driven-refactor_opus-4-8-no-thinking

 ✓ src/claim-office.spec.ts  (45 tests) 7ms

 Test Files  1 passed (1)
      Tests  45 passed (45)
   Start at  01:29:58
   Duration  182ms (transform 44ms, setup 0ms, collect 46ms, tests 7ms, environment 0ms, prepare 43ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 58 | ×1 | 58 |
| Invocations | 89 | ×2 | 178 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 9 | ×5 | 45 |
| Assignments | 87 | ×6 | 522 |
| **Total Mass** | | | **847** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 217 |
| Functions | 36 |
| Longest Function | 12 lines |
| Avg LOC/Function | 3.22 |
| Median LOC/Function | 2.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 0 |
| Code Quality | 0 |
| **Total** | **0** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 4 | 1.38 | 0 |
| Cognitive (SonarJS) | 4 | 1.75 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 137223961 |
| Context Utilization | 247% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 45 |
| Avg Cycle Time | 94.20s |
| Avg Red Phase | 22.91s |
| Avg Green Phase | 16.92s |
| Avg Refactor Phase | 54.37s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 90 |
| Predictions Total | 90 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 45 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


