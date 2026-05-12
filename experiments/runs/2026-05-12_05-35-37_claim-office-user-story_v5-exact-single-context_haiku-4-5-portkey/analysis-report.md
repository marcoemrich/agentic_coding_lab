# Analysis Report: 2026-05-12_05-35-37_claim-office-user-story_v5-exact-single-context_haiku-4-5-portkey

Generated: 2026-05-12T05:48:12+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-user-story |
| Workflow | v5-exact-single-context |
| Model | haiku-4-5-portkey |
| Model Version(s) | claude-haiku-4-5-20251001 |
| Thinking | true |
| Duration | 754s |
| Started | 2026-05-12T05:35:37+00:00 |
| Ended | 2026-05-12T05:48:12+00:00 |

## Code Metrics

- **Implementation files**: quote.ts
- **Implementation LOC** (total): 95
- **Test file**: quote.spec.ts
- **Test file LOC**: 60
- **Active tests**: 8
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (8 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-12_05-35-37_claim-office-user-story_v5-exact-single-context_haiku-4-5-portkey
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-12_05-35-37_claim-office-user-story_v5-exact-single-context_haiku-4-5-portkey

 ✓ src/quote.spec.ts  (8 tests) 3ms

 Test Files  1 passed (1)
      Tests  8 passed (8)
   Start at  05:48:12
   Duration  165ms (transform 28ms, setup 0ms, collect 29ms, tests 3ms, environment 0ms, prepare 48ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 96% |
| Branches | 90% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 51 | ×1 | 51 |
| Invocations | 25 | ×2 | 50 |
| Conditionals | 9 | ×4 | 36 |
| Loops | 6 | ×5 | 30 |
| Assignments | 15 | ×6 | 90 |
| **Total Mass** | | | **257** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 66 |
| Functions | 4 |
| Longest Function | 27 lines |
| Avg LOC/Function | 12.75 |
| Median LOC/Function | 10.50 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 8 |
| Code Quality | 0 |
| **Total** | **8** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 8 | 3.40 | 0 |
| Cognitive (SonarJS) | 6 | 3.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 27634057 |
| Context Utilization | 69% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 8 |
| Avg Cycle Time | 86.49s |
| Avg Red Phase | 18.64s |
| Avg Green Phase | 28.88s |
| Avg Refactor Phase | 38.97s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 16 |
| Predictions Total | 16 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 8 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


