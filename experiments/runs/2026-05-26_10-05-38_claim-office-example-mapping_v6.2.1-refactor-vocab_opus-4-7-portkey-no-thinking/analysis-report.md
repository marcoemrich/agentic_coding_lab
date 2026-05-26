# Analysis Report: 2026-05-26_10-05-38_claim-office-example-mapping_v6.2.1-refactor-vocab_opus-4-7-portkey-no-thinking

Generated: 2026-05-26T10:30:06+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2.1-refactor-vocab |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 1467s |
| Started | 2026-05-26T10:05:38+00:00 |
| Ended | 2026-05-26T10:30:06+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 129
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 269
- **Active tests**: 22
- **Remaining todos**: 19

## Test Results

**Status**: ✅ All tests passing (22 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-26_10-05-38_claim-office-example-mapping_v6.2.1-refactor-vocab_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-26_10-05-38_claim-office-example-mapping_v6.2.1-refactor-vocab_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (41 tests | 19 skipped) 6ms

 Test Files  1 passed (1)
      Tests  22 passed | 19 todo (41)
   Start at  10:30:07
   Duration  194ms (transform 36ms, setup 0ms, collect 34ms, tests 6ms, environment 0ms, prepare 53ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 82% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 38 | ×1 | 38 |
| Invocations | 43 | ×2 | 86 |
| Conditionals | 9 | ×4 | 36 |
| Loops | 5 | ×5 | 25 |
| Assignments | 45 | ×6 | 270 |
| **Total Mass** | | | **455** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 103 |
| Functions | 19 |
| Longest Function | 8 lines |
| Avg LOC/Function | 3.26 |
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
| McCabe (Cyclomatic) | 3 | 1.57 | 0 |
| Cognitive (SonarJS) | 2 | 1.18 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 26787602 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 22 |
| Avg Cycle Time | 80.54s |
| Avg Red Phase | 18.16s |
| Avg Green Phase | 21.8s |
| Avg Refactor Phase | 40.58s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 43 |
| Predictions Total | 44 |
| Accuracy | 97% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 16 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 6 |


