# Analysis Report: 2026-09-30_00-41-32_claim-office-example-mapping_exact-single-context-v3-no-subagent-cc_opus-5-5-no-thinking

Generated: 2026-09-30T00:57:05+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-single-context-v3-no-subagent-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5 |
| Thinking | unknown |
| Duration | 929s |
| Started | 2026-09-30T00:41:32+00:00 |
| Ended | 2026-09-30T00:57:05+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 176
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 244
- **Active tests**: 38
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (38 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-30_00-41-32_claim-office-example-mapping_exact-single-context-v3-no-subagent-cc_opus-5-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-30_00-41-32_claim-office-example-mapping_exact-single-context-v3-no-subagent-cc_opus-5-5-no-thinking

 ✓ src/claim-office.spec.ts  (38 tests) 310ms

 Test Files  1 passed (1)
      Tests  38 passed (38)
   Start at  00:57:06
   Duration  566ms (transform 55ms, setup 0ms, collect 63ms, tests 310ms, environment 0ms, prepare 63ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 52 | ×1 | 52 |
| Invocations | 59 | ×2 | 118 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 6 | ×5 | 30 |
| Assignments | 74 | ×6 | 444 |
| **Total Mass** | | | **696** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 140 |
| Functions | 19 |
| Longest Function | 10 lines |
| Avg LOC/Function | 4.58 |
| Median LOC/Function | 4.00 |
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
| McCabe (Cyclomatic) | 5 | 1.44 | 0 |
| Cognitive (SonarJS) | 6 | 1.88 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 114540976 |
| Context Utilization | 221% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 38 |
| Avg Cycle Time | 23.86s |
| Avg Red Phase | 9.19s |
| Avg Green Phase | 5.04s |
| Avg Refactor Phase | 9.63s |

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
| Refactorings Applied | 38 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


