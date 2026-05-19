# Analysis Report: 2026-05-19_10-28-16_claim-office-example-mapping_v6.4-no-emoji_opus-4-6-portkey-no-thinking

Generated: 2026-05-19T11:20:58+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.4-no-emoji |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 3160s |
| Started | 2026-05-19T10:28:16+00:00 |
| Ended | 2026-05-19T11:20:58+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 175
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 847
- **Active tests**: 43
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (43 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-19_10-28-16_claim-office-example-mapping_v6.4-no-emoji_opus-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-19_10-28-16_claim-office-example-mapping_v6.4-no-emoji_opus-4-6-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (43 tests) 8ms

 Test Files  1 passed (1)
      Tests  43 passed (43)
   Start at  11:20:59
   Duration  207ms (transform 51ms, setup 0ms, collect 51ms, tests 8ms, environment 0ms, prepare 49ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 91% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 60 | ×1 | 60 |
| Invocations | 58 | ×2 | 116 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 9 | ×5 | 45 |
| Assignments | 69 | ×6 | 414 |
| **Total Mass** | | | **683** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 149 |
| Functions | 11 |
| Longest Function | 29 lines |
| Avg LOC/Function | 6.91 |
| Median LOC/Function | 2.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 1 |
| Code Quality | 0 |
| **Total** | **1** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 9 | 2.38 | 0 |
| Cognitive (SonarJS) | 10 | 3.67 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 49715720 |
| Context Utilization | 84% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 43 |
| Avg Cycle Time | 173.33s |
| Avg Red Phase | 26.84s |
| Avg Green Phase | 45.2s |
| Avg Refactor Phase | 101.29s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 86 |
| Predictions Total | 86 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 11 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 26 |


