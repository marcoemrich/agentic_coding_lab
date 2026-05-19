# Analysis Report: 2026-05-19_00-33-23_claim-office-example-mapping_v4-exact-subagents_opus-4-6-portkey-no-thinking-2

Generated: 2026-05-19T02:03:25+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4-exact-subagents |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 5401s |
| Started | 2026-05-19T00:33:23+00:00 |
| Ended | 2026-05-19T02:03:25+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 226
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 625
- **Active tests**: 40
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (40 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-19_00-33-23_claim-office-example-mapping_v4-exact-subagents_opus-4-6-portkey-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-19_00-33-23_claim-office-example-mapping_v4-exact-subagents_opus-4-6-portkey-no-thinking-2

 ✓ src/claim-office.spec.ts  (40 tests) 2102ms

 Test Files  1 passed (1)
      Tests  40 passed (40)
   Start at  02:03:25
   Duration  2.27s (transform 40ms, setup 0ms, collect 41ms, tests 2.10s, environment 0ms, prepare 41ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 65% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 67 | ×1 | 67 |
| Invocations | 66 | ×2 | 132 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 12 | ×5 | 60 |
| Assignments | 84 | ×6 | 504 |
| **Total Mass** | | | **819** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 190 |
| Functions | 13 |
| Longest Function | 34 lines |
| Avg LOC/Function | 5.77 |
| Median LOC/Function | 2.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 9 |
| Code Quality | 0 |
| **Total** | **10** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 8 | 2.25 | 0 |
| Cognitive (SonarJS) | 9 | 3.44 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 15546048 |
| Context Utilization | 72% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 40 |
| Avg Cycle Time | 173.54s |
| Avg Red Phase | 42.37s |
| Avg Green Phase | 38.16s |
| Avg Refactor Phase | 93.01s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 80 |
| Predictions Total | 81 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 20 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 19 |


