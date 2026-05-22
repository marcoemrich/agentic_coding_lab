# Analysis Report: 2026-05-21_23-46-05_claim-office-lite-example-mapping_v7-hybrid-green-refactor_opus-4-7-portkey-no-thinking

Generated: 2026-05-22T00:19:35+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-lite-example-mapping |
| Workflow | v7-hybrid-green-refactor |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7, <synthetic> |
| Thinking | unknown |
| Duration | 2008s |
| Started | 2026-05-21T23:46:05+00:00 |
| Ended | 2026-05-22T00:19:35+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 252
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 463
- **Active tests**: 35
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (35 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-21_23-46-05_claim-office-lite-example-mapping_v7-hybrid-green-refactor_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-21_23-46-05_claim-office-lite-example-mapping_v7-hybrid-green-refactor_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (35 tests) 6ms

 Test Files  1 passed (1)
      Tests  35 passed (35)
   Start at  00:19:36
   Duration  172ms (transform 41ms, setup 0ms, collect 41ms, tests 6ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 56 | ×1 | 56 |
| Invocations | 79 | ×2 | 158 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 14 | ×5 | 70 |
| Assignments | 95 | ×6 | 570 |
| **Total Mass** | | | **906** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 201 |
| Functions | 29 |
| Longest Function | 14 lines |
| Avg LOC/Function | 4.69 |
| Median LOC/Function | 2.00 |
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
| McCabe (Cyclomatic) | 4 | 1.73 | 0 |
| Cognitive (SonarJS) | 4 | 1.60 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 24048709 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 23 |
| Avg Cycle Time | 101.60s |
| Avg Red Phase | 25.5s |
| Avg Green Phase | 26.97s |
| Avg Refactor Phase | 49.13s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 30 |
| Predictions Total | 30 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 17 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 7 |


