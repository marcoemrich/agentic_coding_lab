# Analysis Report: 2026-05-21_15-29-15_claim-office-example-mapping_v4.1-testlist-scope-fix_opus-4-6-portkey-no-thinking

Generated: 2026-05-21T16:55:58+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4.1-testlist-scope-fix |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 5201s |
| Started | 2026-05-21T15:29:15+00:00 |
| Ended | 2026-05-21T16:55:58+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 222
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 966
- **Active tests**: 41
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (41 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-21_15-29-15_claim-office-example-mapping_v4.1-testlist-scope-fix_opus-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-21_15-29-15_claim-office-example-mapping_v4.1-testlist-scope-fix_opus-4-6-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (41 tests) 6ms

 Test Files  1 passed (1)
      Tests  41 passed (41)
   Start at  16:55:59
   Duration  187ms (transform 52ms, setup 0ms, collect 53ms, tests 6ms, environment 0ms, prepare 41ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 88% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 67 | ×1 | 67 |
| Invocations | 60 | ×2 | 120 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 9 | ×5 | 45 |
| Assignments | 59 | ×6 | 354 |
| **Total Mass** | | | **650** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 194 |
| Functions | 9 |
| Longest Function | 23 lines |
| Avg LOC/Function | 11.44 |
| Median LOC/Function | 10.00 |
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
| McCabe (Cyclomatic) | 6 | 2.88 | 0 |
| Cognitive (SonarJS) | 6 | 4.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 16257065 |
| Context Utilization | 72% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 41 |
| Avg Cycle Time | 158.96s |
| Avg Red Phase | 40.37s |
| Avg Green Phase | 34.55s |
| Avg Refactor Phase | 84.04s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 82 |
| Predictions Total | 82 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 19 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 22 |


