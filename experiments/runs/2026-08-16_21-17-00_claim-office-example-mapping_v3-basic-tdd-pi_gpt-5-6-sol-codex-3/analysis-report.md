# Analysis Report: 2026-08-16_21-17-00_claim-office-example-mapping_v3-basic-tdd-pi_gpt-5-6-sol-codex-3

Generated: 2026-08-16T21:21:15+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v3-basic-tdd-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 252s |
| Started | 2026-08-16T21:17:00+00:00 |
| Ended | 2026-08-16T21:21:15+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 212
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 117
- **Active tests**: 12
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (12 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-16_21-17-00_claim-office-example-mapping_v3-basic-tdd-pi_gpt-5-6-sol-codex-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-16_21-17-00_claim-office-example-mapping_v3-basic-tdd-pi_gpt-5-6-sol-codex-3

 ✓ src/claim-office.spec.ts  (12 tests) 272ms

 Test Files  1 passed (1)
      Tests  12 passed (12)
   Start at  21:21:16
   Duration  516ms (transform 65ms, setup 0ms, collect 62ms, tests 272ms, environment 0ms, prepare 55ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 82% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 72 | ×1 | 72 |
| Invocations | 115 | ×2 | 230 |
| Conditionals | 29 | ×4 | 116 |
| Loops | 11 | ×5 | 55 |
| Assignments | 54 | ×6 | 324 |
| **Total Mass** | | | **797** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 190 |
| Functions | 18 |
| Longest Function | 23 lines |
| Avg LOC/Function | 7.33 |
| Median LOC/Function | 5.50 |
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
| McCabe (Cyclomatic) | 7 | 3.13 | 0 |
| Cognitive (SonarJS) | 8 | 2.94 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 389288 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 3 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
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


