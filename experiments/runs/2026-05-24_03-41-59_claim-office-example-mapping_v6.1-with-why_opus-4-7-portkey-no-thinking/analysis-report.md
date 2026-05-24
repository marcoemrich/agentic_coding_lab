# Analysis Report: 2026-05-24_03-41-59_claim-office-example-mapping_v6.1-with-why_opus-4-7-portkey-no-thinking

Generated: 2026-05-24T04:20:56+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-with-why |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 2336s |
| Started | 2026-05-24T03:41:59+00:00 |
| Ended | 2026-05-24T04:20:56+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 232
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 563
- **Active tests**: 41
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (41 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-24_03-41-59_claim-office-example-mapping_v6.1-with-why_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-24_03-41-59_claim-office-example-mapping_v6.1-with-why_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (41 tests) 1822ms

 Test Files  1 passed (1)
      Tests  41 passed (41)
   Start at  04:20:57
   Duration  2.01s (transform 48ms, setup 0ms, collect 50ms, tests 1.82s, environment 0ms, prepare 48ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 88% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 67 | ×1 | 67 |
| Invocations | 73 | ×2 | 146 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 11 | ×5 | 55 |
| Assignments | 95 | ×6 | 570 |
| **Total Mass** | | | **894** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 190 |
| Functions | 28 |
| Longest Function | 14 lines |
| Avg LOC/Function | 4.18 |
| Median LOC/Function | 2.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 1 |
| Code Quality | 0 |
| **Total** | **1** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 5 | 1.53 | 0 |
| Cognitive (SonarJS) | 6 | 1.75 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 44964333 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 41 |
| Avg Cycle Time | 88.94s |
| Avg Red Phase | 19.01s |
| Avg Green Phase | 22.16s |
| Avg Refactor Phase | 47.77s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 80 |
| Predictions Total | 82 |
| Accuracy | 97% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 22 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 20 |


