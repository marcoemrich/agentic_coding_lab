# Analysis Report: 2026-05-17_04-01-47_claim-office-example-mapping_v7-hybrid-green-refactor_opus-4-7-no-thinking

Generated: 2026-05-17T04:48:58+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v7-hybrid-green-refactor |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 2830s |
| Started | 2026-05-17T04:01:47+00:00 |
| Ended | 2026-05-17T04:48:58+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 246
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 182
- **Active tests**: 24
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (24 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-17_04-01-47_claim-office-example-mapping_v7-hybrid-green-refactor_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-17_04-01-47_claim-office-example-mapping_v7-hybrid-green-refactor_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (24 tests) 5ms

 Test Files  1 passed (1)
      Tests  24 passed (24)
   Start at  04:48:58
   Duration  163ms (transform 36ms, setup 0ms, collect 33ms, tests 5ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 58% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 61 | ×1 | 61 |
| Invocations | 56 | ×2 | 112 |
| Conditionals | 19 | ×4 | 76 |
| Loops | 5 | ×5 | 25 |
| Assignments | 80 | ×6 | 480 |
| **Total Mass** | | | **754** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 210 |
| Functions | 23 |
| Longest Function | 14 lines |
| Avg LOC/Function | 3.52 |
| Median LOC/Function | 2.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 1 |
| Code Quality | 0 |
| **Total** | **2** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 4 | 1.63 | 0 |
| Cognitive (SonarJS) | 3 | 1.46 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 24912043 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 24 |
| Avg Cycle Time | 132.22s |
| Avg Red Phase | 30.53s |
| Avg Green Phase | 30.58s |
| Avg Refactor Phase | 71.11s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 43 |
| Predictions Total | 46 |
| Accuracy | 93% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 20 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 4 |


