# Analysis Report: 2026-09-03_23-16-54_claim-office-example-mapping_v6.1.1-lab-split-cc_opus-5-no-thinking

Generated: 2026-09-04T00:40:50+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1.1-lab-split-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 5019s |
| Started | 2026-09-03T23:16:54+00:00 |
| Ended | 2026-09-04T00:40:36+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 555
- **Test files**: claim-office.spec.ts, cli.spec.ts
- **Test LOC** (total): 977
- **Active tests**: 50
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (50 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-03_23-16-54_claim-office-example-mapping_v6.1.1-lab-split-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-03_23-16-54_claim-office-example-mapping_v6.1.1-lab-split-cc_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (47 tests) 21ms
 ✓ src/cli.spec.ts  (3 tests) 1992ms

 Test Files  2 passed (2)
      Tests  50 passed (50)
   Start at  00:40:51
   Duration  2.56s (transform 207ms, setup 0ms, collect 254ms, tests 2.01s, environment 0ms, prepare 317ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 94% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 72 | ×1 | 72 |
| Invocations | 96 | ×2 | 192 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 18 | ×5 | 90 |
| Assignments | 83 | ×6 | 498 |
| **Total Mass** | | | **912** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 425 |
| Functions | 36 |
| Longest Function | 16 lines |
| Avg LOC/Function | 4.11 |
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
| McCabe (Cyclomatic) | 3 | 1.35 | 0 |
| Cognitive (SonarJS) | 2 | 1.23 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 168351406 |
| Context Utilization | 263% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 50 |
| Avg Cycle Time | 117.24s |
| Avg Red Phase | 26.87s |
| Avg Green Phase | 32.13s |
| Avg Refactor Phase | 58.24s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 100 |
| Predictions Total | 100 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 50 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 28 |


