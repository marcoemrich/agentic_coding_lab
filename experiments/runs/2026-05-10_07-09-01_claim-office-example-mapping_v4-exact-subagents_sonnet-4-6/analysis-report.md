# Analysis Report: 2026-05-10_07-09-01_claim-office-example-mapping_v4-exact-subagents_sonnet-4-6

Generated: 2026-05-10T15:00:36+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4-exact-subagents |
| Model | sonnet-4-6 |
| Model Version(s) | claude-sonnet-4-6 |
| Thinking | true |
| Duration | 4102s |
| Started | 2026-05-10T07:09:01+00:00 |
| Ended | 2026-05-10T08:17:25+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts
- **Implementation LOC** (total): 142
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 186
- **Active tests**: 26
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (26 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-10_07-09-01_claim-office-example-mapping_v4-exact-subagents_sonnet-4-6
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-10_07-09-01_claim-office-example-mapping_v4-exact-subagents_sonnet-4-6

 ✓ src/claim-office.spec.ts  (26 tests) 5ms

 Test Files  1 passed (1)
      Tests  26 passed (26)
   Start at  15:00:37
   Duration  354ms (transform 30ms, setup 0ms, collect 29ms, tests 5ms, environment 0ms, prepare 86ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 98% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 47 | ×1 | 47 |
| Invocations | 35 | ×2 | 70 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 8 | ×5 | 40 |
| Assignments | 44 | ×6 | 264 |
| **Total Mass** | | | **465** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 123 |
| Functions | 7 |
| Longest Function | 28 lines |
| Avg LOC/Function | 10.43 |
| Median LOC/Function | 5.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 4 |
| Code Quality | 0 |
| **Total** | **5** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 8 | 2.50 | 0 |
| Cognitive (SonarJS) | 13 | 4.33 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 9668536 |
| Context Utilization | 13% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 26 |
| Avg Cycle Time | 127.76s |
| Avg Red Phase | 42.16s |
| Avg Green Phase | 25.15s |
| Avg Refactor Phase | 60.45s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 48 |
| Predictions Total | 52 |
| Accuracy | 92% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 26 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 2 |


