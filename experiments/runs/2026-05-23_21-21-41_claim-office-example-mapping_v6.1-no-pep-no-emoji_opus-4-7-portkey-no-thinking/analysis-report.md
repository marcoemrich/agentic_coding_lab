# Analysis Report: 2026-05-23_21-21-41_claim-office-example-mapping_v6.1-no-pep-no-emoji_opus-4-7-portkey-no-thinking

Generated: 2026-05-23T21:49:23+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-no-pep-no-emoji |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 1660s |
| Started | 2026-05-23T21:21:41+00:00 |
| Ended | 2026-05-23T21:49:23+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 277
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 522
- **Active tests**: 36
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (36 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-23_21-21-41_claim-office-example-mapping_v6.1-no-pep-no-emoji_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-23_21-21-41_claim-office-example-mapping_v6.1-no-pep-no-emoji_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (36 tests) 1757ms

 Test Files  1 passed (1)
      Tests  36 passed (36)
   Start at  21:49:24
   Duration  1.95s (transform 45ms, setup 0ms, collect 46ms, tests 1.76s, environment 0ms, prepare 48ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 89% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 57 | ×1 | 57 |
| Invocations | 88 | ×2 | 176 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 12 | ×5 | 60 |
| Assignments | 101 | ×6 | 606 |
| **Total Mass** | | | **955** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 230 |
| Functions | 25 |
| Longest Function | 11 lines |
| Avg LOC/Function | 4.92 |
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
| McCabe (Cyclomatic) | 4 | 1.58 | 0 |
| Cognitive (SonarJS) | 4 | 1.80 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 38731391 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 37 |
| Avg Cycle Time | 91.55s |
| Avg Red Phase | 19.41s |
| Avg Green Phase | 19.7s |
| Avg Refactor Phase | 52.44s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 57 |
| Predictions Total | 58 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 10 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 18 |


