# Analysis Report: 2026-08-17_13-54-51_claim-office-example-mapping_basic-sol-tdd-app-pi_gpt-5-6-sol-codex-4

Generated: 2026-08-17T14:13:38+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | basic-sol-tdd-app-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1125s |
| Started | 2026-08-17T13:54:51+00:00 |
| Ended | 2026-08-17T14:13:38+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 194
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 191
- **Active tests**: 34
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (34 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-17_13-54-51_claim-office-example-mapping_basic-sol-tdd-app-pi_gpt-5-6-sol-codex-4
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-17_13-54-51_claim-office-example-mapping_basic-sol-tdd-app-pi_gpt-5-6-sol-codex-4

 ✓ src/claim-office.spec.ts  (34 tests) 2283ms

 Test Files  1 passed (1)
      Tests  34 passed (34)
   Start at  14:13:39
   Duration  2.55s (transform 51ms, setup 0ms, collect 46ms, tests 2.28s, environment 0ms, prepare 81ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 94% |
| Branches | 84% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 64 | ×1 | 64 |
| Invocations | 55 | ×2 | 110 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 9 | ×5 | 45 |
| Assignments | 59 | ×6 | 354 |
| **Total Mass** | | | **613** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 169 |
| Functions | 12 |
| Longest Function | 15 lines |
| Avg LOC/Function | 6.67 |
| Median LOC/Function | 6.00 |
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
| McCabe (Cyclomatic) | 3 | 1.62 | 0 |
| Cognitive (SonarJS) | 3 | 1.33 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 4575734 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 34 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 27 |
| Predictions Total | 28 |
| Accuracy | 96% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 34 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


