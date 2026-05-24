# Analysis Report: 2026-05-24_00-26-14_claim-office-example-mapping_v6.1-with-why_opus-4-7-portkey-no-thinking

Generated: 2026-05-24T01:02:08+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-with-why |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 2153s |
| Started | 2026-05-24T00:26:14+00:00 |
| Ended | 2026-05-24T01:02:08+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 224
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 417
- **Active tests**: 41
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (41 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-24_00-26-14_claim-office-example-mapping_v6.1-with-why_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-24_00-26-14_claim-office-example-mapping_v6.1-with-why_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (41 tests) 7ms

 Test Files  1 passed (1)
      Tests  41 passed (41)
   Start at  01:02:09
   Duration  201ms (transform 56ms, setup 0ms, collect 56ms, tests 7ms, environment 0ms, prepare 51ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 57 | ×1 | 57 |
| Invocations | 71 | ×2 | 142 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 9 | ×5 | 45 |
| Assignments | 82 | ×6 | 492 |
| **Total Mass** | | | **784** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 189 |
| Functions | 20 |
| Longest Function | 14 lines |
| Avg LOC/Function | 4.85 |
| Median LOC/Function | 3.50 |
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
| McCabe (Cyclomatic) | 4 | 1.62 | 0 |
| Cognitive (SonarJS) | 3 | 1.33 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 44359790 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 41 |
| Avg Cycle Time | 86.72s |
| Avg Red Phase | 20.28s |
| Avg Green Phase | 21.61s |
| Avg Refactor Phase | 44.83s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 81 |
| Predictions Total | 82 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 17 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 17 |


