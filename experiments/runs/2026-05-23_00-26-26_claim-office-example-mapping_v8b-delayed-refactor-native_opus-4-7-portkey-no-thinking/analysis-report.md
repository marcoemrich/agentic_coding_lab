# Analysis Report: 2026-05-23_00-26-26_claim-office-example-mapping_v8b-delayed-refactor-native_opus-4-7-portkey-no-thinking

Generated: 2026-05-23T11:58:48+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v8b-delayed-refactor-native |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 238s |
| Started | 2026-05-23T00:26:26+00:00 |
| Ended | 2026-05-23T00:30:25+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 299
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 580
- **Active tests**: 43
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (43 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-23_00-26-26_claim-office-example-mapping_v8b-delayed-refactor-native_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-23_00-26-26_claim-office-example-mapping_v8b-delayed-refactor-native_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (43 tests) 1541ms

 Test Files  1 passed (1)
      Tests  43 passed (43)
   Start at  11:58:48
   Duration  1.92s (transform 34ms, setup 0ms, collect 34ms, tests 1.54s, environment 0ms, prepare 62ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 65 | ×1 | 65 |
| Invocations | 97 | ×2 | 194 |
| Conditionals | 21 | ×4 | 84 |
| Loops | 13 | ×5 | 65 |
| Assignments | 64 | ×6 | 384 |
| **Total Mass** | | | **792** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 232 |
| Functions | 15 |
| Longest Function | 24 lines |
| Avg LOC/Function | 9.53 |
| Median LOC/Function | 9.00 |
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
| McCabe (Cyclomatic) | 7 | 2.60 | 0 |
| Cognitive (SonarJS) | 9 | 3.80 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2276493 |
| Context Utilization | 8% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 24.30s |
| Avg Red Phase | 0s |
| Avg Green Phase | 15.27s |
| Avg Refactor Phase | 9.03s |

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
| Refactorings Applied | 2 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


