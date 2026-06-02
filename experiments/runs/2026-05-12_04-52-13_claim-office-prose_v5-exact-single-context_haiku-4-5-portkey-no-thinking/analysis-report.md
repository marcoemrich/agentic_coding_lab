# Analysis Report: 2026-05-12_04-52-13_claim-office-prose_v5-exact-single-context_haiku-4-5-portkey-no-thinking

Generated: 2026-06-02T07:59:55+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-prose |
| Workflow | v5-exact-single-context |
| Model | haiku-4-5-portkey-no-thinking |
| Model Version(s) | claude-haiku-4-5-20251001 |
| Thinking | unknown |
| Duration | 418s |
| Started | 2026-05-12T04:52:13+00:00 |
| Ended | 2026-05-12T04:59:12+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, mhpco.ts
- **Implementation LOC** (total): 162
- **Test file**: mhpco.spec.ts
- **Test file LOC**: 199
- **Active tests**: 26
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (26 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_04-52-13_claim-office-prose_v5-exact-single-context_haiku-4-5-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_04-52-13_claim-office-prose_v5-exact-single-context_haiku-4-5-portkey-no-thinking

 ✓ src/mhpco.spec.ts  (26 tests) 4ms

 Test Files  1 passed (1)
      Tests  26 passed (26)
   Start at  07:59:57
   Duration  341ms (transform 32ms, setup 0ms, collect 32ms, tests 4ms, environment 0ms, prepare 87ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 54% |
| Branches | 78% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 65 | ×1 | 65 |
| Invocations | 39 | ×2 | 78 |
| Conditionals | 20 | ×4 | 80 |
| Loops | 7 | ×5 | 35 |
| Assignments | 31 | ×6 | 186 |
| **Total Mass** | | | **444** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 123 |
| Functions | 3 |
| Longest Function | 43 lines |
| Avg LOC/Function | 37.00 |
| Median LOC/Function | 37.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 2 |
| Duplication | 0 |
| Magic Numbers | 12 |
| Code Quality | 0 |
| **Total** | **14** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 13 | 6.60 | 1 |
| Cognitive (SonarJS) | 12 | 7.00 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 16659812 |
| Context Utilization | 63% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 9 |
| Avg Cycle Time | 53.32s |
| Avg Red Phase | 11.95s |
| Avg Green Phase | 11.56s |
| Avg Refactor Phase | 29.81s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 9 |
| Predictions Total | 9 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 7 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 2 |


