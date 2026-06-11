# Analysis Report: 2026-06-10_01-33-15_claim-office-example-mapping_v4-exact-subagents_fable-5-no-thinking

Generated: 2026-06-10T03:09:04+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4-exact-subagents |
| Model | fable-5-no-thinking |
| Model Version(s) | claude-fable-5 |
| Thinking | unknown |
| Duration | 5748s |
| Started | 2026-06-10T01:33:15+00:00 |
| Ended | 2026-06-10T03:09:04+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 269
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 658
- **Active tests**: 39
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (39 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-06-10_01-33-15_claim-office-example-mapping_v4-exact-subagents_fable-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-06-10_01-33-15_claim-office-example-mapping_v4-exact-subagents_fable-5-no-thinking

 ✓ src/claim-office.spec.ts  (39 tests) 329ms

 Test Files  1 passed (1)
      Tests  39 passed (39)
   Start at  03:09:05
   Duration  508ms (transform 42ms, setup 0ms, collect 51ms, tests 329ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 97% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 50 | ×1 | 50 |
| Invocations | 62 | ×2 | 124 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 6 | ×5 | 30 |
| Assignments | 94 | ×6 | 564 |
| **Total Mass** | | | **812** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 211 |
| Functions | 31 |
| Longest Function | 16 lines |
| Avg LOC/Function | 2.52 |
| Median LOC/Function | 2.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 1 |
| Code Quality | 0 |
| **Total** | **1** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 4 | 1.36 | 0 |
| Cognitive (SonarJS) | 4 | 1.60 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 18013050 |
| Context Utilization | 82% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 39 |
| Avg Cycle Time | 165.87s |
| Avg Red Phase | 48.39s |
| Avg Green Phase | 37.79s |
| Avg Refactor Phase | 79.69s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 78 |
| Predictions Total | 78 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 24 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 15 |


