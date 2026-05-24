# Analysis Report: 2026-05-24_09-25-27_claim-office-example-mapping_v6.2-with-why-cleaned_opus-4-7-portkey-no-thinking

Generated: 2026-05-24T10:02:03+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 2194s |
| Started | 2026-05-24T09:25:27+00:00 |
| Ended | 2026-05-24T10:02:03+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 201
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 396
- **Active tests**: 36
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (36 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-24_09-25-27_claim-office-example-mapping_v6.2-with-why-cleaned_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-24_09-25-27_claim-office-example-mapping_v6.2-with-why-cleaned_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (36 tests) 1867ms

 Test Files  1 passed (1)
      Tests  36 passed (36)
   Start at  10:02:04
   Duration  2.04s (transform 42ms, setup 0ms, collect 43ms, tests 1.87s, environment 0ms, prepare 43ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 86% |
| Branches | 89% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 52 | ×1 | 52 |
| Invocations | 77 | ×2 | 154 |
| Conditionals | 8 | ×4 | 32 |
| Loops | 11 | ×5 | 55 |
| Assignments | 84 | ×6 | 504 |
| **Total Mass** | | | **797** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 166 |
| Functions | 27 |
| Longest Function | 13 lines |
| Avg LOC/Function | 4.22 |
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
| McCabe (Cyclomatic) | 5 | 1.49 | 0 |
| Cognitive (SonarJS) | 5 | 1.75 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 41391509 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 37 |
| Avg Cycle Time | 87.73s |
| Avg Red Phase | 23.11s |
| Avg Green Phase | 17.79s |
| Avg Refactor Phase | 46.83s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 65 |
| Predictions Total | 72 |
| Accuracy | 90% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 20 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 17 |


