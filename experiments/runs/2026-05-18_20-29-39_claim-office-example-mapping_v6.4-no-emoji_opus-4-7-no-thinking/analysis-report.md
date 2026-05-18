# Analysis Report: 2026-05-18_20-29-39_claim-office-example-mapping_v6.4-no-emoji_opus-4-7-no-thinking

Generated: 2026-05-18T21:13:15+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.4-no-emoji |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 2615s |
| Started | 2026-05-18T20:29:39+00:00 |
| Ended | 2026-05-18T21:13:15+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 293
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 417
- **Active tests**: 26
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (26 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-18_20-29-39_claim-office-example-mapping_v6.4-no-emoji_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-18_20-29-39_claim-office-example-mapping_v6.4-no-emoji_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (26 tests) 6ms

 Test Files  1 passed (1)
      Tests  26 passed (26)
   Start at  21:13:16
   Duration  195ms (transform 41ms, setup 1ms, collect 42ms, tests 6ms, environment 0ms, prepare 44ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 88% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 59 | ×1 | 59 |
| Invocations | 82 | ×2 | 164 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 11 | ×5 | 55 |
| Assignments | 109 | ×6 | 654 |
| **Total Mass** | | | **992** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 233 |
| Functions | 34 |
| Longest Function | 12 lines |
| Avg LOC/Function | 3.74 |
| Median LOC/Function | 2.00 |
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
| McCabe (Cyclomatic) | 3 | 1.48 | 0 |
| Cognitive (SonarJS) | 3 | 1.41 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 36599387 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 26 |
| Avg Cycle Time | 127.17s |
| Avg Red Phase | 21.85s |
| Avg Green Phase | 34.74s |
| Avg Refactor Phase | 70.58s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 50 |
| Predictions Total | 51 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 19 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 7 |


