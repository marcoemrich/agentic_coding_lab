# Analysis Report: 2026-05-21_22-55-29_claim-office-lite-example-mapping_v4.2-shared-context_opus-4-7-portkey-no-thinking

Generated: 2026-05-22T00:12:24+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-lite-example-mapping |
| Workflow | v4.2-shared-context |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 4612s |
| Started | 2026-05-21T22:55:29+00:00 |
| Ended | 2026-05-22T00:12:23+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 261
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 709
- **Active tests**: 34
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (34 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-21_22-55-29_claim-office-lite-example-mapping_v4.2-shared-context_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-21_22-55-29_claim-office-lite-example-mapping_v4.2-shared-context_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (34 tests) 2452ms

 Test Files  1 passed (1)
      Tests  34 passed (34)
   Start at  00:12:24
   Duration  2.62s (transform 45ms, setup 0ms, collect 46ms, tests 2.45s, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 81% |
| Branches | 89% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 61 | ×1 | 61 |
| Invocations | 80 | ×2 | 160 |
| Conditionals | 9 | ×4 | 36 |
| Loops | 12 | ×5 | 60 |
| Assignments | 49 | ×6 | 294 |
| **Total Mass** | | | **611** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 201 |
| Functions | 17 |
| Longest Function | 19 lines |
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
| McCabe (Cyclomatic) | 5 | 1.59 | 0 |
| Cognitive (SonarJS) | 6 | 2.22 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 11276553 |
| Context Utilization | 13% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 34 |
| Avg Cycle Time | 174.39s |
| Avg Red Phase | 60.3s |
| Avg Green Phase | 44.13s |
| Avg Refactor Phase | 69.96s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 45 |
| Predictions Total | 45 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 18 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 16 |


