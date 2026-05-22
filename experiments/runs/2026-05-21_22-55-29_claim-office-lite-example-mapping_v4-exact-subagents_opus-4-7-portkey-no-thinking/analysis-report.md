# Analysis Report: 2026-05-21_22-55-29_claim-office-lite-example-mapping_v4-exact-subagents_opus-4-7-portkey-no-thinking

Generated: 2026-05-21T23:36:34+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-lite-example-mapping |
| Workflow | v4-exact-subagents |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 2463s |
| Started | 2026-05-21T22:55:29+00:00 |
| Ended | 2026-05-21T23:36:34+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 182
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 255
- **Active tests**: 42
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (42 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-21_22-55-29_claim-office-lite-example-mapping_v4-exact-subagents_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-21_22-55-29_claim-office-lite-example-mapping_v4-exact-subagents_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (42 tests) 7ms

 Test Files  1 passed (1)
      Tests  42 passed (42)
   Start at  23:36:35
   Duration  180ms (transform 37ms, setup 1ms, collect 39ms, tests 7ms, environment 0ms, prepare 45ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 65% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 62 | ×1 | 62 |
| Invocations | 62 | ×2 | 124 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 10 | ×5 | 50 |
| Assignments | 71 | ×6 | 426 |
| **Total Mass** | | | **710** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 160 |
| Functions | 14 |
| Longest Function | 31 lines |
| Avg LOC/Function | 8.36 |
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
| McCabe (Cyclomatic) | 8 | 2.00 | 0 |
| Cognitive (SonarJS) | 8 | 2.80 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 14012900 |
| Context Utilization | 16% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 42 |
| Avg Cycle Time | 78.40s |
| Avg Red Phase | 24.34s |
| Avg Green Phase | 20.87s |
| Avg Refactor Phase | 33.19s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 46 |
| Predictions Total | 47 |
| Accuracy | 97% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 14 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 22 |


