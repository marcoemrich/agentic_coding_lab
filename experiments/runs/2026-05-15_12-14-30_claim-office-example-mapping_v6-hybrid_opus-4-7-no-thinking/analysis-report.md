# Analysis Report: 2026-05-15_12-14-30_claim-office-example-mapping_v6-hybrid_opus-4-7-no-thinking

Generated: 2026-05-15T12:50:59+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6-hybrid |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 2187s |
| Started | 2026-05-15T12:14:30+00:00 |
| Ended | 2026-05-15T12:50:59+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 199
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 527
- **Active tests**: 34
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (34 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-15_12-14-30_claim-office-example-mapping_v6-hybrid_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-15_12-14-30_claim-office-example-mapping_v6-hybrid_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (34 tests) 1693ms

 Test Files  1 passed (1)
      Tests  34 passed (34)
   Start at  12:51:00
   Duration  1.86s (transform 41ms, setup 0ms, collect 41ms, tests 1.69s, environment 0ms, prepare 41ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 59% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 69 | ×1 | 69 |
| Invocations | 74 | ×2 | 148 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 10 | ×5 | 50 |
| Assignments | 98 | ×6 | 588 |
| **Total Mass** | | | **923** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 163 |
| Functions | 19 |
| Longest Function | 21 lines |
| Avg LOC/Function | 6.16 |
| Median LOC/Function | 5.00 |
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
| McCabe (Cyclomatic) | 6 | 1.82 | 0 |
| Cognitive (SonarJS) | 6 | 1.87 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 38122954 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 32 |
| Avg Cycle Time | 112.28s |
| Avg Red Phase | 27.16s |
| Avg Green Phase | 27.31s |
| Avg Refactor Phase | 57.81s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 33 |
| Predictions Total | 34 |
| Accuracy | 97% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 13 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 13 |


