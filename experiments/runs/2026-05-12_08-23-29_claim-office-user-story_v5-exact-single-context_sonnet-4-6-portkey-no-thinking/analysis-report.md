# Analysis Report: 2026-05-12_08-23-29_claim-office-user-story_v5-exact-single-context_sonnet-4-6-portkey-no-thinking

Generated: 2026-05-12T08:58:27+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-user-story |
| Workflow | v5-exact-single-context |
| Model | sonnet-4-6-portkey-no-thinking |
| Model Version(s) | claude-sonnet-4-6 |
| Thinking | unknown |
| Duration | 2096s |
| Started | 2026-05-12T08:23:29+00:00 |
| Ended | 2026-05-12T08:58:27+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 90
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 343
- **Active tests**: 17
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (17 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-12_08-23-29_claim-office-user-story_v5-exact-single-context_sonnet-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-12_08-23-29_claim-office-user-story_v5-exact-single-context_sonnet-4-6-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (17 tests) 3ms

 Test Files  1 passed (1)
      Tests  17 passed (17)
   Start at  08:58:27
   Duration  206ms (transform 55ms, setup 0ms, collect 54ms, tests 3ms, environment 0ms, prepare 50ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 47 | ×1 | 47 |
| Invocations | 20 | ×2 | 40 |
| Conditionals | 9 | ×4 | 36 |
| Loops | 1 | ×5 | 5 |
| Assignments | 52 | ×6 | 312 |
| **Total Mass** | | | **440** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 81 |
| Functions | 3 |
| Longest Function | 19 lines |
| Avg LOC/Function | 14.67 |
| Median LOC/Function | 14.00 |
| Imports | 1 |

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
| McCabe (Cyclomatic) | 8 | 3.40 | 0 |
| Cognitive (SonarJS) | 7 | 4.67 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 47889308 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 18 |
| Avg Cycle Time | 122.03s |
| Avg Red Phase | 34.95s |
| Avg Green Phase | 27.3s |
| Avg Refactor Phase | 59.78s |

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
| Refactorings Applied | 17 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 3 |


