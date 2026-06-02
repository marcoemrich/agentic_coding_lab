# Analysis Report: 2026-05-11_23-09-36_claim-office-prose_v5-exact-single-context_opus-4-6-portkey-no-thinking

Generated: 2026-06-02T07:54:38+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-prose |
| Workflow | v5-exact-single-context |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 1447s |
| Started | 2026-05-11T23:09:36+00:00 |
| Ended | 2026-05-11T23:33:45+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 125
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 353
- **Active tests**: 16
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (16 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-11_23-09-36_claim-office-prose_v5-exact-single-context_opus-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-11_23-09-36_claim-office-prose_v5-exact-single-context_opus-4-6-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (16 tests) 3ms

 Test Files  1 passed (1)
      Tests  16 passed (16)
   Start at  07:54:40
   Duration  347ms (transform 31ms, setup 0ms, collect 30ms, tests 3ms, environment 0ms, prepare 87ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 91% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 47 | ×1 | 47 |
| Invocations | 37 | ×2 | 74 |
| Conditionals | 8 | ×4 | 32 |
| Loops | 5 | ×5 | 25 |
| Assignments | 56 | ×6 | 336 |
| **Total Mass** | | | **514** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 114 |
| Functions | 4 |
| Longest Function | 24 lines |
| Avg LOC/Function | 14.50 |
| Median LOC/Function | 16.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 2 |
| Duplication | 0 |
| Magic Numbers | 1 |
| Code Quality | 0 |
| **Total** | **3** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 7 | 2.44 | 0 |
| Cognitive (SonarJS) | 12 | 4.00 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 34654061 |
| Context Utilization | 83% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 16 |
| Avg Cycle Time | 101.84s |
| Avg Red Phase | 31.03s |
| Avg Green Phase | 25.84s |
| Avg Refactor Phase | 44.97s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 32 |
| Predictions Total | 32 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 13 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 5 |


