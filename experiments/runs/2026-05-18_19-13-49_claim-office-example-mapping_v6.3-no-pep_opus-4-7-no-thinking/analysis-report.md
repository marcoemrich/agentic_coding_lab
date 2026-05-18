# Analysis Report: 2026-05-18_19-13-49_claim-office-example-mapping_v6.3-no-pep_opus-4-7-no-thinking

Generated: 2026-05-18T19:55:06+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.3-no-pep |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 2476s |
| Started | 2026-05-18T19:13:49+00:00 |
| Ended | 2026-05-18T19:55:06+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 209
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 579
- **Active tests**: 35
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (35 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-18_19-13-49_claim-office-example-mapping_v6.3-no-pep_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-18_19-13-49_claim-office-example-mapping_v6.3-no-pep_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (35 tests) 6ms

 Test Files  1 passed (1)
      Tests  35 passed (35)
   Start at  19:55:06
   Duration  185ms (transform 43ms, setup 0ms, collect 44ms, tests 6ms, environment 0ms, prepare 52ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 53 | ×1 | 53 |
| Invocations | 77 | ×2 | 154 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 12 | ×5 | 60 |
| Assignments | 88 | ×6 | 528 |
| **Total Mass** | | | **843** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 174 |
| Functions | 25 |
| Longest Function | 15 lines |
| Avg LOC/Function | 4.80 |
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
| McCabe (Cyclomatic) | 4 | 1.62 | 0 |
| Cognitive (SonarJS) | 4 | 1.92 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 41839194 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 37 |
| Avg Cycle Time | 123.55s |
| Avg Red Phase | 25.36s |
| Avg Green Phase | 29.8s |
| Avg Refactor Phase | 68.39s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 55 |
| Predictions Total | 56 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 13 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 17 |


