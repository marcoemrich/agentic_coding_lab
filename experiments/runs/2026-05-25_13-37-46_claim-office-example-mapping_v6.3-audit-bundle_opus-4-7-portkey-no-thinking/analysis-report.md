# Analysis Report: 2026-05-25_13-37-46_claim-office-example-mapping_v6.3-audit-bundle_opus-4-7-portkey-no-thinking

Generated: 2026-05-25T14:33:32+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.3-audit-bundle |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 3345s |
| Started | 2026-05-25T13:37:46+00:00 |
| Ended | 2026-05-25T14:33:32+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 302
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 605
- **Active tests**: 41
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (41 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-25_13-37-46_claim-office-example-mapping_v6.3-audit-bundle_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-25_13-37-46_claim-office-example-mapping_v6.3-audit-bundle_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (41 tests) 7ms

 Test Files  1 passed (1)
      Tests  41 passed (41)
   Start at  14:33:33
   Duration  214ms (transform 54ms, setup 0ms, collect 68ms, tests 7ms, environment 0ms, prepare 50ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 71 | ×1 | 71 |
| Invocations | 98 | ×2 | 196 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 7 | ×5 | 35 |
| Assignments | 108 | ×6 | 648 |
| **Total Mass** | | | **994** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 242 |
| Functions | 43 |
| Longest Function | 12 lines |
| Avg LOC/Function | 2.91 |
| Median LOC/Function | 2.00 |
| Imports | 1 |

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
| McCabe (Cyclomatic) | 4 | 1.45 | 0 |
| Cognitive (SonarJS) | 5 | 1.47 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 52427408 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 25 |
| Avg Cycle Time | 105.03s |
| Avg Red Phase | 22.52s |
| Avg Green Phase | 20.3s |
| Avg Refactor Phase | 62.21s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 79 |
| Predictions Total | 84 |
| Accuracy | 94% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 36 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


