# Analysis Report: 2026-05-12_07-52-56_claim-office-example-mapping_v5-exact-single-context_sonnet-4-6-portkey-no-thinking

Generated: 2026-05-12T08:25:05+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5-exact-single-context |
| Model | sonnet-4-6-portkey-no-thinking |
| Model Version(s) | claude-sonnet-4-6 |
| Thinking | unknown |
| Duration | 1928s |
| Started | 2026-05-12T07:52:56+00:00 |
| Ended | 2026-05-12T08:25:05+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 102
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 142
- **Active tests**: 18
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (18 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-12_07-52-56_claim-office-example-mapping_v5-exact-single-context_sonnet-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-12_07-52-56_claim-office-example-mapping_v5-exact-single-context_sonnet-4-6-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (18 tests) 6ms

 Test Files  1 passed (1)
      Tests  18 passed (18)
   Start at  08:25:06
   Duration  190ms (transform 35ms, setup 0ms, collect 33ms, tests 6ms, environment 0ms, prepare 51ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 69% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 51 | ×1 | 51 |
| Invocations | 22 | ×2 | 44 |
| Conditionals | 9 | ×4 | 36 |
| Loops | 4 | ×5 | 20 |
| Assignments | 51 | ×6 | 306 |
| **Total Mass** | | | **457** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 91 |
| Functions | 4 |
| Longest Function | 10 lines |
| Avg LOC/Function | 4.75 |
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
| McCabe (Cyclomatic) | 5 | 2.50 | 0 |
| Cognitive (SonarJS) | 5 | 3.25 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 44122614 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 18 |
| Avg Cycle Time | 107.52s |
| Avg Red Phase | 25.84s |
| Avg Green Phase | 37.76s |
| Avg Refactor Phase | 43.92s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 35 |
| Predictions Total | 36 |
| Accuracy | 97% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 18 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 2 |


