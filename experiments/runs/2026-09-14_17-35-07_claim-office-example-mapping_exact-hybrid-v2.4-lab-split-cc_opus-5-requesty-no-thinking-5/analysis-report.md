# Analysis Report: 2026-09-14_17-35-07_claim-office-example-mapping_exact-hybrid-v2.4-lab-split-cc_opus-5-requesty-no-thinking-5

Generated: 2026-09-14T18:30:01+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-hybrid-v2.4-lab-split-cc |
| Model | opus-5-requesty-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 3287s |
| Started | 2026-09-14T17:35:08+00:00 |
| Ended | 2026-09-14T18:30:01+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 355
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 942
- **Active tests**: 48
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (48 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-14_17-35-07_claim-office-example-mapping_exact-hybrid-v2.4-lab-split-cc_opus-5-requesty-no-thinking-5
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-14_17-35-07_claim-office-example-mapping_exact-hybrid-v2.4-lab-split-cc_opus-5-requesty-no-thinking-5

 ✓ src/claim-office.spec.ts  (48 tests) 1499ms

 Test Files  1 passed (1)
      Tests  48 passed (48)
   Start at  18:30:02
   Duration  1.86s (transform 88ms, setup 0ms, collect 90ms, tests 1.50s, environment 0ms, prepare 81ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 73 | ×1 | 73 |
| Invocations | 75 | ×2 | 150 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 9 | ×5 | 45 |
| Assignments | 78 | ×6 | 468 |
| **Total Mass** | | | **780** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 231 |
| Functions | 33 |
| Longest Function | 20 lines |
| Avg LOC/Function | 3.27 |
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
| McCabe (Cyclomatic) | 3 | 1.40 | 0 |
| Cognitive (SonarJS) | 2 | 1.06 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 48502422 |
| Context Utilization | 83% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 48 |
| Avg Cycle Time | 118.43s |
| Avg Red Phase | 24.49s |
| Avg Green Phase | 23.23s |
| Avg Refactor Phase | 70.71s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 96 |
| Predictions Total | 96 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 22 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 26 |


