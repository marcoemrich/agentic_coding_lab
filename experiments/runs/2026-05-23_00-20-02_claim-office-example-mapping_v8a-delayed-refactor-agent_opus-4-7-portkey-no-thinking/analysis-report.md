# Analysis Report: 2026-05-23_00-20-02_claim-office-example-mapping_v8a-delayed-refactor-agent_opus-4-7-portkey-no-thinking

Generated: 2026-05-23T11:57:49+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v8a-delayed-refactor-agent |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 267s |
| Started | 2026-05-23T00:20:02+00:00 |
| Ended | 2026-05-23T00:24:30+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 301
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 414
- **Active tests**: 41
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (41 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-23_00-20-02_claim-office-example-mapping_v8a-delayed-refactor-agent_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-23_00-20-02_claim-office-example-mapping_v8a-delayed-refactor-agent_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (41 tests) 2067ms

 Test Files  1 passed (1)
      Tests  41 passed (41)
   Start at  11:57:50
   Duration  2.48s (transform 42ms, setup 0ms, collect 42ms, tests 2.07s, environment 0ms, prepare 62ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 84% |
| Branches | 80% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 70 | ×1 | 70 |
| Invocations | 107 | ×2 | 214 |
| Conditionals | 25 | ×4 | 100 |
| Loops | 14 | ×5 | 70 |
| Assignments | 68 | ×6 | 408 |
| **Total Mass** | | | **862** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 242 |
| Functions | 15 |
| Longest Function | 31 lines |
| Avg LOC/Function | 12.27 |
| Median LOC/Function | 9.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 3 |
| Code Quality | 0 |
| **Total** | **3** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 7 | 2.70 | 0 |
| Cognitive (SonarJS) | 10 | 4.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1859320 |
| Context Utilization | 7% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 4 |
| Avg Cycle Time | 78.19s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 78.19s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 0 |
| Predictions Total | 0 |
| Accuracy | N/A |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 1 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


