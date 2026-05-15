# Analysis Report: 2026-05-15_07-20-00_claim-office-example-mapping_v5-exact-single-context_opus-4-7-no-thinking

Generated: 2026-05-15T07:33:34+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5-exact-single-context |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 813s |
| Started | 2026-05-15T07:20:00+00:00 |
| Ended | 2026-05-15T07:33:34+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 203
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 417
- **Active tests**: 35
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (35 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-15_07-20-00_claim-office-example-mapping_v5-exact-single-context_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-15_07-20-00_claim-office-example-mapping_v5-exact-single-context_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (35 tests) 5ms

 Test Files  1 passed (1)
      Tests  35 passed (35)
   Start at  07:33:35
   Duration  177ms (transform 40ms, setup 0ms, collect 41ms, tests 5ms, environment 0ms, prepare 43ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 86% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 64 | ×1 | 64 |
| Invocations | 76 | ×2 | 152 |
| Conditionals | 19 | ×4 | 76 |
| Loops | 10 | ×5 | 50 |
| Assignments | 97 | ×6 | 582 |
| **Total Mass** | | | **924** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 162 |
| Functions | 16 |
| Longest Function | 18 lines |
| Avg LOC/Function | 8.19 |
| Median LOC/Function | 7.00 |
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
| McCabe (Cyclomatic) | 4 | 2.00 | 0 |
| Cognitive (SonarJS) | 5 | 2.54 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 16833941 |
| Context Utilization | 12% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 3 |
| Avg Cycle Time | 259.58s |
| Avg Red Phase | 24.37s |
| Avg Green Phase | 219.1s |
| Avg Refactor Phase | 16.11s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 6 |
| Predictions Total | 6 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 2 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


