# Analysis Report: 2026-09-12_23-52-37_claim-office-example-mapping_exact-hybrid-v2.9-stack-profile-cc_opus-5-no-thinking

Generated: 2026-09-13T01:42:13+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-hybrid-v2.9-stack-profile-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 6573s |
| Started | 2026-09-12T23:52:38+00:00 |
| Ended | 2026-09-13T01:42:13+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 537
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 1236
- **Active tests**: 55
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (55 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-12_23-52-37_claim-office-example-mapping_exact-hybrid-v2.9-stack-profile-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-12_23-52-37_claim-office-example-mapping_exact-hybrid-v2.9-stack-profile-cc_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (55 tests) 1118ms

 Test Files  1 passed (1)
      Tests  55 passed (55)
   Start at  01:42:14
   Duration  1.47s (transform 108ms, setup 0ms, collect 111ms, tests 1.12s, environment 0ms, prepare 77ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 126 | ×1 | 126 |
| Invocations | 83 | ×2 | 166 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 21 | ×5 | 105 |
| Assignments | 84 | ×6 | 504 |
| **Total Mass** | | | **953** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 444 |
| Functions | 26 |
| Longest Function | 23 lines |
| Avg LOC/Function | 6.23 |
| Median LOC/Function | 4.00 |
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
| McCabe (Cyclomatic) | 4 | 1.84 | 0 |
| Cognitive (SonarJS) | 3 | 1.87 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 392604505 |
| Context Utilization | 423% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 55 |
| Avg Cycle Time | 191.62s |
| Avg Red Phase | 67.36s |
| Avg Green Phase | 64.63s |
| Avg Refactor Phase | 59.63s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 110 |
| Predictions Total | 110 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 21 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 34 |


