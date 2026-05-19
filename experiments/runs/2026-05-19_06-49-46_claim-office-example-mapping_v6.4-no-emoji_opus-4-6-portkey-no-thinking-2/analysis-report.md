# Analysis Report: 2026-05-19_06-49-46_claim-office-example-mapping_v6.4-no-emoji_opus-4-6-portkey-no-thinking-2

Generated: 2026-05-19T07:21:02+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.4-no-emoji |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 1874s |
| Started | 2026-05-19T06:49:46+00:00 |
| Ended | 2026-05-19T07:21:02+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 108
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 312
- **Active tests**: 19
- **Remaining todos**: 16

## Test Results

**Status**: ✅ All tests passing (19 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-19_06-49-46_claim-office-example-mapping_v6.4-no-emoji_opus-4-6-portkey-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-19_06-49-46_claim-office-example-mapping_v6.4-no-emoji_opus-4-6-portkey-no-thinking-2

 ✓ src/claim-office.spec.ts  (35 tests | 16 skipped) 5ms

 Test Files  1 passed (1)
      Tests  19 passed | 16 todo (35)
   Start at  07:21:03
   Duration  193ms (transform 41ms, setup 0ms, collect 40ms, tests 5ms, environment 0ms, prepare 50ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 36 | ×1 | 36 |
| Invocations | 18 | ×2 | 36 |
| Conditionals | 5 | ×4 | 20 |
| Loops | 3 | ×5 | 15 |
| Assignments | 35 | ×6 | 210 |
| **Total Mass** | | | **317** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 90 |
| Functions | 3 |
| Longest Function | 36 lines |
| Avg LOC/Function | 15.67 |
| Median LOC/Function | 9.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 2 |
| Code Quality | 0 |
| **Total** | **3** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 7 | 2.50 | 0 |
| Cognitive (SonarJS) | 8 | 3.67 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 380203 |
| Context Utilization | 20% |

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


