# Analysis Report: 2026-05-12_05-51-49_claim-office-user-story_v5-exact-single-context_sonnet-4-6-portkey

Generated: 2026-05-12T06:27:31+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-user-story |
| Workflow | v5-exact-single-context |
| Model | sonnet-4-6-portkey |
| Model Version(s) | claude-sonnet-4-6 |
| Thinking | true |
| Duration | 2141s |
| Started | 2026-05-12T05:51:49+00:00 |
| Ended | 2026-05-12T06:27:31+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 107
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 271
- **Active tests**: 13
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (13 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-12_05-51-49_claim-office-user-story_v5-exact-single-context_sonnet-4-6-portkey
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-12_05-51-49_claim-office-user-story_v5-exact-single-context_sonnet-4-6-portkey

 ✓ src/claim-office.spec.ts  (13 tests) 3ms

 Test Files  1 passed (1)
      Tests  13 passed (13)
   Start at  06:27:32
   Duration  161ms (transform 32ms, setup 0ms, collect 30ms, tests 3ms, environment 0ms, prepare 43ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 49 | ×1 | 49 |
| Invocations | 24 | ×2 | 48 |
| Conditionals | 8 | ×4 | 32 |
| Loops | 5 | ×5 | 25 |
| Assignments | 47 | ×6 | 282 |
| **Total Mass** | | | **436** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 91 |
| Functions | 1 |
| Longest Function | 48 lines |
| Avg LOC/Function | 48.00 |
| Median LOC/Function | 48.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 2 |
| Duplication | 0 |
| Magic Numbers | 5 |
| Code Quality | 0 |
| **Total** | **7** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 6 | 2.56 | 0 |
| Cognitive (SonarJS) | 5 | 2.60 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 34942470 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 13 |
| Avg Cycle Time | 158.70s |
| Avg Red Phase | 43.79s |
| Avg Green Phase | 37.82s |
| Avg Refactor Phase | 77.09s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 25 |
| Predictions Total | 26 |
| Accuracy | 96% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 13 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


