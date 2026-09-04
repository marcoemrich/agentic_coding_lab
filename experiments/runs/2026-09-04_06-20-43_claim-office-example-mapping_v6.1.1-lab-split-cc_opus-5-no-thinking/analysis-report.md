# Analysis Report: 2026-09-04_06-20-43_claim-office-example-mapping_v6.1.1-lab-split-cc_opus-5-no-thinking

Generated: 2026-09-04T07:07:09+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1.1-lab-split-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 2782s |
| Started | 2026-09-04T06:20:43+00:00 |
| Ended | 2026-09-04T07:07:09+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 273
- **Test files**: claim-office.spec.ts, cli.spec.ts
- **Test LOC** (total): 703
- **Active tests**: 49
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (49 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-04_06-20-43_claim-office-example-mapping_v6.1.1-lab-split-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-04_06-20-43_claim-office-example-mapping_v6.1.1-lab-split-cc_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (43 tests) 9ms
 ✓ src/cli.spec.ts  (6 tests) 4ms

 Test Files  2 passed (2)
      Tests  49 passed (49)
   Start at  07:07:10
   Duration  484ms (transform 81ms, setup 0ms, collect 93ms, tests 13ms, environment 0ms, prepare 133ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 95% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 58 | ×1 | 58 |
| Invocations | 72 | ×2 | 144 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 9 | ×5 | 45 |
| Assignments | 66 | ×6 | 396 |
| **Total Mass** | | | **703** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 203 |
| Functions | 24 |
| Longest Function | 18 lines |
| Avg LOC/Function | 4.88 |
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
| McCabe (Cyclomatic) | 3 | 1.69 | 0 |
| Cognitive (SonarJS) | 4 | 1.64 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 104838721 |
| Context Utilization | 195% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 49 |
| Avg Cycle Time | 89.90s |
| Avg Red Phase | 19.6s |
| Avg Green Phase | 18.72s |
| Avg Refactor Phase | 51.58s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 98 |
| Predictions Total | 98 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 25 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 24 |


