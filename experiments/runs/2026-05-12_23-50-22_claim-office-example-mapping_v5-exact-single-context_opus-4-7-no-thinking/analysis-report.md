# Analysis Report: 2026-05-12_23-50-22_claim-office-example-mapping_v5-exact-single-context_opus-4-7-no-thinking

Generated: 2026-05-12T23:56:20+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5-exact-single-context |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7, <synthetic> |
| Thinking | unknown |
| Duration | 357s |
| Started | 2026-05-12T23:50:22+00:00 |
| Ended | 2026-05-12T23:56:20+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts
- **Implementation LOC** (total): 71
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 195
- **Active tests**: 14
- **Remaining todos**: 20

## Test Results

**Status**: ✅ All tests passing (14 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-12_23-50-22_claim-office-example-mapping_v5-exact-single-context_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-12_23-50-22_claim-office-example-mapping_v5-exact-single-context_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (34 tests | 20 skipped) 5ms

 Test Files  1 passed (1)
      Tests  14 passed | 20 todo (34)
   Start at  23:56:21
   Duration  179ms (transform 36ms, setup 0ms, collect 33ms, tests 5ms, environment 0ms, prepare 47ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 98% |
| Branches | 87% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 29 | ×1 | 29 |
| Invocations | 13 | ×2 | 26 |
| Conditionals | 9 | ×4 | 36 |
| Loops | 3 | ×5 | 15 |
| Assignments | 22 | ×6 | 132 |
| **Total Mass** | | | **238** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 62 |
| Functions | 3 |
| Longest Function | 19 lines |
| Avg LOC/Function | 12.67 |
| Median LOC/Function | 10.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 3 |
| Code Quality | 0 |
| **Total** | **3** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 7 | 3.50 | 0 |
| Cognitive (SonarJS) | 8 | 4.33 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 9258145 |
| Context Utilization | 11% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 3 |
| Avg Cycle Time | 116.81s |
| Avg Red Phase | 85.68s |
| Avg Green Phase | 14.24s |
| Avg Refactor Phase | 16.89s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 6 |
| Predictions Total | 6 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 2 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


