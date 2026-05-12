# Analysis Report: 2026-05-12_04-57-39_claim-office-example-mapping_v5-exact-single-context_opus-4-6-portkey-no-thinking

Generated: 2026-05-12T22:38:17+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5-exact-single-context |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 2525s |
| Started | 2026-05-12T04:57:39+00:00 |
| Ended | 2026-05-12T05:39:45+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 156
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 425
- **Active tests**: 39
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (39 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_04-57-39_claim-office-example-mapping_v5-exact-single-context_opus-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_04-57-39_claim-office-example-mapping_v5-exact-single-context_opus-4-6-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (39 tests) 7ms

 Test Files  1 passed (1)
      Tests  39 passed (39)
   Start at  22:38:17
   Duration  378ms (transform 38ms, setup 1ms, collect 36ms, tests 7ms, environment 0ms, prepare 72ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 56 | ×1 | 56 |
| Invocations | 45 | ×2 | 90 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 9 | ×5 | 45 |
| Assignments | 52 | ×6 | 312 |
| **Total Mass** | | | **547** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 136 |
| Functions | 5 |
| Longest Function | 31 lines |
| Avg LOC/Function | 15.60 |
| Median LOC/Function | 16.00 |
| Imports | 1 |

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
| McCabe (Cyclomatic) | 8 | 2.46 | 0 |
| Cognitive (SonarJS) | 10 | 5.40 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 54280436 |
| Context Utilization | 83% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 32 |
| Avg Cycle Time | 118.99s |
| Avg Red Phase | 30.33s |
| Avg Green Phase | 37.32s |
| Avg Refactor Phase | 51.34s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 64 |
| Predictions Total | 64 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 15 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 14 |


