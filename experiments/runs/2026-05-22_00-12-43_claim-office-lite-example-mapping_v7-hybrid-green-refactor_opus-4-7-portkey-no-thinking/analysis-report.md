# Analysis Report: 2026-05-22_00-12-43_claim-office-lite-example-mapping_v7-hybrid-green-refactor_opus-4-7-portkey-no-thinking

Generated: 2026-05-22T00:40:54+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-lite-example-mapping |
| Workflow | v7-hybrid-green-refactor |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 1690s |
| Started | 2026-05-22T00:12:43+00:00 |
| Ended | 2026-05-22T00:40:54+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 205
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 361
- **Active tests**: 33
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (33 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-22_00-12-43_claim-office-lite-example-mapping_v7-hybrid-green-refactor_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-22_00-12-43_claim-office-lite-example-mapping_v7-hybrid-green-refactor_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (33 tests) 7ms

 Test Files  1 passed (1)
      Tests  33 passed (33)
   Start at  00:40:54
   Duration  174ms (transform 42ms, setup 0ms, collect 41ms, tests 7ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 53 | ×1 | 53 |
| Invocations | 76 | ×2 | 152 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 9 | ×5 | 45 |
| Assignments | 85 | ×6 | 510 |
| **Total Mass** | | | **804** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 172 |
| Functions | 22 |
| Longest Function | 16 lines |
| Avg LOC/Function | 5.95 |
| Median LOC/Function | 6.50 |
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
| McCabe (Cyclomatic) | 4 | 1.60 | 0 |
| Cognitive (SonarJS) | 3 | 1.62 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 26005458 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 23 |
| Avg Cycle Time | 99.55s |
| Avg Red Phase | 25.34s |
| Avg Green Phase | 25.32s |
| Avg Refactor Phase | 48.89s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 31 |
| Predictions Total | 31 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 12 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 4 |


