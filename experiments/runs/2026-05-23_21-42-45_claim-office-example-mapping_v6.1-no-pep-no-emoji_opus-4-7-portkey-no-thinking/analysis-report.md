# Analysis Report: 2026-05-23_21-42-45_claim-office-example-mapping_v6.1-no-pep-no-emoji_opus-4-7-portkey-no-thinking

Generated: 2026-05-23T21:58:45+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-no-pep-no-emoji |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 959s |
| Started | 2026-05-23T21:42:45+00:00 |
| Ended | 2026-05-23T21:58:45+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 175
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 481
- **Active tests**: 42
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (42 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-23_21-42-45_claim-office-example-mapping_v6.1-no-pep-no-emoji_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-23_21-42-45_claim-office-example-mapping_v6.1-no-pep-no-emoji_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (42 tests) 1725ms

 Test Files  1 passed (1)
      Tests  42 passed (42)
   Start at  21:58:46
   Duration  1.90s (transform 41ms, setup 0ms, collect 42ms, tests 1.73s, environment 0ms, prepare 44ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 90% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 46 | ×1 | 46 |
| Invocations | 70 | ×2 | 140 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 9 | ×5 | 45 |
| Assignments | 84 | ×6 | 504 |
| **Total Mass** | | | **791** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 154 |
| Functions | 15 |
| Longest Function | 15 lines |
| Avg LOC/Function | 6.40 |
| Median LOC/Function | 6.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 3 |
| Code Quality | 0 |
| **Total** | **3** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 6 | 1.91 | 0 |
| Cognitive (SonarJS) | 6 | 2.10 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 23673479 |
| Context Utilization | 15% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 6 |
| Avg Cycle Time | 172.94s |
| Avg Red Phase | 17.92s |
| Avg Green Phase | 96.19s |
| Avg Refactor Phase | 58.83s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 10 |
| Predictions Total | 10 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 4 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


