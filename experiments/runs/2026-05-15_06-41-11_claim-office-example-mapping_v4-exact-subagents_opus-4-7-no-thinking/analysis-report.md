# Analysis Report: 2026-05-15_06-41-11_claim-office-example-mapping_v4-exact-subagents_opus-4-7-no-thinking

Generated: 2026-05-15T07:08:32+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4-exact-subagents |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 1640s |
| Started | 2026-05-15T06:41:11+00:00 |
| Ended | 2026-05-15T07:08:32+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 268
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 374
- **Active tests**: 36
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (36 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-15_06-41-11_claim-office-example-mapping_v4-exact-subagents_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-15_06-41-11_claim-office-example-mapping_v4-exact-subagents_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (36 tests) 5ms

 Test Files  1 passed (1)
      Tests  36 passed (36)
   Start at  07:08:33
   Duration  162ms (transform 37ms, setup 0ms, collect 36ms, tests 5ms, environment 0ms, prepare 41ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 40% |
| Branches | 87% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 86 | ×1 | 86 |
| Invocations | 80 | ×2 | 160 |
| Conditionals | 27 | ×4 | 108 |
| Loops | 10 | ×5 | 50 |
| Assignments | 88 | ×6 | 528 |
| **Total Mass** | | | **932** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 240 |
| Functions | 7 |
| Longest Function | 76 lines |
| Avg LOC/Function | 20.71 |
| Median LOC/Function | 11.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 5 |
| Duplication | 0 |
| Magic Numbers | 5 |
| Code Quality | 0 |
| **Total** | **10** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 14 | 3.53 | 2 |
| Cognitive (SonarJS) | 26 | 8.71 | 2 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 9411553 |
| Context Utilization | 12% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 16 |
| Avg Cycle Time | 96.63s |
| Avg Red Phase | 41.11s |
| Avg Green Phase | 28.01s |
| Avg Refactor Phase | 27.51s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 16 |
| Predictions Total | 18 |
| Accuracy | 88% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 3 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 6 |


