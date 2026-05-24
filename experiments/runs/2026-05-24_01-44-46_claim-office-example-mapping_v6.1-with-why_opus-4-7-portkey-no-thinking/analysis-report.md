# Analysis Report: 2026-05-24_01-44-46_claim-office-example-mapping_v6.1-with-why_opus-4-7-portkey-no-thinking

Generated: 2026-05-24T02:23:46+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-with-why |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 2339s |
| Started | 2026-05-24T01:44:46+00:00 |
| Ended | 2026-05-24T02:23:46+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 237
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 671
- **Active tests**: 37
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (37 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-24_01-44-46_claim-office-example-mapping_v6.1-with-why_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-24_01-44-46_claim-office-example-mapping_v6.1-with-why_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (37 tests) 6ms

 Test Files  1 passed (1)
      Tests  37 passed (37)
   Start at  02:23:47
   Duration  193ms (transform 60ms, setup 0ms, collect 60ms, tests 6ms, environment 0ms, prepare 41ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 57 | ×1 | 57 |
| Invocations | 78 | ×2 | 156 |
| Conditionals | 9 | ×4 | 36 |
| Loops | 11 | ×5 | 55 |
| Assignments | 92 | ×6 | 552 |
| **Total Mass** | | | **856** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 195 |
| Functions | 28 |
| Longest Function | 13 lines |
| Avg LOC/Function | 3.57 |
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
| McCabe (Cyclomatic) | 4 | 1.33 | 0 |
| Cognitive (SonarJS) | 4 | 1.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 43985909 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 37 |
| Avg Cycle Time | 98.18s |
| Avg Red Phase | 19.3s |
| Avg Green Phase | 29.37s |
| Avg Refactor Phase | 49.51s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 64 |
| Predictions Total | 74 |
| Accuracy | 86% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 20 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 17 |


