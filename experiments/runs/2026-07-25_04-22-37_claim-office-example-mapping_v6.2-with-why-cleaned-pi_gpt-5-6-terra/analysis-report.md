# Analysis Report: 2026-07-25_04-22-37_claim-office-example-mapping_v6.2-with-why-cleaned-pi_gpt-5-6-terra

Generated: 2026-07-25T20:36:54+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-pi |
| Model | gpt-5-6-terra |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 297s |
| Started | 2026-07-25T04:22:37+00:00 |
| Ended | 2026-07-25T04:27:35+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 77
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 75
- **Active tests**: 15
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (15 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-25_04-22-37_claim-office-example-mapping_v6.2-with-why-cleaned-pi_gpt-5-6-terra
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-25_04-22-37_claim-office-example-mapping_v6.2-with-why-cleaned-pi_gpt-5-6-terra

 ✓ src/claim-office.spec.ts  (15 tests) 193ms

 Test Files  1 passed (1)
      Tests  15 passed (15)
   Start at  20:36:55
   Duration  605ms (transform 29ms, setup 0ms, collect 27ms, tests 193ms, environment 0ms, prepare 82ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 85% |
| Branches | 91% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 64 | ×1 | 64 |
| Invocations | 54 | ×2 | 108 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 8 | ×5 | 40 |
| Assignments | 36 | ×6 | 216 |
| **Total Mass** | | | **480** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 74 |
| Functions | 5 |
| Longest Function | 18 lines |
| Avg LOC/Function | 9.80 |
| Median LOC/Function | 8.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 14 |
| Code Quality | 0 |
| **Total** | **15** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 11 | 3.56 | 1 |
| Cognitive (SonarJS) | 15 | 6.20 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1150242 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 7 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 13 |
| Predictions Total | 14 |
| Accuracy | 92% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 4 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


