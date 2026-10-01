# Analysis Report: 2026-10-01_01-09-27_claim-office-example-mapping_exact-hybrid-v2.4-lab-split-cc_opus-5-5-no-thinking

Generated: 2026-10-01T01:31:19+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-hybrid-v2.4-lab-split-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5 |
| Thinking | unknown |
| Duration | 1308s |
| Started | 2026-10-01T01:09:27+00:00 |
| Ended | 2026-10-01T01:31:19+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts, node-shims.d.ts
- **Implementation LOC** (total): 213
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 273
- **Active tests**: 43
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (43 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-01_01-09-27_claim-office-example-mapping_exact-hybrid-v2.4-lab-split-cc_opus-5-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-01_01-09-27_claim-office-example-mapping_exact-hybrid-v2.4-lab-split-cc_opus-5-5-no-thinking

 ✓ src/claim-office.spec.ts  (43 tests) 364ms

 Test Files  1 passed (1)
      Tests  43 passed (43)
   Start at  01:31:21
   Duration  737ms (transform 99ms, setup 1ms, collect 89ms, tests 364ms, environment 0ms, prepare 110ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 94% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 61 | ×1 | 61 |
| Invocations | 67 | ×2 | 134 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 8 | ×5 | 40 |
| Assignments | 59 | ×6 | 354 |
| **Total Mass** | | | **637** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 170 |
| Functions | 26 |
| Longest Function | 10 lines |
| Avg LOC/Function | 3.46 |
| Median LOC/Function | 2.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 1 |
| Code Quality | 0 |
| **Total** | **1** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 3 | 1.52 | 0 |
| Cognitive (SonarJS) | 3 | 1.55 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 63167124 |
| Context Utilization | 131% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 43 |
| Avg Cycle Time | 41.26s |
| Avg Red Phase | 8.33s |
| Avg Green Phase | 12.06s |
| Avg Refactor Phase | 20.87s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 0 |
| Predictions Total | 0 |
| Accuracy | N/A |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 28 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 15 |


