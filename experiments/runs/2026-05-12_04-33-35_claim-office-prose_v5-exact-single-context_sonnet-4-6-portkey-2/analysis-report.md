# Analysis Report: 2026-05-12_04-33-35_claim-office-prose_v5-exact-single-context_sonnet-4-6-portkey-2

Generated: 2026-05-12T05:11:04+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-prose |
| Workflow | v5-exact-single-context |
| Model | sonnet-4-6-portkey |
| Model Version(s) | claude-sonnet-4-6 |
| Thinking | true |
| Duration | 2236s |
| Started | 2026-05-12T04:33:35+00:00 |
| Ended | 2026-05-12T05:11:04+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 117
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 88
- **Active tests**: 12
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (12 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-12_04-33-35_claim-office-prose_v5-exact-single-context_sonnet-4-6-portkey-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-12_04-33-35_claim-office-prose_v5-exact-single-context_sonnet-4-6-portkey-2

 ✓ src/claim-office.spec.ts  (12 tests) 3ms

 Test Files  1 passed (1)
      Tests  12 passed (12)
   Start at  05:11:05
   Duration  153ms (transform 26ms, setup 0ms, collect 25ms, tests 3ms, environment 0ms, prepare 41ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 59% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 42 | ×1 | 42 |
| Invocations | 26 | ×2 | 52 |
| Conditionals | 9 | ×4 | 36 |
| Loops | 6 | ×5 | 30 |
| Assignments | 46 | ×6 | 276 |
| **Total Mass** | | | **436** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 101 |
| Functions | 4 |
| Longest Function | 34 lines |
| Avg LOC/Function | 10.00 |
| Median LOC/Function | 2.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 16 |
| Code Quality | 0 |
| **Total** | **16** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 8 | 2.36 | 0 |
| Cognitive (SonarJS) | 6 | 4.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 28052635 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 12 |
| Avg Cycle Time | 181.79s |
| Avg Red Phase | 44s |
| Avg Green Phase | 35.04s |
| Avg Refactor Phase | 102.75s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 23 |
| Predictions Total | 24 |
| Accuracy | 95% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 12 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


