# Analysis Report: 2026-05-19_06-53-25_claim-office-example-mapping_v6.4-no-emoji_opus-4-6-portkey-no-thinking

Generated: 2026-05-19T07:44:59+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.4-no-emoji |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 3093s |
| Started | 2026-05-19T06:53:25+00:00 |
| Ended | 2026-05-19T07:44:59+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 163
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 660
- **Active tests**: 39
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (39 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-19_06-53-25_claim-office-example-mapping_v6.4-no-emoji_opus-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-19_06-53-25_claim-office-example-mapping_v6.4-no-emoji_opus-4-6-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (39 tests) 454ms

 Test Files  1 passed (1)
      Tests  39 passed (39)
   Start at  07:45:00
   Duration  679ms (transform 53ms, setup 0ms, collect 53ms, tests 454ms, environment 0ms, prepare 62ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 94% |
| Branches | 89% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 59 | ×1 | 59 |
| Invocations | 44 | ×2 | 88 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 7 | ×5 | 35 |
| Assignments | 55 | ×6 | 330 |
| **Total Mass** | | | **556** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 147 |
| Functions | 6 |
| Longest Function | 27 lines |
| Avg LOC/Function | 9.33 |
| Median LOC/Function | 6.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 3 |
| Duplication | 0 |
| Magic Numbers | 1 |
| Code Quality | 0 |
| **Total** | **4** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 9 | 3.30 | 0 |
| Cognitive (SonarJS) | 11 | 4.14 | 2 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 45719479 |
| Context Utilization | 83% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 39 |
| Avg Cycle Time | 163.87s |
| Avg Red Phase | 32.11s |
| Avg Green Phase | 32.57s |
| Avg Refactor Phase | 99.19s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 78 |
| Predictions Total | 78 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 11 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 19 |


