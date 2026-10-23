# Analysis Report: 2026-10-20_03-23-51_claim-office-example-mapping_exact-subagents-v1-cc_opus-5-no-thinking

Generated: 2026-10-20T04:27:02+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-subagents-v1-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 3789s |
| Started | 2026-10-20T03:23:51+00:00 |
| Ended | 2026-10-20T04:27:02+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 288
- **Test files**: claim-office.spec.ts, cli.spec.ts
- **Test LOC** (total): 648
- **Active tests**: 56
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (56 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-20_03-23-51_claim-office-example-mapping_exact-subagents-v1-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-20_03-23-51_claim-office-example-mapping_exact-subagents-v1-cc_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (48 tests) 8ms
 ✓ src/cli.spec.ts  (8 tests) 2277ms

 Test Files  2 passed (2)
      Tests  56 passed (56)
   Start at  04:27:02
   Duration  2.59s (transform 57ms, setup 0ms, collect 55ms, tests 2.29s, environment 0ms, prepare 91ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 54 | ×1 | 54 |
| Invocations | 79 | ×2 | 158 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 10 | ×5 | 50 |
| Assignments | 100 | ×6 | 600 |
| **Total Mass** | | | **910** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 199 |
| Functions | 42 |
| Longest Function | 9 lines |
| Avg LOC/Function | 3.05 |
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
| McCabe (Cyclomatic) | 2 | 1.27 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 55847085 |
| Context Utilization | 103% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 46 |
| Avg Cycle Time | 99.06s |
| Avg Red Phase | 36.64s |
| Avg Green Phase | 17.88s |
| Avg Refactor Phase | 44.54s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 110 |
| Predictions Total | 113 |
| Accuracy | 97% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 21 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 22 |


