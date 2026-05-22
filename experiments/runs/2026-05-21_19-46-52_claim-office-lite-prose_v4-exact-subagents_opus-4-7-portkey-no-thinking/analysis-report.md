# Analysis Report: 2026-05-21_19-46-52_claim-office-lite-prose_v4-exact-subagents_opus-4-7-portkey-no-thinking

Generated: 2026-05-21T20:31:14+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-lite-prose |
| Workflow | v4-exact-subagents |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 2660s |
| Started | 2026-05-21T19:46:52+00:00 |
| Ended | 2026-05-21T20:31:14+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 279
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 491
- **Active tests**: 28
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (28 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-21_19-46-52_claim-office-lite-prose_v4-exact-subagents_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-21_19-46-52_claim-office-lite-prose_v4-exact-subagents_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (28 tests) 6ms

 Test Files  1 passed (1)
      Tests  28 passed (28)
   Start at  20:31:15
   Duration  180ms (transform 38ms, setup 0ms, collect 36ms, tests 6ms, environment 0ms, prepare 45ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 69% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 75 | ×1 | 75 |
| Invocations | 89 | ×2 | 178 |
| Conditionals | 19 | ×4 | 76 |
| Loops | 9 | ×5 | 45 |
| Assignments | 57 | ×6 | 342 |
| **Total Mass** | | | **716** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 231 |
| Functions | 27 |
| Longest Function | 13 lines |
| Avg LOC/Function | 4.96 |
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
| McCabe (Cyclomatic) | 4 | 1.51 | 0 |
| Cognitive (SonarJS) | 3 | 1.31 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 11293496 |
| Context Utilization | 14% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 28 |
| Avg Cycle Time | 94.45s |
| Avg Red Phase | 28.71s |
| Avg Green Phase | 21.35s |
| Avg Refactor Phase | 44.39s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 21 |
| Predictions Total | 24 |
| Accuracy | 87% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 24 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 12 |


