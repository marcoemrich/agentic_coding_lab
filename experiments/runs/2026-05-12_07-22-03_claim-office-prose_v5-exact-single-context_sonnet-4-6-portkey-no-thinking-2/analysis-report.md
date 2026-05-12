# Analysis Report: 2026-05-12_07-22-03_claim-office-prose_v5-exact-single-context_sonnet-4-6-portkey-no-thinking-2

Generated: 2026-05-12T07:47:42+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-prose |
| Workflow | v5-exact-single-context |
| Model | sonnet-4-6-portkey-no-thinking |
| Model Version(s) | claude-sonnet-4-6 |
| Thinking | unknown |
| Duration | 1536s |
| Started | 2026-05-12T07:22:03+00:00 |
| Ended | 2026-05-12T07:47:42+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 90
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 90
- **Active tests**: 15
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (15 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-12_07-22-03_claim-office-prose_v5-exact-single-context_sonnet-4-6-portkey-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-12_07-22-03_claim-office-prose_v5-exact-single-context_sonnet-4-6-portkey-no-thinking-2

 ✓ src/claim-office.spec.ts  (15 tests) 4ms

 Test Files  1 passed (1)
      Tests  15 passed (15)
   Start at  07:47:43
   Duration  177ms (transform 28ms, setup 0ms, collect 27ms, tests 4ms, environment 0ms, prepare 48ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 46% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 47 | ×1 | 47 |
| Invocations | 28 | ×2 | 56 |
| Conditionals | 6 | ×4 | 24 |
| Loops | 4 | ×5 | 20 |
| Assignments | 47 | ×6 | 282 |
| **Total Mass** | | | **429** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 80 |
| Functions | 4 |
| Longest Function | 11 lines |
| Avg LOC/Function | 5.50 |
| Median LOC/Function | 5.00 |
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
| McCabe (Cyclomatic) | 3 | 1.70 | 0 |
| Cognitive (SonarJS) | 2 | 1.40 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 32117809 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 15 |
| Avg Cycle Time | 95.47s |
| Avg Red Phase | 24.01s |
| Avg Green Phase | 21.13s |
| Avg Refactor Phase | 50.33s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 29 |
| Predictions Total | 30 |
| Accuracy | 96% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 16 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


