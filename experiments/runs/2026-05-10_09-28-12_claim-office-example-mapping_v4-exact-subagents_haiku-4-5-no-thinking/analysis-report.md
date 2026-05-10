# Analysis Report: 2026-05-10_09-28-12_claim-office-example-mapping_v4-exact-subagents_haiku-4-5-no-thinking

Generated: 2026-05-10T15:00:46+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4-exact-subagents |
| Model | haiku-4-5-no-thinking |
| Model Version(s) | claude-haiku-4-5-20251001 |
| Thinking | unknown |
| Duration | 2547s |
| Started | 2026-05-10T09:28:12+00:00 |
| Ended | 2026-05-10T10:10:41+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts
- **Implementation LOC** (total): 131
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 88
- **Active tests**: 24
- **Remaining todos**: 2

## Test Results

**Status**: ✅ All tests passing (24 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-10_09-28-12_claim-office-example-mapping_v4-exact-subagents_haiku-4-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-10_09-28-12_claim-office-example-mapping_v4-exact-subagents_haiku-4-5-no-thinking

 ✓ src/claim-office.spec.ts  (26 tests | 2 skipped) 4ms

 Test Files  1 passed (1)
      Tests  24 passed | 2 todo (26)
   Start at  15:00:47
   Duration  392ms (transform 34ms, setup 0ms, collect 30ms, tests 4ms, environment 0ms, prepare 87ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 41 | ×1 | 41 |
| Invocations | 33 | ×2 | 66 |
| Conditionals | 22 | ×4 | 88 |
| Loops | 5 | ×5 | 25 |
| Assignments | 35 | ×6 | 210 |
| **Total Mass** | | | **430** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 110 |
| Functions | 11 |
| Longest Function | 22 lines |
| Avg LOC/Function | 8.18 |
| Median LOC/Function | 6.00 |
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
| McCabe (Cyclomatic) | 7 | 2.77 | 0 |
| Cognitive (SonarJS) | 6 | 2.18 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 10240270 |
| Context Utilization | 47% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 25 |
| Avg Cycle Time | 91.16s |
| Avg Red Phase | 27.02s |
| Avg Green Phase | 27s |
| Avg Refactor Phase | 37.14s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 39 |
| Predictions Total | 47 |
| Accuracy | 82% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 25 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


