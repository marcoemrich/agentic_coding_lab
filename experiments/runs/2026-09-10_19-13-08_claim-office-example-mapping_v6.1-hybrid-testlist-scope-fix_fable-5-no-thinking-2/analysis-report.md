# Analysis Report: 2026-09-10_19-13-08_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_fable-5-no-thinking-2

Generated: 2026-09-10T20:04:18+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-hybrid-testlist-scope-fix |
| Model | fable-5-no-thinking |
| Model Version(s) | claude-fable-5 |
| Thinking | unknown |
| Duration | 3067s |
| Started | 2026-09-10T19:13:08+00:00 |
| Ended | 2026-09-10T20:04:18+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 276
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 630
- **Active tests**: 40
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (40 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-10_19-13-08_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_fable-5-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-10_19-13-08_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_fable-5-no-thinking-2

unknown item type: broomstick
 ✓ src/claim-office.spec.ts  (40 tests) 2487ms
more damaged amulet entries than insured: 1 > 0
more damaged sword entries than insured: 2 > 1
negative damage amount: -200

 Test Files  1 passed (1)
      Tests  40 passed (40)
   Start at  20:04:19
   Duration  2.78s (transform 92ms, setup 0ms, collect 83ms, tests 2.49s, environment 0ms, prepare 68ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 89% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 50 | ×1 | 50 |
| Invocations | 63 | ×2 | 126 |
| Conditionals | 8 | ×4 | 32 |
| Loops | 4 | ×5 | 20 |
| Assignments | 71 | ×6 | 426 |
| **Total Mass** | | | **654** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 222 |
| Functions | 16 |
| Longest Function | 15 lines |
| Avg LOC/Function | 5.56 |
| Median LOC/Function | 3.00 |
| Imports | 2 |

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
| McCabe (Cyclomatic) | 4 | 1.41 | 0 |
| Cognitive (SonarJS) | 3 | 1.56 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 70699545 |
| Context Utilization | 170% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 40 |
| Avg Cycle Time | 104.88s |
| Avg Red Phase | 15.86s |
| Avg Green Phase | 16.79s |
| Avg Refactor Phase | 72.23s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 0 |
| Predictions Total | 0 |
| Accuracy | N/A |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 26 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 14 |


