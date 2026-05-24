# Analysis Report: 2026-05-24_03-22-00_claim-office-example-mapping_v6.1-with-why_opus-4-7-portkey-no-thinking

Generated: 2026-05-24T04:11:34+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-with-why |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 2973s |
| Started | 2026-05-24T03:22:00+00:00 |
| Ended | 2026-05-24T04:11:34+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 222
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 366
- **Active tests**: 38
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (38 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-24_03-22-00_claim-office-example-mapping_v6.1-with-why_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-24_03-22-00_claim-office-example-mapping_v6.1-with-why_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (38 tests) 13ms

 Test Files  1 passed (1)
      Tests  38 passed (38)
   Start at  04:11:34
   Duration  193ms (transform 40ms, setup 0ms, collect 41ms, tests 13ms, environment 0ms, prepare 41ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 55 | ×1 | 55 |
| Invocations | 81 | ×2 | 162 |
| Conditionals | 9 | ×4 | 36 |
| Loops | 9 | ×5 | 45 |
| Assignments | 92 | ×6 | 552 |
| **Total Mass** | | | **850** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 185 |
| Functions | 25 |
| Longest Function | 10 lines |
| Avg LOC/Function | 4.48 |
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
| McCabe (Cyclomatic) | 4 | 1.35 | 0 |
| Cognitive (SonarJS) | 4 | 1.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 51081422 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 39 |
| Avg Cycle Time | 91.39s |
| Avg Red Phase | 20.72s |
| Avg Green Phase | 15.68s |
| Avg Refactor Phase | 54.99s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 75 |
| Predictions Total | 77 |
| Accuracy | 97% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 30 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 9 |


