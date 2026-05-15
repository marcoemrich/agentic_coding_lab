# Analysis Report: 2026-05-15_04-46-00_claim-office-example-mapping_v4-exact-subagents_opus-4-7-no-thinking

Generated: 2026-05-15T05:47:45+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4-exact-subagents |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 3704s |
| Started | 2026-05-15T04:46:00+00:00 |
| Ended | 2026-05-15T05:47:45+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 232
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 387
- **Active tests**: 35
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (35 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-15_04-46-00_claim-office-example-mapping_v4-exact-subagents_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-15_04-46-00_claim-office-example-mapping_v4-exact-subagents_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (35 tests) 1662ms

 Test Files  1 passed (1)
      Tests  35 passed (35)
   Start at  05:47:45
   Duration  1.85s (transform 41ms, setup 0ms, collect 41ms, tests 1.66s, environment 0ms, prepare 54ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 79% |
| Branches | 81% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 65 | ×1 | 65 |
| Invocations | 96 | ×2 | 192 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 8 | ×5 | 40 |
| Assignments | 61 | ×6 | 366 |
| **Total Mass** | | | **727** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 197 |
| Functions | 21 |
| Longest Function | 19 lines |
| Avg LOC/Function | 6.29 |
| Median LOC/Function | 6.00 |
| Imports | 2 |

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
| McCabe (Cyclomatic) | 6 | 2.07 | 0 |
| Cognitive (SonarJS) | 4 | 2.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 12824031 |
| Context Utilization | 16% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 35 |
| Avg Cycle Time | 112.03s |
| Avg Red Phase | 35.18s |
| Avg Green Phase | 27.88s |
| Avg Refactor Phase | 48.97s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 42 |
| Predictions Total | 43 |
| Accuracy | 97% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 23 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 12 |


