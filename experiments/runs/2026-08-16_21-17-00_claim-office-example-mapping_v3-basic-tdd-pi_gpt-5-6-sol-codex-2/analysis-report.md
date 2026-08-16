# Analysis Report: 2026-08-16_21-17-00_claim-office-example-mapping_v3-basic-tdd-pi_gpt-5-6-sol-codex-2

Generated: 2026-08-16T21:19:49+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v3-basic-tdd-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 167s |
| Started | 2026-08-16T21:17:00+00:00 |
| Ended | 2026-08-16T21:19:49+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 172
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 82
- **Active tests**: 9
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (11 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-16_21-17-00_claim-office-example-mapping_v3-basic-tdd-pi_gpt-5-6-sol-codex-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-16_21-17-00_claim-office-example-mapping_v3-basic-tdd-pi_gpt-5-6-sol-codex-2

 ✓ src/claim-office.spec.ts  (9 tests) 4ms
 ✓ src/cli.spec.ts  (2 tests) 144ms

 Test Files  2 passed (2)
      Tests  11 passed (11)
   Start at  21:19:50
   Duration  459ms (transform 36ms, setup 0ms, collect 39ms, tests 148ms, environment 0ms, prepare 98ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 75% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 73 | ×1 | 73 |
| Invocations | 101 | ×2 | 202 |
| Conditionals | 29 | ×4 | 116 |
| Loops | 9 | ×5 | 45 |
| Assignments | 49 | ×6 | 294 |
| **Total Mass** | | | **730** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 145 |
| Functions | 9 |
| Longest Function | 47 lines |
| Avg LOC/Function | 12.67 |
| Median LOC/Function | 9.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 3 |
| Duplication | 0 |
| Magic Numbers | 18 |
| Code Quality | 0 |
| **Total** | **21** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 19 | 4.29 | 1 |
| Cognitive (SonarJS) | 29 | 5.90 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 243261 |
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
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


