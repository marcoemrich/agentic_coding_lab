# Analysis Report: 2026-05-18_20-03-29_claim-office-example-mapping_v6.4-no-emoji_opus-4-7-no-thinking

Generated: 2026-05-18T20:24:08+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.4-no-emoji |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 1238s |
| Started | 2026-05-18T20:03:29+00:00 |
| Ended | 2026-05-18T20:24:08+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 221
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 525
- **Active tests**: 32
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (32 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-18_20-03-29_claim-office-example-mapping_v6.4-no-emoji_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-18_20-03-29_claim-office-example-mapping_v6.4-no-emoji_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (32 tests) 342ms

 Test Files  1 passed (1)
      Tests  32 passed (32)
   Start at  20:24:09
   Duration  510ms (transform 41ms, setup 0ms, collect 42ms, tests 342ms, environment 0ms, prepare 41ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 67 | ×1 | 67 |
| Invocations | 74 | ×2 | 148 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 10 | ×5 | 50 |
| Assignments | 90 | ×6 | 540 |
| **Total Mass** | | | **857** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 186 |
| Functions | 20 |
| Longest Function | 20 lines |
| Avg LOC/Function | 6.35 |
| Median LOC/Function | 6.00 |
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
| McCabe (Cyclomatic) | 3 | 1.81 | 0 |
| Cognitive (SonarJS) | 3 | 1.75 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 26121026 |
| Context Utilization | 16% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 13 |
| Avg Cycle Time | 122.85s |
| Avg Red Phase | 52.31s |
| Avg Green Phase | 21.28s |
| Avg Refactor Phase | 49.26s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 26 |
| Predictions Total | 26 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 6 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 3 |


