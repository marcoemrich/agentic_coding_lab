# Analysis Report: 2026-07-28_23-28-51_claim-office-example-mapping_v6.2.1-phase-continuation-pi_kimi-k3-nebius

Generated: 2026-07-29T01:28:55+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2.1-phase-continuation-pi |
| Model | kimi-k3-nebius |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 7201s |
| Started | 2026-07-28T23:28:51+00:00 |
| Ended | 2026-07-29T01:28:55+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts
- **Implementation LOC** (total): 196
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 273
- **Active tests**: 23
- **Remaining todos**: 14

## Test Results

**Status**: ✅ All tests passing (23 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-28_23-28-51_claim-office-example-mapping_v6.2.1-phase-continuation-pi_kimi-k3-nebius
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-28_23-28-51_claim-office-example-mapping_v6.2.1-phase-continuation-pi_kimi-k3-nebius

 ✓ src/claim-office.spec.ts  (37 tests | 14 skipped) 4ms

 Test Files  1 passed (1)
      Tests  23 passed | 14 todo (37)
   Start at  01:28:56
   Duration  184ms (transform 44ms, setup 0ms, collect 32ms, tests 4ms, environment 0ms, prepare 50ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 45 | ×1 | 45 |
| Invocations | 30 | ×2 | 60 |
| Conditionals | 7 | ×4 | 28 |
| Loops | 5 | ×5 | 25 |
| Assignments | 56 | ×6 | 336 |
| **Total Mass** | | | **494** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 164 |
| Functions | 15 |
| Longest Function | 18 lines |
| Avg LOC/Function | 4.00 |
| Median LOC/Function | 2.00 |
| Imports | 0 |

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
| McCabe (Cyclomatic) | 3 | 1.32 | 0 |
| Cognitive (SonarJS) | 2 | 1.17 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 8064175 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 29 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 34 |
| Predictions Total | 34 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 18 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


