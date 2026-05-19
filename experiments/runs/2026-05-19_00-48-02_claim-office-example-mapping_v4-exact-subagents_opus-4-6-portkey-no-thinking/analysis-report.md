# Analysis Report: 2026-05-19_00-48-02_claim-office-example-mapping_v4-exact-subagents_opus-4-6-portkey-no-thinking

Generated: 2026-05-19T02:10:42+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4-exact-subagents |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 4959s |
| Started | 2026-05-19T00:48:02+00:00 |
| Ended | 2026-05-19T02:10:42+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 216
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 279
- **Active tests**: 31
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (31 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-19_00-48-02_claim-office-example-mapping_v4-exact-subagents_opus-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-19_00-48-02_claim-office-example-mapping_v4-exact-subagents_opus-4-6-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (31 tests) 6ms

 Test Files  1 passed (1)
      Tests  31 passed (31)
   Start at  02:10:42
   Duration  170ms (transform 36ms, setup 0ms, collect 37ms, tests 6ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 91% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 56 | ×1 | 56 |
| Invocations | 55 | ×2 | 110 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 9 | ×5 | 45 |
| Assignments | 69 | ×6 | 414 |
| **Total Mass** | | | **665** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 187 |
| Functions | 12 |
| Longest Function | 17 lines |
| Avg LOC/Function | 6.67 |
| Median LOC/Function | 7.00 |
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
| McCabe (Cyclomatic) | 4 | 1.79 | 0 |
| Cognitive (SonarJS) | 4 | 2.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 18251612 |
| Context Utilization | 79% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 31 |
| Avg Cycle Time | 161.76s |
| Avg Red Phase | 41.19s |
| Avg Green Phase | 38.85s |
| Avg Refactor Phase | 81.72s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 66 |
| Predictions Total | 67 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 20 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 11 |


