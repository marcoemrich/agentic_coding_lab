# Analysis Report: 2026-05-26_01-08-22_claim-office-example-mapping_v6.2-with-why-cleaned_opus-4-7-portkey

Generated: 2026-05-26T02:02:02+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned |
| Model | opus-4-7-portkey |
| Model Version(s) | claude-opus-4-7 |
| Thinking | true |
| Duration | 3217s |
| Started | 2026-05-26T01:08:22+00:00 |
| Ended | 2026-05-26T02:02:02+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 292
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 680
- **Active tests**: 41
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (41 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-26_01-08-22_claim-office-example-mapping_v6.2-with-why-cleaned_opus-4-7-portkey
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-26_01-08-22_claim-office-example-mapping_v6.2-with-why-cleaned_opus-4-7-portkey

 ✓ src/claim-office.spec.ts  (41 tests) 3601ms

 Test Files  1 passed (1)
      Tests  41 passed (41)
   Start at  02:02:03
   Duration  4.05s (transform 120ms, setup 0ms, collect 132ms, tests 3.60s, environment 0ms, prepare 98ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 87% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 59 | ×1 | 59 |
| Invocations | 97 | ×2 | 194 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 12 | ×5 | 60 |
| Assignments | 114 | ×6 | 684 |
| **Total Mass** | | | **1041** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 241 |
| Functions | 34 |
| Longest Function | 19 lines |
| Avg LOC/Function | 3.85 |
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
| McCabe (Cyclomatic) | 7 | 1.48 | 0 |
| Cognitive (SonarJS) | 8 | 1.87 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 46255546 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 40 |
| Avg Cycle Time | 111.99s |
| Avg Red Phase | 31.47s |
| Avg Green Phase | 27.42s |
| Avg Refactor Phase | 53.1s |

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
| Refactorings Applied | 25 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 19 |


