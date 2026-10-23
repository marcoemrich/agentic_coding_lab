# Analysis Report: 2026-10-23_02-20-28_claim-office-example-mapping_exact-ptdd-v1-pi_gemini-4-argon-2

Generated: 2026-10-23T03:17:06+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-pi |
| Model | gemini-4-argon |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 3387s |
| Started | 2026-10-23T02:20:30+00:00 |
| Ended | 2026-10-23T03:17:06+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts, node-shims.d.ts
- **Implementation LOC** (total): 322
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 687
- **Active tests**: 35
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (35 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-23_02-20-28_claim-office-example-mapping_exact-ptdd-v1-pi_gemini-4-argon-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-23_02-20-28_claim-office-example-mapping_exact-ptdd-v1-pi_gemini-4-argon-2

 ✓ src/claim-office.spec.ts  (35 tests) 479ms

 Test Files  1 passed (1)
      Tests  35 passed (35)
   Start at  03:17:07
   Duration  821ms (transform 91ms, setup 0ms, collect 94ms, tests 479ms, environment 0ms, prepare 86ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 94% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 62 | ×1 | 62 |
| Invocations | 72 | ×2 | 144 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 6 | ×5 | 30 |
| Assignments | 54 | ×6 | 324 |
| **Total Mass** | | | **604** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 282 |
| Functions | 19 |
| Longest Function | 25 lines |
| Avg LOC/Function | 5.74 |
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
| McCabe (Cyclomatic) | 4 | 1.56 | 0 |
| Cognitive (SonarJS) | 3 | 1.78 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 10397272 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 35 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 70 |
| Predictions Total | 70 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 35 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


