# Analysis Report: 2026-05-12_01-06-17_claim-office-user-story_v5-exact-single-context_opus-4-6-portkey-no-thinking

Generated: 2026-06-02T07:56:12+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-user-story |
| Workflow | v5-exact-single-context |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 1682s |
| Started | 2026-05-12T01:06:17+00:00 |
| Ended | 2026-05-12T01:34:22+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 190
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 254
- **Active tests**: 16
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (16 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_01-06-17_claim-office-user-story_v5-exact-single-context_opus-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_01-06-17_claim-office-user-story_v5-exact-single-context_opus-4-6-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (16 tests) 4ms

 Test Files  1 passed (1)
      Tests  16 passed (16)
   Start at  07:56:14
   Duration  361ms (transform 35ms, setup 0ms, collect 27ms, tests 4ms, environment 0ms, prepare 77ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 94% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 45 | ×1 | 45 |
| Invocations | 58 | ×2 | 116 |
| Conditionals | 7 | ×4 | 28 |
| Loops | 6 | ×5 | 30 |
| Assignments | 59 | ×6 | 354 |
| **Total Mass** | | | **573** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 162 |
| Functions | 13 |
| Longest Function | 13 lines |
| Avg LOC/Function | 7.62 |
| Median LOC/Function | 9.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 3 |
| Code Quality | 0 |
| **Total** | **3** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 5 | 1.67 | 0 |
| Cognitive (SonarJS) | 4 | 2.29 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 36034013 |
| Context Utilization | 83% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 16 |
| Avg Cycle Time | 120.14s |
| Avg Red Phase | 36.53s |
| Avg Green Phase | 36.94s |
| Avg Refactor Phase | 46.67s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 31 |
| Predictions Total | 32 |
| Accuracy | 96% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 12 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 4 |


