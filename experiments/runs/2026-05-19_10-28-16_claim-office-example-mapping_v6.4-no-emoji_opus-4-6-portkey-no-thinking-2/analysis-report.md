# Analysis Report: 2026-05-19_10-28-16_claim-office-example-mapping_v6.4-no-emoji_opus-4-6-portkey-no-thinking-2

Generated: 2026-05-19T11:28:30+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.4-no-emoji |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 3612s |
| Started | 2026-05-19T10:28:16+00:00 |
| Ended | 2026-05-19T11:28:30+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 166
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 701
- **Active tests**: 34
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (34 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-19_10-28-16_claim-office-example-mapping_v6.4-no-emoji_opus-4-6-portkey-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-19_10-28-16_claim-office-example-mapping_v6.4-no-emoji_opus-4-6-portkey-no-thinking-2

 ✓ src/claim-office.spec.ts  (34 tests) 7ms

 Test Files  1 passed (1)
      Tests  34 passed (34)
   Start at  11:28:30
   Duration  214ms (transform 49ms, setup 0ms, collect 55ms, tests 7ms, environment 0ms, prepare 52ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 59 | ×1 | 59 |
| Invocations | 60 | ×2 | 120 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 10 | ×5 | 50 |
| Assignments | 60 | ×6 | 360 |
| **Total Mass** | | | **637** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 149 |
| Functions | 10 |
| Longest Function | 21 lines |
| Avg LOC/Function | 10.20 |
| Median LOC/Function | 7.50 |
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
| McCabe (Cyclomatic) | 6 | 2.50 | 0 |
| Cognitive (SonarJS) | 8 | 3.22 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 45713511 |
| Context Utilization | 83% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 34 |
| Avg Cycle Time | 175.37s |
| Avg Red Phase | 30.62s |
| Avg Green Phase | 36.25s |
| Avg Refactor Phase | 108.5s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 68 |
| Predictions Total | 68 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 16 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 15 |


