# Analysis Report: 2026-05-18_19-27-24_claim-office-example-mapping_v6.4-no-emoji_opus-4-7-no-thinking

Generated: 2026-05-18T20:03:13+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.4-no-emoji |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 2148s |
| Started | 2026-05-18T19:27:24+00:00 |
| Ended | 2026-05-18T20:03:13+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 242
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 199
- **Active tests**: 29
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (29 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-18_19-27-24_claim-office-example-mapping_v6.4-no-emoji_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-18_19-27-24_claim-office-example-mapping_v6.4-no-emoji_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (29 tests) 5ms

 Test Files  1 passed (1)
      Tests  29 passed (29)
   Start at  20:03:13
   Duration  162ms (transform 34ms, setup 0ms, collect 33ms, tests 5ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 58 | ×1 | 58 |
| Invocations | 80 | ×2 | 160 |
| Conditionals | 9 | ×4 | 36 |
| Loops | 9 | ×5 | 45 |
| Assignments | 97 | ×6 | 582 |
| **Total Mass** | | | **881** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 205 |
| Functions | 29 |
| Longest Function | 12 lines |
| Avg LOC/Function | 3.72 |
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
| McCabe (Cyclomatic) | 4 | 1.64 | 0 |
| Cognitive (SonarJS) | 4 | 1.53 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 34131385 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 29 |
| Avg Cycle Time | 112.22s |
| Avg Red Phase | 23.38s |
| Avg Green Phase | 28.11s |
| Avg Refactor Phase | 60.73s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 48 |
| Predictions Total | 50 |
| Accuracy | 96% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 15 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 11 |


