# Analysis Report: 2026-05-10_16-33-29_claim-office-example-mapping_v4-exact-subagents_opus-4-7-no-thinking

Generated: 2026-05-10T17:53:53+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4-exact-subagents |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 4822s |
| Started | 2026-05-10T16:33:29+00:00 |
| Ended | 2026-05-10T17:53:53+00:00 |

## Code Metrics

- **Implementation file**: cli.ts
- **Implementation LOC**: 133
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 422
- **Active tests**: 40
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (40 passed)

```
$ vitest run

 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-10_16-33-29_claim-office-example-mapping_v4-exact-subagents_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (40 tests) 1398ms

 Test Files  1 passed (1)
      Tests  40 passed (40)
   Start at  17:53:54
   Duration  1.57s (transform 46ms, setup 0ms, collect 42ms, tests 1.40s, environment 0ms, prepare 46ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 58% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 14 | ×1 | 14 |
| Invocations | 51 | ×2 | 102 |
| Conditionals | 5 | ×4 | 20 |
| Loops | 5 | ×5 | 25 |
| Assignments | 25 | ×6 | 150 |
| **Total Mass** | | | **311** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 115 |
| Functions | 8 |
| Longest Function | 21 lines |
| Avg LOC/Function | 9 |
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
| McCabe (Cyclomatic) | 5 | 1.69 | 0 |
| Cognitive (SonarJS) | 5 | 2.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 13110136 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 40 |
| Avg Cycle Time | 119.20s |
| Avg Red Phase | 34.3s |
| Avg Green Phase | 32.87s |
| Avg Refactor Phase | 52.03s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 52 |
| Predictions Total | 53 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 27 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 13 |


