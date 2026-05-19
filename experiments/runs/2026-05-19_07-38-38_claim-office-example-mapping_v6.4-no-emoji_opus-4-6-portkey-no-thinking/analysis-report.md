# Analysis Report: 2026-05-19_07-38-38_claim-office-example-mapping_v6.4-no-emoji_opus-4-6-portkey-no-thinking

Generated: 2026-05-19T08:22:57+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.4-no-emoji |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 2657s |
| Started | 2026-05-19T07:38:38+00:00 |
| Ended | 2026-05-19T08:22:57+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 136
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 461
- **Active tests**: 25
- **Remaining todos**: 10

## Test Results

**Status**: ✅ All tests passing (25 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-19_07-38-38_claim-office-example-mapping_v6.4-no-emoji_opus-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-19_07-38-38_claim-office-example-mapping_v6.4-no-emoji_opus-4-6-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (35 tests | 10 skipped) 5ms

 Test Files  1 passed (1)
      Tests  25 passed | 10 todo (35)
   Start at  08:22:58
   Duration  201ms (transform 50ms, setup 0ms, collect 49ms, tests 5ms, environment 0ms, prepare 48ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 86% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 47 | ×1 | 47 |
| Invocations | 40 | ×2 | 80 |
| Conditionals | 8 | ×4 | 32 |
| Loops | 7 | ×5 | 35 |
| Assignments | 54 | ×6 | 324 |
| **Total Mass** | | | **518** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 121 |
| Functions | 11 |
| Longest Function | 17 lines |
| Avg LOC/Function | 7.73 |
| Median LOC/Function | 7.00 |
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
| McCabe (Cyclomatic) | 4 | 2.00 | 0 |
| Cognitive (SonarJS) | 4 | 2.33 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 507426 |
| Context Utilization | 21% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 0 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 0 |
| Predictions Total | 0 |
| Accuracy | N/A |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


