# Analysis Report: 2026-09-13_09-08-48_claim-office-example-mapping_exact-hybrid-v2.9-stack-profile-cc_opus-5-no-thinking

Generated: 2026-09-13T10:37:35+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-hybrid-v2.9-stack-profile-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 5323s |
| Started | 2026-09-13T09:08:49+00:00 |
| Ended | 2026-09-13T10:37:35+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 297
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 822
- **Active tests**: 46
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (46 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-13_09-08-48_claim-office-example-mapping_exact-hybrid-v2.9-stack-profile-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-13_09-08-48_claim-office-example-mapping_exact-hybrid-v2.9-stack-profile-cc_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (46 tests) 18ms

 Test Files  1 passed (1)
      Tests  46 passed (46)
   Start at  10:37:37
   Duration  518ms (transform 122ms, setup 0ms, collect 130ms, tests 18ms, environment 0ms, prepare 132ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 73 | ×1 | 73 |
| Invocations | 76 | ×2 | 152 |
| Conditionals | 8 | ×4 | 32 |
| Loops | 16 | ×5 | 80 |
| Assignments | 86 | ×6 | 516 |
| **Total Mass** | | | **853** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 190 |
| Functions | 22 |
| Longest Function | 14 lines |
| Avg LOC/Function | 5.00 |
| Median LOC/Function | 2.00 |
| Imports | 1 |

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
| McCabe (Cyclomatic) | 4 | 1.61 | 0 |
| Cognitive (SonarJS) | 3 | 1.33 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 194560425 |
| Context Utilization | 375% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 46 |
| Avg Cycle Time | 192.93s |
| Avg Red Phase | 58.08s |
| Avg Green Phase | 45.28s |
| Avg Refactor Phase | 89.57s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 92 |
| Predictions Total | 92 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 19 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 27 |


