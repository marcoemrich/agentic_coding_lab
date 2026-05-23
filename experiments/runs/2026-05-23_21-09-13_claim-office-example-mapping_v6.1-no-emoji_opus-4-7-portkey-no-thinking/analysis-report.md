# Analysis Report: 2026-05-23_21-09-13_claim-office-example-mapping_v6.1-no-emoji_opus-4-7-portkey-no-thinking

Generated: 2026-05-23T21:42:36+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-no-emoji |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 2000s |
| Started | 2026-05-23T21:09:13+00:00 |
| Ended | 2026-05-23T21:42:36+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 189
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 400
- **Active tests**: 37
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (37 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-23_21-09-13_claim-office-example-mapping_v6.1-no-emoji_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-23_21-09-13_claim-office-example-mapping_v6.1-no-emoji_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (37 tests) 918ms

 Test Files  1 passed (1)
      Tests  37 passed (37)
   Start at  21:42:36
   Duration  1.10s (transform 46ms, setup 0ms, collect 46ms, tests 918ms, environment 0ms, prepare 45ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 86% |
| Branches | 89% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 54 | ×1 | 54 |
| Invocations | 64 | ×2 | 128 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 12 | ×5 | 60 |
| Assignments | 82 | ×6 | 492 |
| **Total Mass** | | | **774** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 161 |
| Functions | 21 |
| Longest Function | 12 lines |
| Avg LOC/Function | 4.90 |
| Median LOC/Function | 4.00 |
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
| McCabe (Cyclomatic) | 4 | 1.59 | 0 |
| Cognitive (SonarJS) | 4 | 1.69 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 40967942 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 28 |
| Avg Cycle Time | 94.67s |
| Avg Red Phase | 24.11s |
| Avg Green Phase | 19.69s |
| Avg Refactor Phase | 50.87s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 52 |
| Predictions Total | 52 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 17 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 8 |


