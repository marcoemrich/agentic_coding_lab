# Analysis Report: 2026-05-23_21-09-13_claim-office-example-mapping_v6.1-no-emoji_opus-4-7-portkey-no-thinking-2

Generated: 2026-05-23T21:22:48+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-no-emoji |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 812s |
| Started | 2026-05-23T21:09:13+00:00 |
| Ended | 2026-05-23T21:22:48+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 187
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 558
- **Active tests**: 42
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (42 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-23_21-09-13_claim-office-example-mapping_v6.1-no-emoji_opus-4-7-portkey-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-23_21-09-13_claim-office-example-mapping_v6.1-no-emoji_opus-4-7-portkey-no-thinking-2

 ✓ src/claim-office.spec.ts  (42 tests) 7ms

 Test Files  1 passed (1)
      Tests  42 passed (42)
   Start at  21:22:49
   Duration  192ms (transform 45ms, setup 0ms, collect 47ms, tests 7ms, environment 0ms, prepare 48ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 56 | ×1 | 56 |
| Invocations | 67 | ×2 | 134 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 10 | ×5 | 50 |
| Assignments | 83 | ×6 | 498 |
| **Total Mass** | | | **798** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 166 |
| Functions | 13 |
| Longest Function | 22 lines |
| Avg LOC/Function | 8.46 |
| Median LOC/Function | 7.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 4 |
| Code Quality | 0 |
| **Total** | **4** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 7 | 2.62 | 0 |
| Cognitive (SonarJS) | 7 | 3.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 20611106 |
| Context Utilization | 13% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 4 |
| Avg Cycle Time | 214.90s |
| Avg Red Phase | 157.8s |
| Avg Green Phase | 22.41s |
| Avg Refactor Phase | 34.69s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 8 |
| Predictions Total | 8 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 2 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


