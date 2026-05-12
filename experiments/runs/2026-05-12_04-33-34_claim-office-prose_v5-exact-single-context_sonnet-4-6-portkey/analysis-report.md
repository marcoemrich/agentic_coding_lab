# Analysis Report: 2026-05-12_04-33-34_claim-office-prose_v5-exact-single-context_sonnet-4-6-portkey

Generated: 2026-05-12T05:08:24+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-prose |
| Workflow | v5-exact-single-context |
| Model | sonnet-4-6-portkey |
| Model Version(s) | claude-sonnet-4-6 |
| Thinking | true |
| Duration | 2070s |
| Started | 2026-05-12T04:33:34+00:00 |
| Ended | 2026-05-12T05:08:23+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 81
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 88
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (10 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-12_04-33-34_claim-office-prose_v5-exact-single-context_sonnet-4-6-portkey
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-12_04-33-34_claim-office-prose_v5-exact-single-context_sonnet-4-6-portkey

 ✓ src/claim-office.spec.ts  (10 tests) 3ms

 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  05:08:24
   Duration  164ms (transform 25ms, setup 0ms, collect 24ms, tests 3ms, environment 0ms, prepare 45ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 48% |
| Branches | 90% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 45 | ×1 | 45 |
| Invocations | 22 | ×2 | 44 |
| Conditionals | 4 | ×4 | 16 |
| Loops | 3 | ×5 | 15 |
| Assignments | 38 | ×6 | 228 |
| **Total Mass** | | | **348** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 71 |
| Functions | 4 |
| Longest Function | 2 lines |
| Avg LOC/Function | 2.00 |
| Median LOC/Function | 2.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 17 |
| Code Quality | 0 |
| **Total** | **17** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 8 | 3.00 | 0 |
| Cognitive (SonarJS) | 8 | 3.67 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 24881093 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 10 |
| Avg Cycle Time | 200.02s |
| Avg Red Phase | 35.36s |
| Avg Green Phase | 28.19s |
| Avg Refactor Phase | 136.47s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 21 |
| Predictions Total | 21 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 10 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


