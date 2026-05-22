# Analysis Report: 2026-05-21_20-21-48_claim-office-lite-prose_v7-hybrid-green-refactor_opus-4-7-portkey-no-thinking

Generated: 2026-05-21T20:41:53+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-lite-prose |
| Workflow | v7-hybrid-green-refactor |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 1203s |
| Started | 2026-05-21T20:21:48+00:00 |
| Ended | 2026-05-21T20:41:53+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 124
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 222
- **Active tests**: 13
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (13 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-21_20-21-48_claim-office-lite-prose_v7-hybrid-green-refactor_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-21_20-21-48_claim-office-lite-prose_v7-hybrid-green-refactor_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (13 tests) 4ms

 Test Files  1 passed (1)
      Tests  13 passed (13)
   Start at  20:41:54
   Duration  168ms (transform 34ms, setup 0ms, collect 32ms, tests 4ms, environment 0ms, prepare 44ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 85% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 36 | ×1 | 36 |
| Invocations | 40 | ×2 | 80 |
| Conditionals | 6 | ×4 | 24 |
| Loops | 3 | ×5 | 15 |
| Assignments | 53 | ×6 | 318 |
| **Total Mass** | | | **473** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 104 |
| Functions | 17 |
| Longest Function | 16 lines |
| Avg LOC/Function | 4.53 |
| Median LOC/Function | 2.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 5 |
| Code Quality | 0 |
| **Total** | **5** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 3 | 1.52 | 0 |
| Cognitive (SonarJS) | 2 | 1.11 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 12386520 |
| Context Utilization | 13% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 13 |
| Avg Cycle Time | 95.52s |
| Avg Red Phase | 21.41s |
| Avg Green Phase | 26.18s |
| Avg Refactor Phase | 47.93s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 26 |
| Predictions Total | 26 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 12 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


