# Analysis Report: 2026-09-12_23-54-06_claim-office-example-mapping_exact-hybrid-v2.9-stack-profile-cc_opus-5-no-thinking

Generated: 2026-09-13T01:05:51+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-hybrid-v2.9-stack-profile-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 4303s |
| Started | 2026-09-12T23:54:06+00:00 |
| Ended | 2026-09-13T01:05:51+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 405
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 1154
- **Active tests**: 49
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (48 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-12_23-54-06_claim-office-example-mapping_exact-hybrid-v2.9-stack-profile-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-12_23-54-06_claim-office-example-mapping_exact-hybrid-v2.9-stack-profile-cc_opus-5-no-thinking

Unknown item type: broomstick
 ✓ src/claim-office.spec.ts  (48 tests) 395ms

 Test Files  1 passed (1)
      Tests  48 passed (48)
   Start at  01:05:52
   Duration  797ms (transform 103ms, setup 0ms, collect 100ms, tests 395ms, environment 0ms, prepare 104ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 87 | ×1 | 87 |
| Invocations | 64 | ×2 | 128 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 12 | ×5 | 60 |
| Assignments | 66 | ×6 | 396 |
| **Total Mass** | | | **719** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 301 |
| Functions | 19 |
| Longest Function | 27 lines |
| Avg LOC/Function | 6.42 |
| Median LOC/Function | 2.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 0 |
| Code Quality | 0 |
| **Total** | **1** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 7 | 1.84 | 0 |
| Cognitive (SonarJS) | 8 | 2.78 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 141238278 |
| Context Utilization | 270% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 48 |
| Avg Cycle Time | 161.55s |
| Avg Red Phase | 44.21s |
| Avg Green Phase | 45.43s |
| Avg Refactor Phase | 71.91s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 96 |
| Predictions Total | 96 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 17 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 28 |


