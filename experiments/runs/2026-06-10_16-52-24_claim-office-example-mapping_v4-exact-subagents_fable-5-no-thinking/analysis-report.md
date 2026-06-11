# Analysis Report: 2026-06-10_16-52-24_claim-office-example-mapping_v4-exact-subagents_fable-5-no-thinking

Generated: 2026-06-10T18:52:26+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4-exact-subagents |
| Model | fable-5-no-thinking |
| Model Version(s) | claude-fable-5 |
| Thinking | unknown |
| Duration | 7201s |
| Started | 2026-06-10T16:52:24+00:00 |
| Ended | 2026-06-10T18:52:26+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 243
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 712
- **Active tests**: 38
- **Remaining todos**: 1

## Test Results

**Status**: ✅ All tests passing (38 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-06-10_16-52-24_claim-office-example-mapping_v4-exact-subagents_fable-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-06-10_16-52-24_claim-office-example-mapping_v4-exact-subagents_fable-5-no-thinking

 ✓ src/claim-office.spec.ts  (39 tests | 1 skipped) 811ms

 Test Files  1 passed (1)
      Tests  38 passed | 1 todo (39)
   Start at  18:52:27
   Duration  986ms (transform 44ms, setup 0ms, collect 51ms, tests 811ms, environment 0ms, prepare 41ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 89% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 48 | ×1 | 48 |
| Invocations | 53 | ×2 | 106 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 7 | ×5 | 35 |
| Assignments | 69 | ×6 | 414 |
| **Total Mass** | | | **647** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 207 |
| Functions | 17 |
| Longest Function | 22 lines |
| Avg LOC/Function | 4.06 |
| Median LOC/Function | 2.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 0 |
| Code Quality | 0 |
| **Total** | **0** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 6 | 1.86 | 0 |
| Cognitive (SonarJS) | 6 | 1.91 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 12891301 |
| Context Utilization | 88% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 38 |
| Avg Cycle Time | 178.33s |
| Avg Red Phase | 52.38s |
| Avg Green Phase | 39.76s |
| Avg Refactor Phase | 86.19s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 76 |
| Predictions Total | 76 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 38 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 15 |


