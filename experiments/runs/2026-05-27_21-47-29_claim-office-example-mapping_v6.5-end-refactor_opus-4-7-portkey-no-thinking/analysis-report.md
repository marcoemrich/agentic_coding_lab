# Analysis Report: 2026-05-27_21-47-29_claim-office-example-mapping_v6.5-end-refactor_opus-4-7-portkey-no-thinking

Generated: 2026-05-27T22:25:06+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.5-end-refactor |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 2255s |
| Started | 2026-05-27T21:47:29+00:00 |
| Ended | 2026-05-27T22:25:05+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 219
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 523
- **Active tests**: 37
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (37 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-27_21-47-29_claim-office-example-mapping_v6.5-end-refactor_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-27_21-47-29_claim-office-example-mapping_v6.5-end-refactor_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (37 tests) 6ms

 Test Files  1 passed (1)
      Tests  37 passed (37)
   Start at  22:25:06
   Duration  171ms (transform 40ms, setup 0ms, collect 41ms, tests 6ms, environment 0ms, prepare 41ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 57 | ×1 | 57 |
| Invocations | 66 | ×2 | 132 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 9 | ×5 | 45 |
| Assignments | 82 | ×6 | 492 |
| **Total Mass** | | | **766** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 188 |
| Functions | 24 |
| Longest Function | 11 lines |
| Avg LOC/Function | 4.08 |
| Median LOC/Function | 2.00 |
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
| McCabe (Cyclomatic) | 4 | 1.54 | 0 |
| Cognitive (SonarJS) | 4 | 1.75 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 44365852 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 37 |
| Avg Cycle Time | 92.24s |
| Avg Red Phase | 18.35s |
| Avg Green Phase | 23.05s |
| Avg Refactor Phase | 50.84s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 54 |
| Predictions Total | 58 |
| Accuracy | 93% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 19 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 18 |


