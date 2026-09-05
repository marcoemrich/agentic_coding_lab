# Analysis Report: 2026-09-05_09-38-00_claim-office-example-mapping_v6.1.5-pure-split-cc_opus-5-no-thinking

Generated: 2026-09-05T10:38:46+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1.5-pure-split-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 3644s |
| Started | 2026-09-05T09:38:00+00:00 |
| Ended | 2026-09-05T10:38:46+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 379
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 822
- **Active tests**: 46
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (46 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-05_09-38-00_claim-office-example-mapping_v6.1.5-pure-split-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-05_09-38-00_claim-office-example-mapping_v6.1.5-pure-split-cc_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (46 tests) 1032ms

 Test Files  1 passed (1)
      Tests  46 passed (46)
   Start at  10:38:47
   Duration  1.36s (transform 105ms, setup 1ms, collect 105ms, tests 1.03s, environment 0ms, prepare 67ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 59 | ×1 | 59 |
| Invocations | 86 | ×2 | 172 |
| Conditionals | 8 | ×4 | 32 |
| Loops | 9 | ×5 | 45 |
| Assignments | 100 | ×6 | 600 |
| **Total Mass** | | | **908** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 259 |
| Functions | 31 |
| Longest Function | 25 lines |
| Avg LOC/Function | 4.90 |
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
| McCabe (Cyclomatic) | 3 | 1.40 | 0 |
| Cognitive (SonarJS) | 3 | 1.38 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 98024217 |
| Context Utilization | 195% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 45 |
| Avg Cycle Time | 137.99s |
| Avg Red Phase | 30.52s |
| Avg Green Phase | 32.73s |
| Avg Refactor Phase | 74.74s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 89 |
| Predictions Total | 90 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 21 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 25 |


