# Analysis Report: 2026-10-01_01-11-50_claim-office-example-mapping_exact-hybrid-v2.4-lab-split-cc_opus-5-5-no-thinking

Generated: 2026-10-01T01:29:23+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-hybrid-v2.4-lab-split-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5 |
| Thinking | unknown |
| Duration | 1050s |
| Started | 2026-10-01T01:11:50+00:00 |
| Ended | 2026-10-01T01:29:23+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 176
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 249
- **Active tests**: 40
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (40 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-01_01-11-50_claim-office-example-mapping_exact-hybrid-v2.4-lab-split-cc_opus-5-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-01_01-11-50_claim-office-example-mapping_exact-hybrid-v2.4-lab-split-cc_opus-5-5-no-thinking

 ✓ src/claim-office.spec.ts  (40 tests) 1078ms

 Test Files  1 passed (1)
      Tests  40 passed (40)
   Start at  01:29:24
   Duration  1.41s (transform 71ms, setup 0ms, collect 67ms, tests 1.08s, environment 0ms, prepare 87ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 46 | ×1 | 46 |
| Invocations | 74 | ×2 | 148 |
| Conditionals | 9 | ×4 | 36 |
| Loops | 9 | ×5 | 45 |
| Assignments | 77 | ×6 | 462 |
| **Total Mass** | | | **737** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 140 |
| Functions | 32 |
| Longest Function | 11 lines |
| Avg LOC/Function | 3.22 |
| Median LOC/Function | 2.00 |
| Imports | 2 |

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
| McCabe (Cyclomatic) | 4 | 1.37 | 0 |
| Cognitive (SonarJS) | 4 | 1.23 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 47759907 |
| Context Utilization | 116% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 40 |
| Avg Cycle Time | 36.65s |
| Avg Red Phase | 7.45s |
| Avg Green Phase | 9.47s |
| Avg Refactor Phase | 19.73s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 0 |
| Predictions Total | 0 |
| Accuracy | N/A |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 25 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 16 |


