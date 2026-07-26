# Analysis Report: 2026-07-26_00-13-47_claim-office-example-mapping_v4-exact-subagents_opus-5-no-thinking-2

Generated: 2026-07-26T01:24:25+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4-exact-subagents |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 4236s |
| Started | 2026-07-26T00:13:47+00:00 |
| Ended | 2026-07-26T01:24:25+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 326
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 850
- **Active tests**: 43
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (49 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-26_00-13-47_claim-office-example-mapping_v4-exact-subagents_opus-5-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-26_00-13-47_claim-office-example-mapping_v4-exact-subagents_opus-5-no-thinking-2

 ✓ src/claim-office.spec.ts  (43 tests) 9ms
 ✓ src/cli.spec.ts  (6 tests) 1738ms

 Test Files  2 passed (2)
      Tests  49 passed (49)
   Start at  01:24:25
   Duration  2.08s (transform 56ms, setup 0ms, collect 62ms, tests 1.75s, environment 0ms, prepare 93ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 94% |
| Branches | 91% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 57 | ×1 | 57 |
| Invocations | 71 | ×2 | 142 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 13 | ×5 | 65 |
| Assignments | 82 | ×6 | 492 |
| **Total Mass** | | | **808** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 245 |
| Functions | 25 |
| Longest Function | 11 lines |
| Avg LOC/Function | 4.04 |
| Median LOC/Function | 2.00 |
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
| McCabe (Cyclomatic) | 6 | 1.84 | 0 |
| Cognitive (SonarJS) | 4 | 1.86 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 14843065 |
| Context Utilization | 80% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 44 |
| Avg Cycle Time | 152.42s |
| Avg Red Phase | 41.52s |
| Avg Green Phase | 26.5s |
| Avg Refactor Phase | 84.4s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 92 |
| Predictions Total | 93 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 12 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 18 |


