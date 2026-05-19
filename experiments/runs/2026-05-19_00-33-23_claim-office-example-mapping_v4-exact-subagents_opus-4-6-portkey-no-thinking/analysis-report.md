# Analysis Report: 2026-05-19_00-33-23_claim-office-example-mapping_v4-exact-subagents_opus-4-6-portkey-no-thinking

Generated: 2026-05-19T01:44:44+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4-exact-subagents |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 4280s |
| Started | 2026-05-19T00:33:23+00:00 |
| Ended | 2026-05-19T01:44:44+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 200
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 518
- **Active tests**: 25
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (25 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-19_00-33-23_claim-office-example-mapping_v4-exact-subagents_opus-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-19_00-33-23_claim-office-example-mapping_v4-exact-subagents_opus-4-6-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (25 tests) 4ms

 Test Files  1 passed (1)
      Tests  25 passed (25)
   Start at  01:44:45
   Duration  179ms (transform 48ms, setup 0ms, collect 46ms, tests 4ms, environment 0ms, prepare 43ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 82% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 52 | ×1 | 52 |
| Invocations | 35 | ×2 | 70 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 6 | ×5 | 30 |
| Assignments | 66 | ×6 | 396 |
| **Total Mass** | | | **592** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 180 |
| Functions | 10 |
| Longest Function | 21 lines |
| Avg LOC/Function | 7.30 |
| Median LOC/Function | 6.50 |
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
| McCabe (Cyclomatic) | 4 | 2.17 | 0 |
| Cognitive (SonarJS) | 7 | 2.33 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 13838714 |
| Context Utilization | 72% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 25 |
| Avg Cycle Time | 163.41s |
| Avg Red Phase | 42.26s |
| Avg Green Phase | 38.5s |
| Avg Refactor Phase | 82.65s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 53 |
| Predictions Total | 54 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 18 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 7 |


