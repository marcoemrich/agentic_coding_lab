# Analysis Report: 2026-05-19_00-33-23_claim-office-example-mapping_v4-exact-subagents_opus-4-6-portkey-no-thinking-3

Generated: 2026-05-19T01:29:50+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4-exact-subagents |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 3385s |
| Started | 2026-05-19T00:33:23+00:00 |
| Ended | 2026-05-19T01:29:50+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 213
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 169
- **Active tests**: 21
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (21 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-19_00-33-23_claim-office-example-mapping_v4-exact-subagents_opus-4-6-portkey-no-thinking-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-19_00-33-23_claim-office-example-mapping_v4-exact-subagents_opus-4-6-portkey-no-thinking-3

 ✓ src/claim-office.spec.ts  (21 tests) 4ms

 Test Files  1 passed (1)
      Tests  21 passed (21)
   Start at  01:29:51
   Duration  161ms (transform 32ms, setup 1ms, collect 30ms, tests 4ms, environment 0ms, prepare 41ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 46% |
| Branches | 90% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 82 | ×1 | 82 |
| Invocations | 88 | ×2 | 176 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 14 | ×5 | 70 |
| Assignments | 66 | ×6 | 396 |
| **Total Mass** | | | **772** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 178 |
| Functions | 14 |
| Longest Function | 71 lines |
| Avg LOC/Function | 8.71 |
| Median LOC/Function | 2.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 7 |
| Duplication | 0 |
| Magic Numbers | 4 |
| Code Quality | 0 |
| **Total** | **11** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 18 | 2.15 | 1 |
| Cognitive (SonarJS) | 45 | 4.83 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 13213114 |
| Context Utilization | 64% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 21 |
| Avg Cycle Time | 153.54s |
| Avg Red Phase | 38.37s |
| Avg Green Phase | 33.87s |
| Avg Refactor Phase | 81.3s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 46 |
| Predictions Total | 46 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 15 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 6 |


