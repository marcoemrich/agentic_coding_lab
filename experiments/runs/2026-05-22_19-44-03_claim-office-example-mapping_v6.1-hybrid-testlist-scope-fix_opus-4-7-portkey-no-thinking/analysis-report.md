# Analysis Report: 2026-05-22_19-44-03_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-4-7-portkey-no-thinking

Generated: 2026-05-22T20:11:29+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-hybrid-testlist-scope-fix |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 1645s |
| Started | 2026-05-22T19:44:03+00:00 |
| Ended | 2026-05-22T20:11:29+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 223
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 662
- **Active tests**: 41
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (41 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-22_19-44-03_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-22_19-44-03_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (41 tests) 7ms

 Test Files  1 passed (1)
      Tests  41 passed (41)
   Start at  20:11:29
   Duration  182ms (transform 48ms, setup 0ms, collect 49ms, tests 7ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 61 | ×1 | 61 |
| Invocations | 80 | ×2 | 160 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 12 | ×5 | 60 |
| Assignments | 94 | ×6 | 564 |
| **Total Mass** | | | **905** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 182 |
| Functions | 23 |
| Longest Function | 15 lines |
| Avg LOC/Function | 5.74 |
| Median LOC/Function | 6.00 |
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
| McCabe (Cyclomatic) | 4 | 1.76 | 0 |
| Cognitive (SonarJS) | 4 | 2.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 36338126 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 26 |
| Avg Cycle Time | 103.79s |
| Avg Red Phase | 23.79s |
| Avg Green Phase | 26.18s |
| Avg Refactor Phase | 53.82s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 47 |
| Predictions Total | 52 |
| Accuracy | 90% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 11 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 12 |


