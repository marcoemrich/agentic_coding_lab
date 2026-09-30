# Analysis Report: 2026-09-30_00-33-52_claim-office-example-mapping_exact-single-context-v3-no-subagent-cc_opus-5-5-no-thinking

Generated: 2026-09-30T00:51:02+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-single-context-v3-no-subagent-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5 |
| Thinking | unknown |
| Duration | 1027s |
| Started | 2026-09-30T00:33:52+00:00 |
| Ended | 2026-09-30T00:51:02+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts, node.d.ts
- **Implementation LOC** (total): 212
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 230
- **Active tests**: 36
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (36 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-30_00-33-52_claim-office-example-mapping_exact-single-context-v3-no-subagent-cc_opus-5-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-30_00-33-52_claim-office-example-mapping_exact-single-context-v3-no-subagent-cc_opus-5-5-no-thinking

 ✓ src/claim-office.spec.ts  (36 tests) 307ms

 Test Files  1 passed (1)
      Tests  36 passed (36)
   Start at  00:51:03
   Duration  579ms (transform 69ms, setup 0ms, collect 57ms, tests 307ms, environment 0ms, prepare 75ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 96% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 54 | ×1 | 54 |
| Invocations | 59 | ×2 | 118 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 7 | ×5 | 35 |
| Assignments | 66 | ×6 | 396 |
| **Total Mass** | | | **655** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 166 |
| Functions | 25 |
| Longest Function | 15 lines |
| Avg LOC/Function | 3.80 |
| Median LOC/Function | 2.00 |
| Imports | 2 |

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
| McCabe (Cyclomatic) | 3 | 1.41 | 0 |
| Cognitive (SonarJS) | 2 | 1.33 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 108282196 |
| Context Utilization | 209% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 36 |
| Avg Cycle Time | 27.64s |
| Avg Red Phase | 10.54s |
| Avg Green Phase | 6.54s |
| Avg Refactor Phase | 10.56s |

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
| Refactorings Applied | 36 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


