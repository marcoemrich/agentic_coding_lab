# Analysis Report: 2026-05-21_19-46-51_claim-office-lite-prose_v4-exact-subagents_opus-4-7-portkey-no-thinking

Generated: 2026-05-21T20:29:22+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-lite-prose |
| Workflow | v4-exact-subagents |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 2549s |
| Started | 2026-05-21T19:46:51+00:00 |
| Ended | 2026-05-21T20:29:22+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 157
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 381
- **Active tests**: 33
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (33 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-21_19-46-51_claim-office-lite-prose_v4-exact-subagents_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-21_19-46-51_claim-office-lite-prose_v4-exact-subagents_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (33 tests) 5ms

 Test Files  1 passed (1)
      Tests  33 passed (33)
   Start at  20:29:23
   Duration  167ms (transform 37ms, setup 0ms, collect 36ms, tests 5ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 88% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 49 | ×1 | 49 |
| Invocations | 56 | ×2 | 112 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 4 | ×5 | 20 |
| Assignments | 44 | ×6 | 264 |
| **Total Mass** | | | **485** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 134 |
| Functions | 18 |
| Longest Function | 16 lines |
| Avg LOC/Function | 4.78 |
| Median LOC/Function | 3.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 3 |
| Code Quality | 0 |
| **Total** | **3** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 3 | 1.56 | 0 |
| Cognitive (SonarJS) | 2 | 1.18 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 18816946 |
| Context Utilization | 15% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 33 |
| Avg Cycle Time | 83.71s |
| Avg Red Phase | 26.35s |
| Avg Green Phase | 20.09s |
| Avg Refactor Phase | 37.27s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 35 |
| Predictions Total | 38 |
| Accuracy | 92% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 20 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 13 |


