# Analysis Report: 2026-05-18_10-39-25_claim-office-example-mapping_v6.5.1-orchestration-audited_opus-4-7-no-thinking

Generated: 2026-05-18T10:53:47+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.5.1-orchestration-audited |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 861s |
| Started | 2026-05-18T10:39:25+00:00 |
| Ended | 2026-05-18T10:53:47+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 80
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 110
- **Active tests**: 10
- **Remaining todos**: 23

## Test Results

**Status**: ✅ All tests passing (10 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-18_10-39-25_claim-office-example-mapping_v6.5.1-orchestration-audited_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-18_10-39-25_claim-office-example-mapping_v6.5.1-orchestration-audited_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (33 tests | 23 skipped) 3ms

 Test Files  1 passed (1)
      Tests  10 passed | 23 todo (33)
   Start at  10:53:48
   Duration  153ms (transform 26ms, setup 0ms, collect 25ms, tests 3ms, environment 0ms, prepare 41ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 70% |
| Branches | 78% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 21 | ×1 | 21 |
| Invocations | 25 | ×2 | 50 |
| Conditionals | 1 | ×4 | 4 |
| Loops | 3 | ×5 | 15 |
| Assignments | 25 | ×6 | 150 |
| **Total Mass** | | | **240** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 67 |
| Functions | 8 |
| Longest Function | 10 lines |
| Avg LOC/Function | 3.88 |
| Median LOC/Function | 2.50 |
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
| McCabe (Cyclomatic) | 2 | 1.29 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 302630 |
| Context Utilization | 5% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 0 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

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
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


