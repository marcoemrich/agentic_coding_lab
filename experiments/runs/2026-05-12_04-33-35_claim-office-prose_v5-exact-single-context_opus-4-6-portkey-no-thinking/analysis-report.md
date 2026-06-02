# Analysis Report: 2026-05-12_04-33-35_claim-office-prose_v5-exact-single-context_opus-4-6-portkey-no-thinking

Generated: 2026-06-02T07:58:35+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-prose |
| Workflow | v5-exact-single-context |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 1879s |
| Started | 2026-05-12T04:33:35+00:00 |
| Ended | 2026-05-12T05:05:09+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 81
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 234
- **Active tests**: 18
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (18 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_04-33-35_claim-office-prose_v5-exact-single-context_opus-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_04-33-35_claim-office-prose_v5-exact-single-context_opus-4-6-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (18 tests) 3ms

 Test Files  1 passed (1)
      Tests  18 passed (18)
   Start at  07:58:37
   Duration  356ms (transform 33ms, setup 0ms, collect 27ms, tests 3ms, environment 0ms, prepare 92ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 49 | ×1 | 49 |
| Invocations | 29 | ×2 | 58 |
| Conditionals | 8 | ×4 | 32 |
| Loops | 5 | ×5 | 25 |
| Assignments | 35 | ×6 | 210 |
| **Total Mass** | | | **374** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 74 |
| Functions | 4 |
| Longest Function | 17 lines |
| Avg LOC/Function | 12.25 |
| Median LOC/Function | 13.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 20 |
| Code Quality | 0 |
| **Total** | **20** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 5 | 2.22 | 0 |
| Cognitive (SonarJS) | 6 | 3.25 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 35794902 |
| Context Utilization | 83% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 17 |
| Avg Cycle Time | 127.02s |
| Avg Red Phase | 37.47s |
| Avg Green Phase | 33.51s |
| Avg Refactor Phase | 56.04s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 34 |
| Predictions Total | 34 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 13 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 4 |


