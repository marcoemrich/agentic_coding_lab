# Analysis Report: 2026-09-04_22-18-15_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking

Generated: 2026-09-04T23:03:16+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-hybrid-testlist-scope-fix |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 2699s |
| Started | 2026-09-04T22:18:15+00:00 |
| Ended | 2026-09-04T23:03:16+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 302
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 884
- **Active tests**: 46
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (46 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-04_22-18-15_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-04_22-18-15_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (46 tests) 1162ms

 Test Files  1 passed (1)
      Tests  46 passed (46)
   Start at  23:03:17
   Duration  1.54s (transform 103ms, setup 0ms, collect 109ms, tests 1.16s, environment 0ms, prepare 104ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 51 | ×1 | 51 |
| Invocations | 79 | ×2 | 158 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 13 | ×5 | 65 |
| Assignments | 86 | ×6 | 516 |
| **Total Mass** | | | **858** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 224 |
| Functions | 33 |
| Longest Function | 11 lines |
| Avg LOC/Function | 3.67 |
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
| McCabe (Cyclomatic) | 3 | 1.49 | 0 |
| Cognitive (SonarJS) | 2 | 1.20 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 92696032 |
| Context Utilization | 178% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 51 |
| Avg Cycle Time | 98.29s |
| Avg Red Phase | 17.1s |
| Avg Green Phase | 21.7s |
| Avg Refactor Phase | 59.49s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 91 |
| Predictions Total | 92 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 22 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 29 |


