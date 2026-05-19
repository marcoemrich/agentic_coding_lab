# Analysis Report: 2026-05-19_07-49-13_claim-office-example-mapping_v6.4-no-emoji_opus-4-6-portkey-no-thinking

Generated: 2026-05-19T08:23:11+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.4-no-emoji |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 2036s |
| Started | 2026-05-19T07:49:13+00:00 |
| Ended | 2026-05-19T08:23:11+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 113
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 277
- **Active tests**: 15
- **Remaining todos**: 18

## Test Results

**Status**: ✅ All tests passing (15 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-19_07-49-13_claim-office-example-mapping_v6.4-no-emoji_opus-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-19_07-49-13_claim-office-example-mapping_v6.4-no-emoji_opus-4-6-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (33 tests | 18 skipped) 4ms

 Test Files  1 passed (1)
      Tests  15 passed | 18 todo (33)
   Start at  08:23:11
   Duration  193ms (transform 40ms, setup 0ms, collect 38ms, tests 4ms, environment 0ms, prepare 52ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 85% |
| Branches | 88% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 39 | ×1 | 39 |
| Invocations | 33 | ×2 | 66 |
| Conditionals | 9 | ×4 | 36 |
| Loops | 5 | ×5 | 25 |
| Assignments | 33 | ×6 | 198 |
| **Total Mass** | | | **364** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 92 |
| Functions | 7 |
| Longest Function | 28 lines |
| Avg LOC/Function | 7.43 |
| Median LOC/Function | 3.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 6 |
| Code Quality | 0 |
| **Total** | **6** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 4 | 1.85 | 0 |
| Cognitive (SonarJS) | 4 | 2.17 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 412121 |
| Context Utilization | 19% |

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


