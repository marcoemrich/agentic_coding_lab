# Analysis Report: 2026-05-23_21-42-55_claim-office-example-mapping_v6.1-no-pep-no-emoji_opus-4-7-portkey-no-thinking

Generated: 2026-05-23T22:05:40+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-no-pep-no-emoji |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 1364s |
| Started | 2026-05-23T21:42:55+00:00 |
| Ended | 2026-05-23T22:05:40+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 224
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 526
- **Active tests**: 42
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (42 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-23_21-42-55_claim-office-example-mapping_v6.1-no-pep-no-emoji_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-23_21-42-55_claim-office-example-mapping_v6.1-no-pep-no-emoji_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (42 tests) 6ms

 Test Files  1 passed (1)
      Tests  42 passed (42)
   Start at  22:05:41
   Duration  190ms (transform 48ms, setup 0ms, collect 49ms, tests 6ms, environment 0ms, prepare 46ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 60 | ×1 | 60 |
| Invocations | 80 | ×2 | 160 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 12 | ×5 | 60 |
| Assignments | 94 | ×6 | 564 |
| **Total Mass** | | | **904** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 195 |
| Functions | 20 |
| Longest Function | 13 lines |
| Avg LOC/Function | 6.60 |
| Median LOC/Function | 6.50 |
| Imports | 1 |

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
| McCabe (Cyclomatic) | 4 | 1.75 | 0 |
| Cognitive (SonarJS) | 4 | 2.23 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 33366435 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 29 |
| Avg Cycle Time | 90.42s |
| Avg Red Phase | 24.13s |
| Avg Green Phase | 20.13s |
| Avg Refactor Phase | 46.16s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 32 |
| Predictions Total | 32 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 7 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 14 |


