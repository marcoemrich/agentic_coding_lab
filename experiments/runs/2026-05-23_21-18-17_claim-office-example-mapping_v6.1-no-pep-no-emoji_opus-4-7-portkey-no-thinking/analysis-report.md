# Analysis Report: 2026-05-23_21-18-17_claim-office-example-mapping_v6.1-no-pep-no-emoji_opus-4-7-portkey-no-thinking

Generated: 2026-05-23T21:45:43+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-no-pep-no-emoji |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 1645s |
| Started | 2026-05-23T21:18:17+00:00 |
| Ended | 2026-05-23T21:45:43+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 218
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 430
- **Active tests**: 37
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (37 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-23_21-18-17_claim-office-example-mapping_v6.1-no-pep-no-emoji_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-23_21-18-17_claim-office-example-mapping_v6.1-no-pep-no-emoji_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (37 tests) 386ms

 Test Files  1 passed (1)
      Tests  37 passed (37)
   Start at  21:45:44
   Duration  559ms (transform 43ms, setup 0ms, collect 43ms, tests 386ms, environment 0ms, prepare 44ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 94% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 53 | ×1 | 53 |
| Invocations | 80 | ×2 | 160 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 11 | ×5 | 55 |
| Assignments | 89 | ×6 | 534 |
| **Total Mass** | | | **850** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 183 |
| Functions | 27 |
| Longest Function | 12 lines |
| Avg LOC/Function | 4.44 |
| Median LOC/Function | 2.00 |
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
| McCabe (Cyclomatic) | 4 | 1.57 | 0 |
| Cognitive (SonarJS) | 3 | 1.69 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 38639863 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 37 |
| Avg Cycle Time | 87.21s |
| Avg Red Phase | 17.93s |
| Avg Green Phase | 21.91s |
| Avg Refactor Phase | 47.37s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 65 |
| Predictions Total | 66 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 11 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 18 |


