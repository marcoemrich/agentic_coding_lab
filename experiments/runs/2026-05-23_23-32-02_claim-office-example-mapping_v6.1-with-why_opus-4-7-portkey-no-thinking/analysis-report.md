# Analysis Report: 2026-05-23_23-32-02_claim-office-example-mapping_v6.1-with-why_opus-4-7-portkey-no-thinking

Generated: 2026-05-24T00:08:31+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-with-why |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 2188s |
| Started | 2026-05-23T23:32:02+00:00 |
| Ended | 2026-05-24T00:08:31+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 211
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 387
- **Active tests**: 38
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (38 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-23_23-32-02_claim-office-example-mapping_v6.1-with-why_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-23_23-32-02_claim-office-example-mapping_v6.1-with-why_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (38 tests) 6ms

 Test Files  1 passed (1)
      Tests  38 passed (38)
   Start at  00:08:31
   Duration  174ms (transform 41ms, setup 0ms, collect 42ms, tests 6ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 57 | ×1 | 57 |
| Invocations | 71 | ×2 | 142 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 9 | ×5 | 45 |
| Assignments | 86 | ×6 | 516 |
| **Total Mass** | | | **804** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 179 |
| Functions | 26 |
| Longest Function | 12 lines |
| Avg LOC/Function | 5.00 |
| Median LOC/Function | 3.50 |
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
| McCabe (Cyclomatic) | 4 | 1.53 | 0 |
| Cognitive (SonarJS) | 4 | 1.43 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 43877910 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 42 |
| Avg Cycle Time | 84.68s |
| Avg Red Phase | 19.63s |
| Avg Green Phase | 17.51s |
| Avg Refactor Phase | 47.54s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 73 |
| Predictions Total | 76 |
| Accuracy | 96% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 20 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 21 |


