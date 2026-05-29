# Analysis Report: 2026-05-29_07-22-49_claim-office-example-mapping_v4-exact-subagents_opus-4-8-no-thinking

Generated: 2026-05-29T08:54:37+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4-exact-subagents |
| Model | opus-4-8-no-thinking |
| Model Version(s) | claude-opus-4-8 |
| Thinking | unknown |
| Duration | 5506s |
| Started | 2026-05-29T07:22:49+00:00 |
| Ended | 2026-05-29T08:54:37+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 311
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 840
- **Active tests**: 45
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (45 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-29_07-22-49_claim-office-example-mapping_v4-exact-subagents_opus-4-8-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-29_07-22-49_claim-office-example-mapping_v4-exact-subagents_opus-4-8-no-thinking

 ✓ src/claim-office.spec.ts  (45 tests) 10ms

 Test Files  1 passed (1)
      Tests  45 passed (45)
   Start at  08:54:38
   Duration  213ms (transform 56ms, setup 0ms, collect 59ms, tests 10ms, environment 0ms, prepare 47ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 86% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 62 | ×1 | 62 |
| Invocations | 88 | ×2 | 176 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 8 | ×5 | 40 |
| Assignments | 91 | ×6 | 546 |
| **Total Mass** | | | **872** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 250 |
| Functions | 28 |
| Longest Function | 17 lines |
| Avg LOC/Function | 3.75 |
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
| McCabe (Cyclomatic) | 4 | 1.42 | 0 |
| Cognitive (SonarJS) | 4 | 1.46 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 37202242 |
| Context Utilization | 127% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 46 |
| Avg Cycle Time | 108.39s |
| Avg Red Phase | 37.89s |
| Avg Green Phase | 26.54s |
| Avg Refactor Phase | 43.96s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 93 |
| Predictions Total | 95 |
| Accuracy | 97% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 45 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 24 |


