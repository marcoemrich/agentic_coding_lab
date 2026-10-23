# Analysis Report: 2026-10-23_07-26-09_claim-office-example-mapping_exact-ptdd-v1-pi_qwen3-8-flash-next-4

Generated: 2026-10-23T07:48:03+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-pi |
| Model | qwen3-8-flash-next |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1307s |
| Started | 2026-10-23T07:26:10+00:00 |
| Ended | 2026-10-23T07:48:03+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, scenario.ts
- **Implementation LOC** (total): 239
- **Test files**: scenario.spec.ts
- **Test LOC** (total): 290
- **Active tests**: 41
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (41 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-23_07-26-09_claim-office-example-mapping_exact-ptdd-v1-pi_qwen3-8-flash-next-4
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-23_07-26-09_claim-office-example-mapping_exact-ptdd-v1-pi_qwen3-8-flash-next-4

 ✓ src/scenario.spec.ts  (41 tests) 1195ms

 Test Files  1 passed (1)
      Tests  41 passed (41)
   Start at  07:48:04
   Duration  1.55s (transform 89ms, setup 0ms, collect 98ms, tests 1.20s, environment 0ms, prepare 77ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 57 | ×1 | 57 |
| Invocations | 92 | ×2 | 184 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 9 | ×5 | 45 |
| Assignments | 42 | ×6 | 252 |
| **Total Mass** | | | **602** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 202 |
| Functions | 24 |
| Longest Function | 14 lines |
| Avg LOC/Function | 5.33 |
| Median LOC/Function | 3.50 |
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
| McCabe (Cyclomatic) | 3 | 1.61 | 0 |
| Cognitive (SonarJS) | 3 | 1.36 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 13659392 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 2 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 2 |
| Predictions Total | 2 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 3 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


