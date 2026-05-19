# Analysis Report: 2026-05-19_15-23-51_claim-office-example-mapping_v6.3-no-pep_opus-4-6-portkey-no-thinking-2

Generated: 2026-05-19T16:06:15+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.3-no-pep |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 2542s |
| Started | 2026-05-19T15:23:51+00:00 |
| Ended | 2026-05-19T16:06:15+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 211
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 765
- **Active tests**: 38
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (38 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-19_15-23-51_claim-office-example-mapping_v6.3-no-pep_opus-4-6-portkey-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-19_15-23-51_claim-office-example-mapping_v6.3-no-pep_opus-4-6-portkey-no-thinking-2

 ✓ src/claim-office.spec.ts  (38 tests) 367ms

 Test Files  1 passed (1)
      Tests  38 passed (38)
   Start at  16:06:15
   Duration  542ms (transform 48ms, setup 1ms, collect 46ms, tests 367ms, environment 0ms, prepare 46ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 60 | ×1 | 60 |
| Invocations | 49 | ×2 | 98 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 8 | ×5 | 40 |
| Assignments | 69 | ×6 | 414 |
| **Total Mass** | | | **656** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 183 |
| Functions | 10 |
| Longest Function | 19 lines |
| Avg LOC/Function | 10.30 |
| Median LOC/Function | 9.00 |
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
| McCabe (Cyclomatic) | 7 | 2.18 | 0 |
| Cognitive (SonarJS) | 9 | 2.60 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 39525438 |
| Context Utilization | 83% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 22 |
| Avg Cycle Time | 170.79s |
| Avg Red Phase | 41.52s |
| Avg Green Phase | 32.54s |
| Avg Refactor Phase | 96.73s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 42 |
| Predictions Total | 42 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 9 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 2 |


