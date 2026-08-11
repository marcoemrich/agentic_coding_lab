# Analysis Report: 2026-08-10_09-46-02_claim-office-example-mapping_v3-basic-tdd-pi_gpt-5-6-sol

Generated: 2026-08-11T23:15:40+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v3-basic-tdd-pi |
| Model | gpt-5-6-sol |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 180s |
| Started | 2026-08-10T09:46:02+00:00 |
| Ended | 2026-08-10T09:49:03+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 132
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 68
- **Active tests**: 5
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (5 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-08-10_09-46-02_claim-office-example-mapping_v3-basic-tdd-pi_gpt-5-6-sol
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-08-10_09-46-02_claim-office-example-mapping_v3-basic-tdd-pi_gpt-5-6-sol

 ✓ src/claim-office.spec.ts  (5 tests) 3ms

 Test Files  1 passed (1)
      Tests  5 passed (5)
   Start at  23:15:41
   Duration  386ms (transform 28ms, setup 0ms, collect 25ms, tests 3ms, environment 0ms, prepare 89ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 78% |
| Branches | 89% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 60 | ×1 | 60 |
| Invocations | 82 | ×2 | 164 |
| Conditionals | 19 | ×4 | 76 |
| Loops | 10 | ×5 | 50 |
| Assignments | 41 | ×6 | 246 |
| **Total Mass** | | | **596** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 121 |
| Functions | 9 |
| Longest Function | 22 lines |
| Avg LOC/Function | 9.67 |
| Median LOC/Function | 9.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 15 |
| Code Quality | 0 |
| **Total** | **15** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 10 | 2.67 | 0 |
| Cognitive (SonarJS) | 10 | 3.89 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 174956 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 2 |
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


