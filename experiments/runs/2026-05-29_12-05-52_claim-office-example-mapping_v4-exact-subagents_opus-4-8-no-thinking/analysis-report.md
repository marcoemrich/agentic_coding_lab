# Analysis Report: 2026-05-29_12-05-52_claim-office-example-mapping_v4-exact-subagents_opus-4-8-no-thinking

Generated: 2026-05-29T13:32:13+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4-exact-subagents |
| Model | opus-4-8-no-thinking |
| Model Version(s) | claude-opus-4-8, <synthetic> |
| Thinking | unknown |
| Duration | 5179s |
| Started | 2026-05-29T12:05:52+00:00 |
| Ended | 2026-05-29T13:32:13+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 280
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 331
- **Active tests**: 36
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (48 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-29_12-05-52_claim-office-example-mapping_v4-exact-subagents_opus-4-8-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-29_12-05-52_claim-office-example-mapping_v4-exact-subagents_opus-4-8-no-thinking

 ✓ src/claim-office.spec.ts  (36 tests) 5ms
 ✓ src/cli.spec.ts  (12 tests) 774ms

 Test Files  2 passed (2)
      Tests  48 passed (48)
   Start at  13:32:13
   Duration  1.10s (transform 46ms, setup 0ms, collect 53ms, tests 779ms, environment 0ms, prepare 93ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 94% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 73 | ×1 | 73 |
| Invocations | 74 | ×2 | 148 |
| Conditionals | 20 | ×4 | 80 |
| Loops | 14 | ×5 | 70 |
| Assignments | 59 | ×6 | 354 |
| **Total Mass** | | | **725** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 233 |
| Functions | 13 |
| Longest Function | 37 lines |
| Avg LOC/Function | 9.62 |
| Median LOC/Function | 7.00 |
| Imports | 3 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 3 |
| Duplication | 0 |
| Magic Numbers | 0 |
| Code Quality | 0 |
| **Total** | **3** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 17 | 3.18 | 1 |
| Cognitive (SonarJS) | 18 | 4.78 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 29391691 |
| Context Utilization | 112% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 48 |
| Avg Cycle Time | 110.57s |
| Avg Red Phase | 34.19s |
| Avg Green Phase | 23.57s |
| Avg Refactor Phase | 52.81s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 97 |
| Predictions Total | 98 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 29 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 18 |


