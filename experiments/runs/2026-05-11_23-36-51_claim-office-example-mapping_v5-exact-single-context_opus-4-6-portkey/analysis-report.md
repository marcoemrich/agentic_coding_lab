# Analysis Report: 2026-05-11_23-36-51_claim-office-example-mapping_v5-exact-single-context_opus-4-6-portkey

Generated: 2026-05-12T00:14:21+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5-exact-single-context |
| Model | opus-4-6-portkey |
| Model Version(s) | claude-opus-4-6 |
| Thinking | true |
| Duration | 2248s |
| Started | 2026-05-11T23:36:51+00:00 |
| Ended | 2026-05-12T00:14:21+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts
- **Implementation LOC** (total): 192
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 606
- **Active tests**: 29
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (29 passed)

```
$ vitest run

 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-11_23-36-51_claim-office-example-mapping_v5-exact-single-context_opus-4-6-portkey

 ✓ src/claim-office.spec.ts  (29 tests) 7ms

 Test Files  1 passed (1)
      Tests  29 passed (29)
   Start at  00:14:21
   Duration  187ms (transform 47ms, setup 0ms, collect 47ms, tests 7ms, environment 0ms, prepare 43ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 98% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 51 | ×1 | 51 |
| Invocations | 68 | ×2 | 136 |
| Conditionals | 19 | ×4 | 76 |
| Loops | 10 | ×5 | 50 |
| Assignments | 55 | ×6 | 330 |
| **Total Mass** | | | **643** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 165 |
| Functions | 12 |
| Longest Function | 29 lines |
| Avg LOC/Function | 10.42 |
| Median LOC/Function | 8.50 |
| Imports | 0 |

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
| McCabe (Cyclomatic) | 8 | 2.53 | 0 |
| Cognitive (SonarJS) | 10 | 4.12 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 51502315 |
| Context Utilization | 83% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 29 |
| Avg Cycle Time | 110.12s |
| Avg Red Phase | 35.76s |
| Avg Green Phase | 30.6s |
| Avg Refactor Phase | 43.76s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 58 |
| Predictions Total | 58 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 13 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 14 |


