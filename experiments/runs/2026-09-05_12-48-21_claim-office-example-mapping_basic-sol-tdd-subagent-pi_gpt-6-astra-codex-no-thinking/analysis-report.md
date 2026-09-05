# Analysis Report: 2026-09-05_12-48-21_claim-office-example-mapping_basic-sol-tdd-subagent-pi_gpt-6-astra-codex-no-thinking

Generated: 2026-09-05T13:46:55+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | basic-sol-tdd-subagent-pi |
| Model | gpt-6-astra-codex-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 3512s |
| Started | 2026-09-05T12:48:21+00:00 |
| Ended | 2026-09-05T13:46:55+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, office.ts
- **Implementation LOC** (total): 73
- **Test files**: office.spec.ts
- **Test LOC** (total): 64
- **Active tests**: 35
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (35 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-05_12-48-21_claim-office-example-mapping_basic-sol-tdd-subagent-pi_gpt-6-astra-codex-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-05_12-48-21_claim-office-example-mapping_basic-sol-tdd-subagent-pi_gpt-6-astra-codex-no-thinking

 ✓ src/office.spec.ts  (35 tests) 932ms

 Test Files  1 passed (1)
      Tests  35 passed (35)
   Start at  13:46:56
   Duration  1.18s (transform 49ms, setup 0ms, collect 49ms, tests 932ms, environment 0ms, prepare 66ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 86% |
| Branches | 88% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 60 | ×1 | 60 |
| Invocations | 43 | ×2 | 86 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 6 | ×5 | 30 |
| Assignments | 38 | ×6 | 228 |
| **Total Mass** | | | **456** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 72 |
| Functions | 6 |
| Longest Function | 12 lines |
| Avg LOC/Function | 6.50 |
| Median LOC/Function | 6.00 |
| Imports | 2 |

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
| McCabe (Cyclomatic) | 4 | 2.00 | 0 |
| Cognitive (SonarJS) | 3 | 1.86 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 9815548 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 35 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 42 |
| Predictions Total | 42 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 35 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


