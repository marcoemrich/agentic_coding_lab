# Analysis Report: 2026-05-25_00-57-54_claim-office-example-mapping_v6.2-with-why-cleaned_opus-4-7-portkey-no-thinking

Generated: 2026-05-25T01:35:15+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 2240s |
| Started | 2026-05-25T00:57:54+00:00 |
| Ended | 2026-05-25T01:35:15+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 253
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 603
- **Active tests**: 35
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (35 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-25_00-57-54_claim-office-example-mapping_v6.2-with-why-cleaned_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-25_00-57-54_claim-office-example-mapping_v6.2-with-why-cleaned_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (35 tests) 2043ms

 Test Files  1 passed (1)
      Tests  35 passed (35)
   Start at  01:35:16
   Duration  2.22s (transform 47ms, setup 0ms, collect 48ms, tests 2.04s, environment 0ms, prepare 43ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 63% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 68 | ×1 | 68 |
| Invocations | 76 | ×2 | 152 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 19 | ×5 | 95 |
| Assignments | 85 | ×6 | 510 |
| **Total Mass** | | | **889** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 211 |
| Functions | 23 |
| Longest Function | 12 lines |
| Avg LOC/Function | 4.48 |
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
| McCabe (Cyclomatic) | 5 | 2.00 | 0 |
| Cognitive (SonarJS) | 8 | 3.69 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 39301139 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 35 |
| Avg Cycle Time | 101.41s |
| Avg Red Phase | 23.16s |
| Avg Green Phase | 23.98s |
| Avg Refactor Phase | 54.27s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 69 |
| Predictions Total | 70 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 18 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 18 |


