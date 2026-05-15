# Analysis Report: 2026-05-15_05-48-04_claim-office-example-mapping_v4-exact-subagents_opus-4-7-no-thinking

Generated: 2026-05-15T06:40:55+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4-exact-subagents |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 3170s |
| Started | 2026-05-15T05:48:04+00:00 |
| Ended | 2026-05-15T06:40:55+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 216
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 792
- **Active tests**: 39
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (39 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-15_05-48-04_claim-office-example-mapping_v4-exact-subagents_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-15_05-48-04_claim-office-example-mapping_v4-exact-subagents_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (39 tests) 7ms

 Test Files  1 passed (1)
      Tests  39 passed (39)
   Start at  06:40:55
   Duration  188ms (transform 50ms, setup 0ms, collect 59ms, tests 7ms, environment 0ms, prepare 40ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 91% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 54 | ×1 | 54 |
| Invocations | 86 | ×2 | 172 |
| Conditionals | 9 | ×4 | 36 |
| Loops | 9 | ×5 | 45 |
| Assignments | 63 | ×6 | 378 |
| **Total Mass** | | | **685** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 192 |
| Functions | 17 |
| Longest Function | 23 lines |
| Avg LOC/Function | 8.41 |
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
| McCabe (Cyclomatic) | 8 | 2.05 | 0 |
| Cognitive (SonarJS) | 7 | 2.18 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 13334532 |
| Context Utilization | 15% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 39 |
| Avg Cycle Time | 122.66s |
| Avg Red Phase | 33.62s |
| Avg Green Phase | 39.43s |
| Avg Refactor Phase | 49.61s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 54 |
| Predictions Total | 56 |
| Accuracy | 96% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 10 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 23 |


