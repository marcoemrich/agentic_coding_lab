# Analysis Report: 2026-09-14_17-35-07_claim-office-example-mapping_exact-hybrid-v2.4-lab-split-cc_opus-5-requesty-no-thinking

Generated: 2026-09-14T18:39:47+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-hybrid-v2.4-lab-split-cc |
| Model | opus-5-requesty-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 3875s |
| Started | 2026-09-14T17:35:07+00:00 |
| Ended | 2026-09-14T18:39:47+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 450
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 991
- **Active tests**: 51
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (51 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-14_17-35-07_claim-office-example-mapping_exact-hybrid-v2.4-lab-split-cc_opus-5-requesty-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-14_17-35-07_claim-office-example-mapping_exact-hybrid-v2.4-lab-split-cc_opus-5-requesty-no-thinking

 ✓ src/claim-office.spec.ts  (51 tests) 366ms

 Test Files  1 passed (1)
      Tests  51 passed (51)
   Start at  18:39:48
   Duration  737ms (transform 91ms, setup 0ms, collect 97ms, tests 366ms, environment 0ms, prepare 106ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 59 | ×1 | 59 |
| Invocations | 69 | ×2 | 138 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 22 | ×5 | 110 |
| Assignments | 104 | ×6 | 624 |
| **Total Mass** | | | **979** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 321 |
| Functions | 30 |
| Longest Function | 23 lines |
| Avg LOC/Function | 3.87 |
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
| McCabe (Cyclomatic) | 4 | 1.41 | 0 |
| Cognitive (SonarJS) | 4 | 1.73 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 50269186 |
| Context Utilization | 84% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 51 |
| Avg Cycle Time | 135.32s |
| Avg Red Phase | 26.56s |
| Avg Green Phase | 24.25s |
| Avg Refactor Phase | 84.51s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 102 |
| Predictions Total | 102 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 23 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 29 |


