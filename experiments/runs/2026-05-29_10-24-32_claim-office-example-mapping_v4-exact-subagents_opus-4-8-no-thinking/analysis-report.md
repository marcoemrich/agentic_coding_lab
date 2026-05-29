# Analysis Report: 2026-05-29_10-24-32_claim-office-example-mapping_v4-exact-subagents_opus-4-8-no-thinking

Generated: 2026-05-29T12:05:26+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4-exact-subagents |
| Model | opus-4-8-no-thinking |
| Model Version(s) | claude-opus-4-8 |
| Thinking | unknown |
| Duration | 6053s |
| Started | 2026-05-29T10:24:32+00:00 |
| Ended | 2026-05-29T12:05:26+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 253
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 644
- **Active tests**: 43
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (52 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-29_10-24-32_claim-office-example-mapping_v4-exact-subagents_opus-4-8-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-29_10-24-32_claim-office-example-mapping_v4-exact-subagents_opus-4-8-no-thinking

 ✓ src/claim-office.spec.ts  (43 tests) 9ms
 ✓ src/cli.spec.ts  (9 tests) 3516ms

 Test Files  2 passed (2)
      Tests  52 passed (52)
   Start at  12:05:27
   Duration  3.87s (transform 58ms, setup 0ms, collect 66ms, tests 3.52s, environment 0ms, prepare 106ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 84% |
| Branches | 91% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 62 | ×1 | 62 |
| Invocations | 92 | ×2 | 184 |
| Conditionals | 18 | ×4 | 72 |
| Loops | 13 | ×5 | 65 |
| Assignments | 59 | ×6 | 354 |
| **Total Mass** | | | **737** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 220 |
| Functions | 23 |
| Longest Function | 16 lines |
| Avg LOC/Function | 6.52 |
| Median LOC/Function | 6.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 2 |
| Code Quality | 0 |
| **Total** | **2** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 6 | 1.88 | 0 |
| Cognitive (SonarJS) | 7 | 2.17 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 35906244 |
| Context Utilization | 118% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 52 |
| Avg Cycle Time | 129.82s |
| Avg Red Phase | 52.67s |
| Avg Green Phase | 26.83s |
| Avg Refactor Phase | 50.32s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 99 |
| Predictions Total | 105 |
| Accuracy | 94% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 28 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 24 |


