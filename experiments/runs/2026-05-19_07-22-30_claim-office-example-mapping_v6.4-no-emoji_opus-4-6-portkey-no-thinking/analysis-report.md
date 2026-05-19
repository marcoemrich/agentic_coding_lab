# Analysis Report: 2026-05-19_07-22-30_claim-office-example-mapping_v6.4-no-emoji_opus-4-6-portkey-no-thinking

Generated: 2026-05-19T08:18:52+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.4-no-emoji |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 3380s |
| Started | 2026-05-19T07:22:30+00:00 |
| Ended | 2026-05-19T08:18:52+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 181
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 720
- **Active tests**: 38
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (38 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-19_07-22-30_claim-office-example-mapping_v6.4-no-emoji_opus-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-19_07-22-30_claim-office-example-mapping_v6.4-no-emoji_opus-4-6-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (38 tests) 7ms

 Test Files  1 passed (1)
      Tests  38 passed (38)
   Start at  08:18:52
   Duration  208ms (transform 51ms, setup 0ms, collect 52ms, tests 7ms, environment 0ms, prepare 50ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 64 | ×1 | 64 |
| Invocations | 64 | ×2 | 128 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 11 | ×5 | 55 |
| Assignments | 80 | ×6 | 480 |
| **Total Mass** | | | **767** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 158 |
| Functions | 17 |
| Longest Function | 24 lines |
| Avg LOC/Function | 7.00 |
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
| McCabe (Cyclomatic) | 6 | 1.89 | 0 |
| Cognitive (SonarJS) | 7 | 2.33 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 48820507 |
| Context Utilization | 83% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 38 |
| Avg Cycle Time | 178.34s |
| Avg Red Phase | 30.18s |
| Avg Green Phase | 37.67s |
| Avg Refactor Phase | 110.49s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 76 |
| Predictions Total | 76 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 12 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 18 |


