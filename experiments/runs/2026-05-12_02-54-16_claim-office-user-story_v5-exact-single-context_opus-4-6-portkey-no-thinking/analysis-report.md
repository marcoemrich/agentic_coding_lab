# Analysis Report: 2026-05-12_02-54-16_claim-office-user-story_v5-exact-single-context_opus-4-6-portkey-no-thinking

Generated: 2026-06-02T07:57:40+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-user-story |
| Workflow | v5-exact-single-context |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 1885s |
| Started | 2026-05-12T02:54:16+00:00 |
| Ended | 2026-05-12T03:25:43+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 174
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 426
- **Active tests**: 19
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (19 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_02-54-16_claim-office-user-story_v5-exact-single-context_opus-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_02-54-16_claim-office-user-story_v5-exact-single-context_opus-4-6-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (19 tests) 4ms

 Test Files  1 passed (1)
      Tests  19 passed (19)
   Start at  07:57:43
   Duration  339ms (transform 31ms, setup 0ms, collect 30ms, tests 4ms, environment 0ms, prepare 69ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 82% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 51 | ×1 | 51 |
| Invocations | 42 | ×2 | 84 |
| Conditionals | 18 | ×4 | 72 |
| Loops | 5 | ×5 | 25 |
| Assignments | 53 | ×6 | 318 |
| **Total Mass** | | | **550** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 153 |
| Functions | 6 |
| Longest Function | 28 lines |
| Avg LOC/Function | 12.33 |
| Median LOC/Function | 10.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 13 |
| Code Quality | 0 |
| **Total** | **14** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 10 | 3.75 | 0 |
| Cognitive (SonarJS) | 14 | 5.60 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 41244221 |
| Context Utilization | 83% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 19 |
| Avg Cycle Time | 120.49s |
| Avg Red Phase | 39.51s |
| Avg Green Phase | 33.32s |
| Avg Refactor Phase | 47.66s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 38 |
| Predictions Total | 38 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 13 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 6 |


