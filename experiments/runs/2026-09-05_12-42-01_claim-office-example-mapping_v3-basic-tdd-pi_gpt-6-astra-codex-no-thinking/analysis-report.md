# Analysis Report: 2026-09-05_12-42-01_claim-office-example-mapping_v3-basic-tdd-pi_gpt-6-astra-codex-no-thinking

Generated: 2026-09-05T12:46:46+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v3-basic-tdd-pi |
| Model | gpt-6-astra-codex-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 276s |
| Started | 2026-09-05T12:42:01+00:00 |
| Ended | 2026-09-05T12:46:46+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, office.ts
- **Implementation LOC** (total): 58
- **Test files**: claims.spec.ts, cli.spec.ts, modifiers.spec.ts, office.spec.ts
- **Test LOC** (total): 99
- **Active tests**: 22
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (54 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-05_12-42-01_claim-office-example-mapping_v3-basic-tdd-pi_gpt-6-astra-codex-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-05_12-42-01_claim-office-example-mapping_v3-basic-tdd-pi_gpt-6-astra-codex-no-thinking

 ✓ src/claims.spec.ts  (19 tests) 8ms
 ✓ src/cli.spec.ts  (12 tests) 2946ms
 ✓ src/modifiers.spec.ts  (10 tests) 5ms
 ✓ src/office.spec.ts  (13 tests) 5ms

 Test Files  4 passed (4)
      Tests  54 passed (54)
   Start at  12:46:48
   Duration  4.35s (transform 95ms, setup 0ms, collect 172ms, tests 2.96s, environment 1ms, prepare 427ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 75% |
| Branches | 82% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 52 | ×1 | 52 |
| Invocations | 42 | ×2 | 84 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 8 | ×5 | 40 |
| Assignments | 25 | ×6 | 150 |
| **Total Mass** | | | **374** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 56 |
| Functions | 3 |
| Longest Function | 26 lines |
| Avg LOC/Function | 10.00 |
| Median LOC/Function | 2.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 5 |
| Duplication | 0 |
| Magic Numbers | 15 |
| Code Quality | 0 |
| **Total** | **20** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 15 | 3.50 | 1 |
| Cognitive (SonarJS) | 38 | 11.00 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 384612 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 5 |
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


