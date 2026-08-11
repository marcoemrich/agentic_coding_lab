# Analysis Report: 2026-08-11_09-29-29_claim-office-prose_v6.6-lab-split-cc_opus-5-no-thinking

Generated: 2026-08-11T10:28:10+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-prose |
| Workflow | v6.6-lab-split-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 3520s |
| Started | 2026-08-11T09:29:29+00:00 |
| Ended | 2026-08-11T10:28:10+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 326
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 801
- **Active tests**: 36
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (38 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-11_09-29-29_claim-office-prose_v6.6-lab-split-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-11_09-29-29_claim-office-prose_v6.6-lab-split-cc_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (36 tests) 6ms
 ✓ src/cli.spec.ts  (2 tests) 611ms

 Test Files  2 passed (2)
      Tests  38 passed (38)
   Start at  10:28:11
   Duration  934ms (transform 61ms, setup 0ms, collect 66ms, tests 617ms, environment 0ms, prepare 86ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 97% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 55 | ×1 | 55 |
| Invocations | 63 | ×2 | 126 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 6 | ×5 | 30 |
| Assignments | 91 | ×6 | 546 |
| **Total Mass** | | | **769** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 230 |
| Functions | 28 |
| Longest Function | 15 lines |
| Avg LOC/Function | 2.96 |
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
| McCabe (Cyclomatic) | 4 | 1.27 | 0 |
| Cognitive (SonarJS) | 2 | 1.12 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 78701589 |
| Context Utilization | 173% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 41 |
| Avg Cycle Time | 127.08s |
| Avg Red Phase | 26.55s |
| Avg Green Phase | 28.09s |
| Avg Refactor Phase | 72.44s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 81 |
| Predictions Total | 82 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 22 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 19 |


