# Analysis Report: 2026-05-23_21-23-48_claim-office-example-mapping_v6.1-no-pep-no-emoji_opus-4-7-portkey-no-thinking

Generated: 2026-05-23T21:58:53+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-no-pep-no-emoji |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 2104s |
| Started | 2026-05-23T21:23:48+00:00 |
| Ended | 2026-05-23T21:58:53+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 246
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 586
- **Active tests**: 38
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (38 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-23_21-23-48_claim-office-example-mapping_v6.1-no-pep-no-emoji_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-23_21-23-48_claim-office-example-mapping_v6.1-no-pep-no-emoji_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (38 tests) 129ms

 Test Files  1 passed (1)
      Tests  38 passed (38)
   Start at  21:58:54
   Duration  319ms (transform 52ms, setup 0ms, collect 51ms, tests 129ms, environment 0ms, prepare 47ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 95% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 66 | ×1 | 66 |
| Invocations | 67 | ×2 | 134 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 10 | ×5 | 50 |
| Assignments | 88 | ×6 | 528 |
| **Total Mass** | | | **834** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 204 |
| Functions | 22 |
| Longest Function | 15 lines |
| Avg LOC/Function | 4.82 |
| Median LOC/Function | 2.00 |
| Imports | 2 |

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
| McCabe (Cyclomatic) | 5 | 1.77 | 0 |
| Cognitive (SonarJS) | 6 | 1.86 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 42994428 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 39 |
| Avg Cycle Time | 89.79s |
| Avg Red Phase | 21.5s |
| Avg Green Phase | 19.67s |
| Avg Refactor Phase | 48.62s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 75 |
| Predictions Total | 76 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 17 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 19 |


