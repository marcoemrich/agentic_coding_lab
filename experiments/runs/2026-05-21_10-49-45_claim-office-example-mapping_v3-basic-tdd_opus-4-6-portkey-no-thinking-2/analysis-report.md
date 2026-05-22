# Analysis Report: 2026-05-21_10-49-45_claim-office-example-mapping_v3-basic-tdd_opus-4-6-portkey-no-thinking-2

Generated: 2026-05-21T10:54:40+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v3-basic-tdd |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 294s |
| Started | 2026-05-21T10:49:45+00:00 |
| Ended | 2026-05-21T10:54:40+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 302
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 641
- **Active tests**: 45
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (45 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-21_10-49-45_claim-office-example-mapping_v3-basic-tdd_opus-4-6-portkey-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-21_10-49-45_claim-office-example-mapping_v3-basic-tdd_opus-4-6-portkey-no-thinking-2

 ✓ src/claim-office.spec.ts  (45 tests) 6ms

 Test Files  1 passed (1)
      Tests  45 passed (45)
   Start at  10:54:41
   Duration  183ms (transform 45ms, setup 0ms, collect 45ms, tests 6ms, environment 0ms, prepare 43ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 91% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 76 | ×1 | 76 |
| Invocations | 85 | ×2 | 170 |
| Conditionals | 24 | ×4 | 96 |
| Loops | 15 | ×5 | 75 |
| Assignments | 63 | ×6 | 378 |
| **Total Mass** | | | **795** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 220 |
| Functions | 7 |
| Longest Function | 39 lines |
| Avg LOC/Function | 11.29 |
| Median LOC/Function | 3.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 7 |
| Duplication | 0 |
| Magic Numbers | 10 |
| Code Quality | 0 |
| **Total** | **17** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 17 | 5.44 | 1 |
| Cognitive (SonarJS) | 21 | 8.86 | 3 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2346641 |
| Context Utilization | 28% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 4.53s |
| Avg Red Phase | 0s |
| Avg Green Phase | 4.53s |
| Avg Refactor Phase | 0s |

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
| Refactorings Applied | 1 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


