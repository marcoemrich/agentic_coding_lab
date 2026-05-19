# Analysis Report: 2026-05-19_15-26-59_claim-office-example-mapping_v6.5-lean_opus-4-6-portkey-no-thinking

Generated: 2026-05-19T15:30:18+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.5-lean |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 198s |
| Started | 2026-05-19T15:26:59+00:00 |
| Ended | 2026-05-19T15:30:18+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 15
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 76
- **Active tests**: 1
- **Remaining todos**: 35

## Test Results

**Status**: ✅ All tests passing (1 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-19_15-26-59_claim-office-example-mapping_v6.5-lean_opus-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-19_15-26-59_claim-office-example-mapping_v6.5-lean_opus-4-6-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (36 tests | 35 skipped) 3ms

 Test Files  1 passed (1)
      Tests  1 passed | 35 todo (36)
   Start at  15:30:19
   Duration  157ms (transform 23ms, setup 0ms, collect 22ms, tests 3ms, environment 0ms, prepare 44ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 20% |
| Branches | 50% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 7 | ×1 | 7 |
| Invocations | 8 | ×2 | 16 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 0 | ×5 | 0 |
| Assignments | 6 | ×6 | 36 |
| **Total Mass** | | | **59** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 14 |
| Functions | 1 |
| Longest Function | 3 lines |
| Avg LOC/Function | 3.00 |
| Median LOC/Function | 3.00 |
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
| McCabe (Cyclomatic) | 1 | 1.00 | 0 |
| Cognitive (SonarJS) | 0 | 0 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 388741 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 0 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
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


