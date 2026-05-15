# Analysis Report: 2026-05-15_03-50-02_claim-office-example-mapping_v4-exact-subagents_opus-4-7-no-thinking

Generated: 2026-05-15T04:45:38+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4-exact-subagents |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 3334s |
| Started | 2026-05-15T03:50:02+00:00 |
| Ended | 2026-05-15T04:45:38+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 226
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 523
- **Active tests**: 41
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (41 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-15_03-50-02_claim-office-example-mapping_v4-exact-subagents_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-15_03-50-02_claim-office-example-mapping_v4-exact-subagents_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (41 tests) 2694ms

 Test Files  1 passed (1)
      Tests  41 passed (41)
   Start at  04:45:39
   Duration  2.86s (transform 39ms, setup 0ms, collect 39ms, tests 2.69s, environment 0ms, prepare 41ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 72% |
| Branches | 88% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 76 | ×1 | 76 |
| Invocations | 67 | ×2 | 134 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 11 | ×5 | 55 |
| Assignments | 82 | ×6 | 492 |
| **Total Mass** | | | **825** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 198 |
| Functions | 12 |
| Longest Function | 40 lines |
| Avg LOC/Function | 10.25 |
| Median LOC/Function | 5.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 3 |
| Duplication | 0 |
| Magic Numbers | 2 |
| Code Quality | 0 |
| **Total** | **5** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 14 | 2.52 | 1 |
| Cognitive (SonarJS) | 30 | 5.40 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 14664029 |
| Context Utilization | 16% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 41 |
| Avg Cycle Time | 104.69s |
| Avg Red Phase | 33.43s |
| Avg Green Phase | 28.08s |
| Avg Refactor Phase | 43.18s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 54 |
| Predictions Total | 56 |
| Accuracy | 96% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 11 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 17 |


