# Analysis Report: 2026-09-05_12-49-16_claim-office-example-mapping_basic-sol-tdd-subagent-pi_gpt-6-astra-codex-no-thinking

Generated: 2026-09-05T13:56:35+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | basic-sol-tdd-subagent-pi |
| Model | gpt-6-astra-codex-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 4036s |
| Started | 2026-09-05T12:49:16+00:00 |
| Ended | 2026-09-05T13:56:35+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, office.ts
- **Implementation LOC** (total): 92
- **Test files**: office.spec.ts
- **Test LOC** (total): 51
- **Active tests**: 41
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (41 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-05_12-49-16_claim-office-example-mapping_basic-sol-tdd-subagent-pi_gpt-6-astra-codex-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-05_12-49-16_claim-office-example-mapping_basic-sol-tdd-subagent-pi_gpt-6-astra-codex-no-thinking

 ✓ src/office.spec.ts  (41 tests) 930ms

 Test Files  1 passed (1)
      Tests  41 passed (41)
   Start at  13:56:37
   Duration  1.30s (transform 70ms, setup 0ms, collect 70ms, tests 930ms, environment 0ms, prepare 95ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 96% |
| Branches | 87% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 56 | ×1 | 56 |
| Invocations | 36 | ×2 | 72 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 5 | ×5 | 25 |
| Assignments | 38 | ×6 | 228 |
| **Total Mass** | | | **433** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 84 |
| Functions | 6 |
| Longest Function | 11 lines |
| Avg LOC/Function | 5.50 |
| Median LOC/Function | 5.50 |
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
| McCabe (Cyclomatic) | 6 | 2.36 | 0 |
| Cognitive (SonarJS) | 4 | 2.80 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 13489524 |
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
| Predictions Correct | 50 |
| Predictions Total | 50 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 41 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


