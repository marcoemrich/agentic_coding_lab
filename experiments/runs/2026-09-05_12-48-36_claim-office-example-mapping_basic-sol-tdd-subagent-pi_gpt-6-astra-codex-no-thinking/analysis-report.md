# Analysis Report: 2026-09-05_12-48-36_claim-office-example-mapping_basic-sol-tdd-subagent-pi_gpt-6-astra-codex-no-thinking

Generated: 2026-09-05T13:56:51+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | basic-sol-tdd-subagent-pi |
| Model | gpt-6-astra-codex-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 4092s |
| Started | 2026-09-05T12:48:36+00:00 |
| Ended | 2026-09-05T13:56:51+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, office.ts
- **Implementation LOC** (total): 68
- **Test files**: office.spec.ts
- **Test LOC** (total): 64
- **Active tests**: 36
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (36 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-05_12-48-36_claim-office-example-mapping_basic-sol-tdd-subagent-pi_gpt-6-astra-codex-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-05_12-48-36_claim-office-example-mapping_basic-sol-tdd-subagent-pi_gpt-6-astra-codex-no-thinking

 ✓ src/office.spec.ts  (36 tests) 12359ms

 Test Files  1 passed (1)
      Tests  36 passed (36)
   Start at  13:56:53
   Duration  13.03s (transform 181ms, setup 0ms, collect 150ms, tests 12.36s, environment 0ms, prepare 236ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 0% |
| Branches | 0% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 56 | ×1 | 56 |
| Invocations | 41 | ×2 | 82 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 5 | ×5 | 25 |
| Assignments | 36 | ×6 | 216 |
| **Total Mass** | | | **419** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 68 |
| Functions | 7 |
| Longest Function | 12 lines |
| Avg LOC/Function | 5.71 |
| Median LOC/Function | 5.00 |
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
| McCabe (Cyclomatic) | 5 | 2.08 | 0 |
| Cognitive (SonarJS) | 4 | 2.33 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 10283094 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 36 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 40 |
| Predictions Total | 40 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 36 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


