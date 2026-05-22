# Analysis Report: 2026-05-21_20-31-29_claim-office-lite-prose_v6-hybrid_opus-4-7-portkey-no-thinking

Generated: 2026-05-21T20:47:23+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-lite-prose |
| Workflow | v6-hybrid |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 953s |
| Started | 2026-05-21T20:31:29+00:00 |
| Ended | 2026-05-21T20:47:23+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 129
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 215
- **Active tests**: 16
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (16 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-21_20-31-29_claim-office-lite-prose_v6-hybrid_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-21_20-31-29_claim-office-lite-prose_v6-hybrid_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (16 tests) 5ms

 Test Files  1 passed (1)
      Tests  16 passed (16)
   Start at  20:47:24
   Duration  168ms (transform 33ms, setup 0ms, collect 31ms, tests 5ms, environment 0ms, prepare 46ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 90% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 50 | ×1 | 50 |
| Invocations | 47 | ×2 | 94 |
| Conditionals | 9 | ×4 | 36 |
| Loops | 6 | ×5 | 30 |
| Assignments | 53 | ×6 | 318 |
| **Total Mass** | | | **528** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 106 |
| Functions | 15 |
| Longest Function | 12 lines |
| Avg LOC/Function | 4.80 |
| Median LOC/Function | 4.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 4 |
| Code Quality | 0 |
| **Total** | **4** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 5 | 1.80 | 0 |
| Cognitive (SonarJS) | 3 | 1.44 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 21880454 |
| Context Utilization | 16% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 16 |
| Avg Cycle Time | 84.28s |
| Avg Red Phase | 19.05s |
| Avg Green Phase | 19.6s |
| Avg Refactor Phase | 45.63s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 32 |
| Predictions Total | 32 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 8 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 3 |


