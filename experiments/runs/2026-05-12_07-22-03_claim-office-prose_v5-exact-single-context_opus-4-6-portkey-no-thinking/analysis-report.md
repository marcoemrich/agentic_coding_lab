# Analysis Report: 2026-05-12_07-22-03_claim-office-prose_v5-exact-single-context_opus-4-6-portkey-no-thinking

Generated: 2026-05-12T07:51:05+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-prose |
| Workflow | v5-exact-single-context |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 1740s |
| Started | 2026-05-12T07:22:03+00:00 |
| Ended | 2026-05-12T07:51:05+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 118
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 345
- **Active tests**: 18
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (18 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-12_07-22-03_claim-office-prose_v5-exact-single-context_opus-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-12_07-22-03_claim-office-prose_v5-exact-single-context_opus-4-6-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (18 tests) 5ms

 Test Files  1 passed (1)
      Tests  18 passed (18)
   Start at  07:51:06
   Duration  219ms (transform 45ms, setup 0ms, collect 64ms, tests 5ms, environment 0ms, prepare 52ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 53 | ×1 | 53 |
| Invocations | 41 | ×2 | 82 |
| Conditionals | 8 | ×4 | 32 |
| Loops | 5 | ×5 | 25 |
| Assignments | 46 | ×6 | 276 |
| **Total Mass** | | | **468** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 99 |
| Functions | 10 |
| Longest Function | 18 lines |
| Avg LOC/Function | 7.40 |
| Median LOC/Function | 5.50 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 11 |
| Code Quality | 0 |
| **Total** | **11** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 5 | 1.93 | 0 |
| Cognitive (SonarJS) | 6 | 3.17 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 34099386 |
| Context Utilization | 83% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 18 |
| Avg Cycle Time | 124.72s |
| Avg Red Phase | 42.01s |
| Avg Green Phase | 30.51s |
| Avg Refactor Phase | 52.2s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 36 |
| Predictions Total | 36 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 11 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 7 |


