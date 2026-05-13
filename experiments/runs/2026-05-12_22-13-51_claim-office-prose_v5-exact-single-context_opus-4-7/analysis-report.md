# Analysis Report: 2026-05-12_22-13-51_claim-office-prose_v5-exact-single-context_opus-4-7

Generated: 2026-05-12T22:29:13+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-prose |
| Workflow | v5-exact-single-context |
| Model | opus-4-7 |
| Model Version(s) | claude-opus-4-7 |
| Thinking | true |
| Duration | 921s |
| Started | 2026-05-12T22:13:51+00:00 |
| Ended | 2026-05-12T22:29:13+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, scenario.ts
- **Implementation LOC** (total): 155
- **Test file**: scenario.spec.ts
- **Test file LOC**: 282
- **Active tests**: 13
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (13 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-12_22-13-51_claim-office-prose_v5-exact-single-context_opus-4-7
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-12_22-13-51_claim-office-prose_v5-exact-single-context_opus-4-7

 ✓ src/scenario.spec.ts  (13 tests) 365ms

 Test Files  1 passed (1)
      Tests  13 passed (13)
   Start at  22:29:14
   Duration  531ms (transform 36ms, setup 0ms, collect 36ms, tests 365ms, environment 0ms, prepare 43ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 87% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 54 | ×1 | 54 |
| Invocations | 50 | ×2 | 100 |
| Conditionals | 9 | ×4 | 36 |
| Loops | 7 | ×5 | 35 |
| Assignments | 62 | ×6 | 372 |
| **Total Mass** | | | **597** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 138 |
| Functions | 11 |
| Longest Function | 23 lines |
| Avg LOC/Function | 6.36 |
| Median LOC/Function | 3.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 12 |
| Code Quality | 0 |
| **Total** | **12** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 5 | 1.94 | 0 |
| Cognitive (SonarJS) | 5 | 2.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 22716260 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 13 |
| Avg Cycle Time | 66.52s |
| Avg Red Phase | 22.61s |
| Avg Green Phase | 26.78s |
| Avg Refactor Phase | 17.13s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 26 |
| Predictions Total | 26 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 13 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


