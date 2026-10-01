# Analysis Report: 2026-10-01_07-23-14_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking-2

Generated: 2026-10-01T09:23:20+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1.1-refactor-subagent-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 7201s |
| Started | 2026-10-01T07:23:14+00:00 |
| Ended | 2026-10-01T09:23:20+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 421
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 377
- **Active tests**: 57
- **Remaining todos**: 2

## Test Results

**Status**: ✅ All tests passing (57 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-01_07-23-14_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-01_07-23-14_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking-2

 ✓ src/claim-office.spec.ts  (59 tests | 2 skipped) 1146ms

 Test Files  1 passed (1)
      Tests  57 passed | 2 todo (59)
   Start at  09:23:21
   Duration  1.56s (transform 113ms, setup 0ms, collect 107ms, tests 1.15s, environment 0ms, prepare 118ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 95% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 72 | ×1 | 72 |
| Invocations | 106 | ×2 | 212 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 20 | ×5 | 100 |
| Assignments | 57 | ×6 | 342 |
| **Total Mass** | | | **782** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 246 |
| Functions | 31 |
| Longest Function | 15 lines |
| Avg LOC/Function | 5.13 |
| Median LOC/Function | 4.00 |
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
| McCabe (Cyclomatic) | 3 | 1.47 | 0 |
| Cognitive (SonarJS) | 3 | 1.36 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 106055978 |
| Context Utilization | 154% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 58 |
| Avg Cycle Time | 93.53s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 93.53s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 111 |
| Predictions Total | 114 |
| Accuracy | 97% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 56 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


