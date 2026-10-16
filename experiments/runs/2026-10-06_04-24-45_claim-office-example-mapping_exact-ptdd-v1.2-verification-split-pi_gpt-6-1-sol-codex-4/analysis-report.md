# Analysis Report: 2026-10-06_04-24-45_claim-office-example-mapping_exact-ptdd-v1.2-verification-split-pi_gpt-6-1-sol-codex-4

Generated: 2026-10-06T04:44:33+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1.2-verification-split-pi |
| Model | gpt-6-1-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1181s |
| Started | 2026-10-06T04:24:47+00:00 |
| Ended | 2026-10-06T04:44:33+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, office.ts
- **Implementation LOC** (total): 132
- **Test files**: office.spec.ts
- **Test LOC** (total): 107
- **Active tests**: 52
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (52 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-06_04-24-45_claim-office-example-mapping_exact-ptdd-v1.2-verification-split-pi_gpt-6-1-sol-codex-4
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-06_04-24-45_claim-office-example-mapping_exact-ptdd-v1.2-verification-split-pi_gpt-6-1-sol-codex-4

 ✓ src/office.spec.ts  (52 tests) 991ms

 Test Files  1 passed (1)
      Tests  52 passed (52)
   Start at  04:44:34
   Duration  1.50s (transform 174ms, setup 0ms, collect 173ms, tests 991ms, environment 0ms, prepare 126ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 91% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 63 | ×1 | 63 |
| Invocations | 64 | ×2 | 128 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 5 | ×5 | 25 |
| Assignments | 43 | ×6 | 258 |
| **Total Mass** | | | **522** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 112 |
| Functions | 17 |
| Longest Function | 12 lines |
| Avg LOC/Function | 4.24 |
| Median LOC/Function | 3.00 |
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
| McCabe (Cyclomatic) | 3 | 1.61 | 0 |
| Cognitive (SonarJS) | 2 | 1.27 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 8437485 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 52 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 103 |
| Predictions Total | 104 |
| Accuracy | 99% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 52 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


