# Analysis Report: 2026-09-05_12-47-20_claim-office-example-mapping_basic-sol-tdd-subagent-pi_gpt-6-astra-codex-no-thinking

Generated: 2026-09-05T14:02:56+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | basic-sol-tdd-subagent-pi |
| Model | gpt-6-astra-codex-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 4532s |
| Started | 2026-09-05T12:47:20+00:00 |
| Ended | 2026-09-05T14:02:56+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, office.ts
- **Implementation LOC** (total): 77
- **Test files**: office.spec.ts
- **Test LOC** (total): 69
- **Active tests**: 41
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (41 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-05_12-47-20_claim-office-example-mapping_basic-sol-tdd-subagent-pi_gpt-6-astra-codex-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-05_12-47-20_claim-office-example-mapping_basic-sol-tdd-subagent-pi_gpt-6-astra-codex-no-thinking

 ✓ src/office.spec.ts  (41 tests) 1017ms

 Test Files  1 passed (1)
      Tests  41 passed (41)
   Start at  14:02:57
   Duration  1.32s (transform 70ms, setup 0ms, collect 69ms, tests 1.02s, environment 0ms, prepare 83ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 86% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 61 | ×1 | 61 |
| Invocations | 36 | ×2 | 72 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 8 | ×5 | 40 |
| Assignments | 45 | ×6 | 270 |
| **Total Mass** | | | **491** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 74 |
| Functions | 4 |
| Longest Function | 28 lines |
| Avg LOC/Function | 15.00 |
| Median LOC/Function | 15.00 |
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
| McCabe (Cyclomatic) | 5 | 2.33 | 0 |
| Cognitive (SonarJS) | 5 | 2.83 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 13832398 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 41 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 51 |
| Predictions Total | 52 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 41 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


