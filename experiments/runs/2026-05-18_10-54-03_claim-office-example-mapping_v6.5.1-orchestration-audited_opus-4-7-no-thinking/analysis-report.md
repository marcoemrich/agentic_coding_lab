# Analysis Report: 2026-05-18_10-54-03_claim-office-example-mapping_v6.5.1-orchestration-audited_opus-4-7-no-thinking

Generated: 2026-05-18T11:52:25+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.5.1-orchestration-audited |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 3501s |
| Started | 2026-05-18T10:54:03+00:00 |
| Ended | 2026-05-18T11:52:25+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 244
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 550
- **Active tests**: 33
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (33 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-18_10-54-03_claim-office-example-mapping_v6.5.1-orchestration-audited_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-18_10-54-03_claim-office-example-mapping_v6.5.1-orchestration-audited_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (33 tests) 9ms

 Test Files  1 passed (1)
      Tests  33 passed (33)
   Start at  11:52:26
   Duration  240ms (transform 51ms, setup 0ms, collect 70ms, tests 9ms, environment 0ms, prepare 54ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 67 | ×1 | 67 |
| Invocations | 93 | ×2 | 186 |
| Conditionals | 19 | ×4 | 76 |
| Loops | 9 | ×5 | 45 |
| Assignments | 99 | ×6 | 594 |
| **Total Mass** | | | **968** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 205 |
| Functions | 32 |
| Longest Function | 13 lines |
| Avg LOC/Function | 4.09 |
| Median LOC/Function | 2.00 |
| Imports | 1 |

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
| McCabe (Cyclomatic) | 4 | 1.54 | 0 |
| Cognitive (SonarJS) | 4 | 1.59 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 44330789 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 26 |
| Avg Cycle Time | 133.06s |
| Avg Red Phase | 30.71s |
| Avg Green Phase | 32.33s |
| Avg Refactor Phase | 70.02s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 64 |
| Predictions Total | 66 |
| Accuracy | 96% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 30 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 9 |


