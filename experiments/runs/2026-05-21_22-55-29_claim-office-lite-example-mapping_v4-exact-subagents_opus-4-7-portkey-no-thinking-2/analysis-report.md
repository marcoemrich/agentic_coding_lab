# Analysis Report: 2026-05-21_22-55-29_claim-office-lite-example-mapping_v4-exact-subagents_opus-4-7-portkey-no-thinking-2

Generated: 2026-05-21T23:28:48+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-lite-example-mapping |
| Workflow | v4-exact-subagents |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 1997s |
| Started | 2026-05-21T22:55:29+00:00 |
| Ended | 2026-05-21T23:28:48+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 153
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 272
- **Active tests**: 38
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (38 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-21_22-55-29_claim-office-lite-example-mapping_v4-exact-subagents_opus-4-7-portkey-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-21_22-55-29_claim-office-lite-example-mapping_v4-exact-subagents_opus-4-7-portkey-no-thinking-2

 ✓ src/claim-office.spec.ts  (38 tests) 7ms

 Test Files  1 passed (1)
      Tests  38 passed (38)
   Start at  23:28:49
   Duration  184ms (transform 44ms, setup 0ms, collect 43ms, tests 7ms, environment 0ms, prepare 45ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 83% |
| Branches | 82% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 52 | ×1 | 52 |
| Invocations | 56 | ×2 | 112 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 7 | ×5 | 35 |
| Assignments | 51 | ×6 | 306 |
| **Total Mass** | | | **565** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 143 |
| Functions | 5 |
| Longest Function | 31 lines |
| Avg LOC/Function | 14.40 |
| Median LOC/Function | 12.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 4 |
| Duplication | 0 |
| Magic Numbers | 12 |
| Code Quality | 0 |
| **Total** | **16** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 14 | 5.43 | 1 |
| Cognitive (SonarJS) | 20 | 8.40 | 2 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 13507672 |
| Context Utilization | 15% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 38 |
| Avg Cycle Time | 71.53s |
| Avg Red Phase | 24.72s |
| Avg Green Phase | 19.02s |
| Avg Refactor Phase | 27.79s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 38 |
| Predictions Total | 42 |
| Accuracy | 90% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 4 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 17 |


