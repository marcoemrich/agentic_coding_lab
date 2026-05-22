# Analysis Report: 2026-05-22_10-41-57_claim-office-example-mapping_v4.2-shared-context_opus-4-7-portkey-no-thinking

Generated: 2026-05-22T11:43:30+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4.2-shared-context |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 3691s |
| Started | 2026-05-22T10:41:57+00:00 |
| Ended | 2026-05-22T11:43:30+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 187
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 881
- **Active tests**: 39
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (39 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-22_10-41-57_claim-office-example-mapping_v4.2-shared-context_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-22_10-41-57_claim-office-example-mapping_v4.2-shared-context_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (39 tests) 2909ms

 Test Files  1 passed (1)
      Tests  39 passed (39)
   Start at  11:43:30
   Duration  3.10s (transform 47ms, setup 0ms, collect 56ms, tests 2.91s, environment 0ms, prepare 47ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 74% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 61 | ×1 | 61 |
| Invocations | 58 | ×2 | 116 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 8 | ×5 | 40 |
| Assignments | 62 | ×6 | 372 |
| **Total Mass** | | | **657** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 177 |
| Functions | 8 |
| Longest Function | 15 lines |
| Avg LOC/Function | 7.50 |
| Median LOC/Function | 7.50 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 2 |
| Duplication | 0 |
| Magic Numbers | 1 |
| Code Quality | 0 |
| **Total** | **3** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 13 | 2.94 | 1 |
| Cognitive (SonarJS) | 17 | 3.88 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 14590629 |
| Context Utilization | 15% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 39 |
| Avg Cycle Time | 114.74s |
| Avg Red Phase | 39.45s |
| Avg Green Phase | 32.62s |
| Avg Refactor Phase | 42.67s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 36 |
| Predictions Total | 36 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 21 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 18 |


