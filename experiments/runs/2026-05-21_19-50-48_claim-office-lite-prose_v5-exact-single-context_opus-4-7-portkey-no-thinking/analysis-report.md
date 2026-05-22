# Analysis Report: 2026-05-21_19-50-48_claim-office-lite-prose_v5-exact-single-context_opus-4-7-portkey-no-thinking

Generated: 2026-05-21T19:57:51+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-lite-prose |
| Workflow | v5-exact-single-context |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 422s |
| Started | 2026-05-21T19:50:48+00:00 |
| Ended | 2026-05-21T19:57:51+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, quote.ts, scenario.ts
- **Implementation LOC** (total): 205
- **Test file**: cli.spec.ts
- **Test file LOC**: 43
- **Active tests**: 2
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (21 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-21_19-50-48_claim-office-lite-prose_v5-exact-single-context_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-21_19-50-48_claim-office-lite-prose_v5-exact-single-context_opus-4-7-portkey-no-thinking

 ✓ src/quote.spec.ts  (14 tests) 3ms
 ✓ src/claim.spec.ts  (5 tests) 2ms
 ✓ src/cli.spec.ts  (2 tests) 2ms

 Test Files  3 passed (3)
      Tests  21 passed (21)
   Start at  19:57:51
   Duration  444ms (transform 41ms, setup 0ms, collect 59ms, tests 7ms, environment 0ms, prepare 136ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 87% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 53 | ×1 | 53 |
| Invocations | 55 | ×2 | 110 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 7 | ×5 | 35 |
| Assignments | 60 | ×6 | 360 |
| **Total Mass** | | | **606** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 174 |
| Functions | 8 |
| Longest Function | 30 lines |
| Avg LOC/Function | 13.88 |
| Median LOC/Function | 12.50 |
| Imports | 4 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 19 |
| Code Quality | 0 |
| **Total** | **19** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 8 | 2.62 | 0 |
| Cognitive (SonarJS) | 9 | 5.60 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 11258670 |
| Context Utilization | 10% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 3 |
| Avg Cycle Time | 140.79s |
| Avg Red Phase | 106.33s |
| Avg Green Phase | 24.43s |
| Avg Refactor Phase | 10.03s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 6 |
| Predictions Total | 6 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 2 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


