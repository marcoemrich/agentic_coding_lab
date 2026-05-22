# Analysis Report: 2026-05-21_20-29-37_claim-office-lite-prose_v5-exact-single-context_opus-4-7-portkey-no-thinking

Generated: 2026-05-21T20:39:00+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-lite-prose |
| Workflow | v5-exact-single-context |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 562s |
| Started | 2026-05-21T20:29:37+00:00 |
| Ended | 2026-05-21T20:39:00+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, quote.ts, scenario.ts
- **Implementation LOC** (total): 222
- **Test file**: cli.spec.ts
- **Test file LOC**: 32
- **Active tests**: 3
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (27 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-21_20-29-37_claim-office-lite-prose_v5-exact-single-context_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-21_20-29-37_claim-office-lite-prose_v5-exact-single-context_opus-4-7-portkey-no-thinking

 ✓ src/quote.spec.ts  (19 tests) 3ms
 ✓ src/claim.spec.ts  (5 tests) 3ms
 ✓ src/cli.spec.ts  (3 tests) 2ms

 Test Files  3 passed (3)
      Tests  27 passed (27)
   Start at  20:39:01
   Duration  444ms (transform 47ms, setup 0ms, collect 53ms, tests 8ms, environment 0ms, prepare 134ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 53 | ×1 | 53 |
| Invocations | 62 | ×2 | 124 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 6 | ×5 | 30 |
| Assignments | 73 | ×6 | 438 |
| **Total Mass** | | | **693** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 187 |
| Functions | 17 |
| Longest Function | 24 lines |
| Avg LOC/Function | 6.65 |
| Median LOC/Function | 4.00 |
| Imports | 5 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 4 |
| Code Quality | 0 |
| **Total** | **4** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 5 | 1.83 | 0 |
| Cognitive (SonarJS) | 5 | 2.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 16214143 |
| Context Utilization | 12% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 5 |
| Avg Cycle Time | 110.59s |
| Avg Red Phase | 81.9s |
| Avg Green Phase | 15.81s |
| Avg Refactor Phase | 12.88s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 3 |
| Predictions Total | 3 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 4 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


