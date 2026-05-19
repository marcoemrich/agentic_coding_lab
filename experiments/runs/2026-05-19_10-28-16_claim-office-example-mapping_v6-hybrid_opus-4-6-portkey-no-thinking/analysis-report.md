# Analysis Report: 2026-05-19_10-28-16_claim-office-example-mapping_v6-hybrid_opus-4-6-portkey-no-thinking

Generated: 2026-05-19T11:01:45+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6-hybrid |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 2007s |
| Started | 2026-05-19T10:28:16+00:00 |
| Ended | 2026-05-19T11:01:45+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 104
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 323
- **Active tests**: 21
- **Remaining todos**: 17

## Test Results

**Status**: ✅ All tests passing (21 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-19_10-28-16_claim-office-example-mapping_v6-hybrid_opus-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-19_10-28-16_claim-office-example-mapping_v6-hybrid_opus-4-6-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (38 tests | 17 skipped) 5ms

 Test Files  1 passed (1)
      Tests  21 passed | 17 todo (38)
   Start at  11:01:46
   Duration  217ms (transform 47ms, setup 0ms, collect 48ms, tests 5ms, environment 0ms, prepare 55ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 85% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 39 | ×1 | 39 |
| Invocations | 22 | ×2 | 44 |
| Conditionals | 9 | ×4 | 36 |
| Loops | 4 | ×5 | 20 |
| Assignments | 44 | ×6 | 264 |
| **Total Mass** | | | **403** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 85 |
| Functions | 7 |
| Longest Function | 17 lines |
| Avg LOC/Function | 6.43 |
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
| McCabe (Cyclomatic) | 4 | 1.64 | 0 |
| Cognitive (SonarJS) | 3 | 1.60 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 415039 |
| Context Utilization | 20% |

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


