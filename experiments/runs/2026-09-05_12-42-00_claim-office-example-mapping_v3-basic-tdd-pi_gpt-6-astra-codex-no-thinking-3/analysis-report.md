# Analysis Report: 2026-09-05_12-42-00_claim-office-example-mapping_v3-basic-tdd-pi_gpt-6-astra-codex-no-thinking-3

Generated: 2026-09-05T12:47:43+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v3-basic-tdd-pi |
| Model | gpt-6-astra-codex-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 332s |
| Started | 2026-09-05T12:42:00+00:00 |
| Ended | 2026-09-05T12:47:43+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, office.ts
- **Implementation LOC** (total): 65
- **Test files**: claims.spec.ts, cli.spec.ts, office.spec.ts
- **Test LOC** (total): 142
- **Active tests**: 25
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (62 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-05_12-42-00_claim-office-example-mapping_v3-basic-tdd-pi_gpt-6-astra-codex-no-thinking-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-05_12-42-00_claim-office-example-mapping_v3-basic-tdd-pi_gpt-6-astra-codex-no-thinking-3

 ✓ src/claims.spec.ts  (29 tests) 9ms
 ✓ src/office.spec.ts  (26 tests) 7ms
 ✓ src/cli.spec.ts  (7 tests) 1506ms

 Test Files  3 passed (3)
      Tests  62 passed (62)
   Start at  12:47:44
   Duration  2.75s (transform 140ms, setup 0ms, collect 131ms, tests 1.52s, environment 1ms, prepare 496ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 81% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 56 | ×1 | 56 |
| Invocations | 35 | ×2 | 70 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 6 | ×5 | 30 |
| Assignments | 25 | ×6 | 150 |
| **Total Mass** | | | **358** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 62 |
| Functions | 1 |
| Longest Function | 36 lines |
| Avg LOC/Function | 36.00 |
| Median LOC/Function | 36.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 15 |
| Code Quality | 0 |
| **Total** | **16** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 6 | 2.78 | 0 |
| Cognitive (SonarJS) | 5 | 4.25 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 585580 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 7 |
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
| Refactorings Applied | 1 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


