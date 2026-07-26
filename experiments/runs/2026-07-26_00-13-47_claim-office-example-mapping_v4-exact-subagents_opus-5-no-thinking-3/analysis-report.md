# Analysis Report: 2026-07-26_00-13-47_claim-office-example-mapping_v4-exact-subagents_opus-5-no-thinking-3

Generated: 2026-07-26T01:53:58+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4-exact-subagents |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 6009s |
| Started | 2026-07-26T00:13:47+00:00 |
| Ended | 2026-07-26T01:53:58+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 311
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 1334
- **Active tests**: 49
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (53 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-26_00-13-47_claim-office-example-mapping_v4-exact-subagents_opus-5-no-thinking-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-26_00-13-47_claim-office-example-mapping_v4-exact-subagents_opus-5-no-thinking-3

 ✓ src/claim-office.spec.ts  (49 tests) 9ms
 ✓ src/cli.spec.ts  (4 tests) 1445ms

 Test Files  2 passed (2)
      Tests  53 passed (53)
   Start at  01:53:59
   Duration  1.77s (transform 64ms, setup 0ms, collect 78ms, tests 1.45s, environment 0ms, prepare 82ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 91% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 46 | ×1 | 46 |
| Invocations | 79 | ×2 | 158 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 10 | ×5 | 50 |
| Assignments | 95 | ×6 | 570 |
| **Total Mass** | | | **876** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 264 |
| Functions | 35 |
| Longest Function | 10 lines |
| Avg LOC/Function | 3.09 |
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
| McCabe (Cyclomatic) | 3 | 1.40 | 0 |
| Cognitive (SonarJS) | 3 | 1.25 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 19910872 |
| Context Utilization | 98% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 53 |
| Avg Cycle Time | 143.79s |
| Avg Red Phase | 42.39s |
| Avg Green Phase | 26.69s |
| Avg Refactor Phase | 74.71s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 106 |
| Predictions Total | 106 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 29 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 25 |


