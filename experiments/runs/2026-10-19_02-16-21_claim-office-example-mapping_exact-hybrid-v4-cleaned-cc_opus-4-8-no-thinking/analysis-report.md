# Analysis Report: 2026-10-19_02-16-21_claim-office-example-mapping_exact-hybrid-v4-cleaned-cc_opus-4-8-no-thinking

Generated: 2026-10-19T02:56:06+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-hybrid-v4-cleaned-cc |
| Model | opus-4-8-no-thinking |
| Model Version(s) | claude-opus-4-8 |
| Thinking | unknown |
| Duration | 2383s |
| Started | 2026-10-19T02:16:21+00:00 |
| Ended | 2026-10-19T02:56:06+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 323
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 563
- **Active tests**: 38
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (38 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-19_02-16-21_claim-office-example-mapping_exact-hybrid-v4-cleaned-cc_opus-4-8-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-19_02-16-21_claim-office-example-mapping_exact-hybrid-v4-cleaned-cc_opus-4-8-no-thinking

 ✓ src/claim-office.spec.ts  (38 tests) 6ms

 Test Files  1 passed (1)
      Tests  38 passed (38)
   Start at  02:56:07
   Duration  175ms (transform 47ms, setup 0ms, collect 39ms, tests 6ms, environment 0ms, prepare 43ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 57 | ×1 | 57 |
| Invocations | 82 | ×2 | 164 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 12 | ×5 | 60 |
| Assignments | 93 | ×6 | 558 |
| **Total Mass** | | | **883** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 261 |
| Functions | 30 |
| Longest Function | 12 lines |
| Avg LOC/Function | 3.43 |
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
| McCabe (Cyclomatic) | 4 | 1.57 | 0 |
| Cognitive (SonarJS) | 4 | 1.59 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 78357897 |
| Context Utilization | 175% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 38 |
| Avg Cycle Time | 97.11s |
| Avg Red Phase | 21.81s |
| Avg Green Phase | 21.07s |
| Avg Refactor Phase | 54.23s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 77 |
| Predictions Total | 77 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 20 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 18 |


