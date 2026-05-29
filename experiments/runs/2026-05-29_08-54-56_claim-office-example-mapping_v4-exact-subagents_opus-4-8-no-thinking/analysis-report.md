# Analysis Report: 2026-05-29_08-54-56_claim-office-example-mapping_v4-exact-subagents_opus-4-8-no-thinking

Generated: 2026-05-29T10:24:14+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4-exact-subagents |
| Model | opus-4-8-no-thinking |
| Model Version(s) | claude-opus-4-8 |
| Thinking | unknown |
| Duration | 5357s |
| Started | 2026-05-29T08:54:56+00:00 |
| Ended | 2026-05-29T10:24:14+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts, scenario.ts
- **Implementation LOC** (total): 323
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 281
- **Active tests**: 38
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (44 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-29_08-54-56_claim-office-example-mapping_v4-exact-subagents_opus-4-8-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-29_08-54-56_claim-office-example-mapping_v4-exact-subagents_opus-4-8-no-thinking

 ✓ src/claim-office.spec.ts  (38 tests) 6ms
 ✓ src/scenario.spec.ts  (6 tests) 3ms

 Test Files  2 passed (2)
      Tests  44 passed (44)
   Start at  10:24:15
   Duration  320ms (transform 52ms, setup 0ms, collect 57ms, tests 9ms, environment 0ms, prepare 87ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 60 | ×1 | 60 |
| Invocations | 86 | ×2 | 172 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 11 | ×5 | 55 |
| Assignments | 96 | ×6 | 576 |
| **Total Mass** | | | **931** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 260 |
| Functions | 24 |
| Longest Function | 33 lines |
| Avg LOC/Function | 5.50 |
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
| McCabe (Cyclomatic) | 4 | 1.56 | 0 |
| Cognitive (SonarJS) | 3 | 1.71 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 28268351 |
| Context Utilization | 111% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 44 |
| Avg Cycle Time | 123.28s |
| Avg Red Phase | 37.45s |
| Avg Green Phase | 29.87s |
| Avg Refactor Phase | 55.96s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 82 |
| Predictions Total | 88 |
| Accuracy | 93% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 29 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 15 |


