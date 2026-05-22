# Analysis Report: 2026-05-22_09-28-57_claim-office-example-mapping_v4.2-shared-context_opus-4-7-portkey-no-thinking

Generated: 2026-05-22T10:41:40+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4.2-shared-context |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 4361s |
| Started | 2026-05-22T09:28:57+00:00 |
| Ended | 2026-05-22T10:41:40+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 188
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 319
- **Active tests**: 36
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (36 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-22_09-28-57_claim-office-example-mapping_v4.2-shared-context_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-22_09-28-57_claim-office-example-mapping_v4.2-shared-context_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (36 tests) 6ms

 Test Files  1 passed (1)
      Tests  36 passed (36)
   Start at  10:41:41
   Duration  219ms (transform 61ms, setup 0ms, collect 62ms, tests 6ms, environment 0ms, prepare 57ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 62 | ×1 | 62 |
| Invocations | 57 | ×2 | 114 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 10 | ×5 | 50 |
| Assignments | 49 | ×6 | 294 |
| **Total Mass** | | | **584** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 162 |
| Functions | 12 |
| Longest Function | 20 lines |
| Avg LOC/Function | 4.83 |
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
| McCabe (Cyclomatic) | 7 | 1.95 | 0 |
| Cognitive (SonarJS) | 9 | 3.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 20841337 |
| Context Utilization | 16% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 36 |
| Avg Cycle Time | 131.86s |
| Avg Red Phase | 47.84s |
| Avg Green Phase | 37.83s |
| Avg Refactor Phase | 46.19s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 40 |
| Predictions Total | 41 |
| Accuracy | 97% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 25 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 11 |


