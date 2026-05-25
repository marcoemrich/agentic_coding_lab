# Analysis Report: 2026-05-25_18-43-17_claim-office-example-mapping_v8a-delayed-refactor-agent_opus-4-7-portkey-no-thinking

Generated: 2026-05-25T18:49:26+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v8a-delayed-refactor-agent |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 368s |
| Started | 2026-05-25T18:43:17+00:00 |
| Ended | 2026-05-25T18:49:26+00:00 |

## Code Metrics

- **Implementation files**: catalogue.ts, claim.ts, cli.ts, policy.ts, premium.ts, scenario.ts, types.ts
- **Implementation LOC** (total): 361
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 617
- **Active tests**: 42
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (42 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-25_18-43-17_claim-office-example-mapping_v8a-delayed-refactor-agent_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-25_18-43-17_claim-office-example-mapping_v8a-delayed-refactor-agent_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (42 tests) 8ms

 Test Files  1 passed (1)
      Tests  42 passed (42)
   Start at  18:49:27
   Duration  203ms (transform 55ms, setup 0ms, collect 57ms, tests 8ms, environment 0ms, prepare 50ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 87 | ×1 | 87 |
| Invocations | 120 | ×2 | 240 |
| Conditionals | 20 | ×4 | 80 |
| Loops | 12 | ×5 | 60 |
| Assignments | 77 | ×6 | 462 |
| **Total Mass** | | | **929** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 298 |
| Functions | 23 |
| Longest Function | 28 lines |
| Avg LOC/Function | 9.04 |
| Median LOC/Function | 7.00 |
| Imports | 12 |

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
| McCabe (Cyclomatic) | 8 | 1.97 | 0 |
| Cognitive (SonarJS) | 9 | 3.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3226054 |
| Context Utilization | 8% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 5 |
| Avg Cycle Time | 121.93s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 121.93s |

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


