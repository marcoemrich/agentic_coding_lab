# Analysis Report: 2026-05-15_07-33-51_claim-office-example-mapping_v5-exact-single-context_opus-4-7-no-thinking

Generated: 2026-05-15T07:42:38+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5-exact-single-context |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 526s |
| Started | 2026-05-15T07:33:51+00:00 |
| Ended | 2026-05-15T07:42:38+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 170
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 355
- **Active tests**: 33
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (33 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-15_07-33-51_claim-office-example-mapping_v5-exact-single-context_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-15_07-33-51_claim-office-example-mapping_v5-exact-single-context_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (33 tests) 6ms

 Test Files  1 passed (1)
      Tests  33 passed (33)
   Start at  07:42:39
   Duration  211ms (transform 53ms, setup 0ms, collect 48ms, tests 6ms, environment 0ms, prepare 67ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 85% |
| Branches | 88% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 62 | ×1 | 62 |
| Invocations | 54 | ×2 | 108 |
| Conditionals | 22 | ×4 | 88 |
| Loops | 8 | ×5 | 40 |
| Assignments | 55 | ×6 | 330 |
| **Total Mass** | | | **628** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 149 |
| Functions | 4 |
| Longest Function | 66 lines |
| Avg LOC/Function | 22.75 |
| Median LOC/Function | 9.50 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 3 |
| Duplication | 1 |
| Magic Numbers | 15 |
| Code Quality | 0 |
| **Total** | **19** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 29 | 7.40 | 1 |
| Cognitive (SonarJS) | 49 | 18.33 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 8582118 |
| Context Utilization | 10% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 2 |
| Avg Cycle Time | 243.29s |
| Avg Red Phase | 31.43s |
| Avg Green Phase | 205.24s |
| Avg Refactor Phase | 6.62s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 4 |
| Predictions Total | 4 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 1 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


