# Analysis Report: 2026-05-12_22-05-45_claim-office-prose_v5-exact-single-context_opus-4-7-no-thinking

Generated: 2026-06-02T08:11:25+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-prose |
| Workflow | v5-exact-single-context |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 495s |
| Started | 2026-05-12T22:05:45+00:00 |
| Ended | 2026-05-12T22:14:01+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 174
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 332
- **Active tests**: 17
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (17 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_22-05-45_claim-office-prose_v5-exact-single-context_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_22-05-45_claim-office-prose_v5-exact-single-context_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (17 tests) 3ms

 Test Files  1 passed (1)
      Tests  17 passed (17)
   Start at  08:11:26
   Duration  378ms (transform 32ms, setup 0ms, collect 30ms, tests 3ms, environment 0ms, prepare 57ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 51 | ×1 | 51 |
| Invocations | 52 | ×2 | 104 |
| Conditionals | 9 | ×4 | 36 |
| Loops | 10 | ×5 | 50 |
| Assignments | 73 | ×6 | 438 |
| **Total Mass** | | | **679** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 155 |
| Functions | 10 |
| Longest Function | 26 lines |
| Avg LOC/Function | 9.50 |
| Median LOC/Function | 6.50 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 16 |
| Code Quality | 0 |
| **Total** | **16** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 5 | 1.68 | 0 |
| Cognitive (SonarJS) | 3 | 1.56 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 11743187 |
| Context Utilization | 11% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 3 |
| Avg Cycle Time | 164.33s |
| Avg Red Phase | 132.08s |
| Avg Green Phase | 22.45s |
| Avg Refactor Phase | 9.8s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 4 |
| Predictions Total | 4 |
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


