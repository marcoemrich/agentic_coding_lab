# Analysis Report: 2026-05-19_00-48-02_claim-office-example-mapping_v4-exact-subagents_opus-4-6-portkey-no-thinking-2

Generated: 2026-05-19T01:55:37+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4-exact-subagents |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 4054s |
| Started | 2026-05-19T00:48:02+00:00 |
| Ended | 2026-05-19T01:55:37+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 313
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 241
- **Active tests**: 30
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (30 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-19_00-48-02_claim-office-example-mapping_v4-exact-subagents_opus-4-6-portkey-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-19_00-48-02_claim-office-example-mapping_v4-exact-subagents_opus-4-6-portkey-no-thinking-2

 ✓ src/claim-office.spec.ts  (30 tests) 5ms

 Test Files  1 passed (1)
      Tests  30 passed (30)
   Start at  01:55:37
   Duration  189ms (transform 44ms, setup 0ms, collect 51ms, tests 5ms, environment 0ms, prepare 45ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 47% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 86 | ×1 | 86 |
| Invocations | 78 | ×2 | 156 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 14 | ×5 | 70 |
| Assignments | 70 | ×6 | 420 |
| **Total Mass** | | | **776** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 259 |
| Functions | 13 |
| Longest Function | 111 lines |
| Avg LOC/Function | 14.46 |
| Median LOC/Function | 2.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 7 |
| Duplication | 0 |
| Magic Numbers | 0 |
| Code Quality | 0 |
| **Total** | **7** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 19 | 2.30 | 1 |
| Cognitive (SonarJS) | 46 | 6.22 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 14474180 |
| Context Utilization | 68% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 30 |
| Avg Cycle Time | 152.02s |
| Avg Red Phase | 38.83s |
| Avg Green Phase | 33.62s |
| Avg Refactor Phase | 79.57s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 59 |
| Predictions Total | 60 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 17 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 13 |


