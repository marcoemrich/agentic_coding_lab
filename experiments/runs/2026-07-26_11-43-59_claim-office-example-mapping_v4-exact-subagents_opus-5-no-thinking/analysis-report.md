# Analysis Report: 2026-07-26_11-43-59_claim-office-example-mapping_v4-exact-subagents_opus-5-no-thinking

Generated: 2026-07-26T13:44:01+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4-exact-subagents |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 7201s |
| Started | 2026-07-26T11:43:59+00:00 |
| Ended | 2026-07-26T13:44:01+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 509
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 950
- **Active tests**: 51
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (57 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-26_11-43-59_claim-office-example-mapping_v4-exact-subagents_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-26_11-43-59_claim-office-example-mapping_v4-exact-subagents_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (51 tests) 10ms
 ✓ src/cli.spec.ts  (6 tests) 4ms

 Test Files  2 passed (2)
      Tests  57 passed (57)
   Start at  13:44:02
   Duration  637ms (transform 125ms, setup 0ms, collect 194ms, tests 14ms, environment 0ms, prepare 145ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 97% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 54 | ×1 | 54 |
| Invocations | 111 | ×2 | 222 |
| Conditionals | 18 | ×4 | 72 |
| Loops | 10 | ×5 | 50 |
| Assignments | 123 | ×6 | 738 |
| **Total Mass** | | | **1136** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 370 |
| Functions | 49 |
| Longest Function | 24 lines |
| Avg LOC/Function | 3.00 |
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
| McCabe (Cyclomatic) | 3 | 1.32 | 0 |
| Cognitive (SonarJS) | 2 | 1.05 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 36565909 |
| Context Utilization | 133% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 57 |
| Avg Cycle Time | 121.24s |
| Avg Red Phase | 39.01s |
| Avg Green Phase | 24.75s |
| Avg Refactor Phase | 57.48s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 110 |
| Predictions Total | 115 |
| Accuracy | 95% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 54 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 28 |


