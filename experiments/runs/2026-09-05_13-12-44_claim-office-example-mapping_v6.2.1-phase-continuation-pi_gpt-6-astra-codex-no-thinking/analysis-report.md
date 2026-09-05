# Analysis Report: 2026-09-05_13-12-44_claim-office-example-mapping_v6.2.1-phase-continuation-pi_gpt-6-astra-codex-no-thinking

Generated: 2026-09-05T13:50:58+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2.1-phase-continuation-pi |
| Model | gpt-6-astra-codex-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 2289s |
| Started | 2026-09-05T13:12:44+00:00 |
| Ended | 2026-09-05T13:50:58+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 64
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 244
- **Active tests**: 44
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (44 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-05_13-12-44_claim-office-example-mapping_v6.2.1-phase-continuation-pi_gpt-6-astra-codex-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-05_13-12-44_claim-office-example-mapping_v6.2.1-phase-continuation-pi_gpt-6-astra-codex-no-thinking

 ✓ src/claim-office.spec.ts  (44 tests) 1581ms

 Test Files  1 passed (1)
      Tests  44 passed (44)
   Start at  13:51:00
   Duration  2.07s (transform 124ms, setup 0ms, collect 125ms, tests 1.58s, environment 0ms, prepare 109ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 87% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 55 | ×1 | 55 |
| Invocations | 31 | ×2 | 62 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 7 | ×5 | 35 |
| Assignments | 25 | ×6 | 150 |
| **Total Mass** | | | **354** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 62 |
| Functions | 2 |
| Longest Function | 26 lines |
| Avg LOC/Function | 21.50 |
| Median LOC/Function | 21.50 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 12 |
| Code Quality | 0 |
| **Total** | **12** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 5 | 2.30 | 0 |
| Cognitive (SonarJS) | 5 | 2.33 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 7175481 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 44 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 87 |
| Predictions Total | 88 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 22 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


