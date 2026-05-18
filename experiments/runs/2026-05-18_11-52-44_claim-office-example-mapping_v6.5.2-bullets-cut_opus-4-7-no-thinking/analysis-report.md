# Analysis Report: 2026-05-18_11-52-44_claim-office-example-mapping_v6.5.2-bullets-cut_opus-4-7-no-thinking

Generated: 2026-05-18T12:40:21+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.5.2-bullets-cut |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 2856s |
| Started | 2026-05-18T11:52:44+00:00 |
| Ended | 2026-05-18T12:40:21+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 230
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 458
- **Active tests**: 26
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (26 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-18_11-52-44_claim-office-example-mapping_v6.5.2-bullets-cut_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-18_11-52-44_claim-office-example-mapping_v6.5.2-bullets-cut_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (26 tests) 6ms

 Test Files  1 passed (1)
      Tests  26 passed (26)
   Start at  12:40:22
   Duration  190ms (transform 46ms, setup 0ms, collect 45ms, tests 6ms, environment 0ms, prepare 46ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 47 | ×1 | 47 |
| Invocations | 91 | ×2 | 182 |
| Conditionals | 5 | ×4 | 20 |
| Loops | 6 | ×5 | 30 |
| Assignments | 102 | ×6 | 612 |
| **Total Mass** | | | **891** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 187 |
| Functions | 35 |
| Longest Function | 12 lines |
| Avg LOC/Function | 3.51 |
| Median LOC/Function | 2.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 2 |
| Code Quality | 0 |
| **Total** | **2** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 4 | 1.36 | 0 |
| Cognitive (SonarJS) | 4 | 1.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 38519131 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 26 |
| Avg Cycle Time | 108.91s |
| Avg Red Phase | 28.38s |
| Avg Green Phase | 22.46s |
| Avg Refactor Phase | 58.07s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 45 |
| Predictions Total | 52 |
| Accuracy | 86% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 26 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


