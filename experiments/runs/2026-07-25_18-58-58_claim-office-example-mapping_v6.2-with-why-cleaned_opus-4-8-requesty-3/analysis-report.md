# Analysis Report: 2026-07-25_18-58-58_claim-office-example-mapping_v6.2-with-why-cleaned_opus-4-8-requesty-3

Generated: 2026-07-25T20:04:40+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned |
| Model | opus-4-8-requesty |
| Model Version(s) | claude-opus-4-8 |
| Thinking | true |
| Duration | 3939s |
| Started | 2026-07-25T18:58:58+00:00 |
| Ended | 2026-07-25T20:04:40+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 205
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 501
- **Active tests**: 44
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (44 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-25_18-58-58_claim-office-example-mapping_v6.2-with-why-cleaned_opus-4-8-requesty-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-25_18-58-58_claim-office-example-mapping_v6.2-with-why-cleaned_opus-4-8-requesty-3

Unknown item type: broomstick
Claim damages more amulet items than are insured
Damage amount cannot be negative: -200
 ✓ src/claim-office.spec.ts  (44 tests) 1174ms

 Test Files  1 passed (1)
      Tests  44 passed (44)
   Start at  20:04:40
   Duration  1.36s (transform 42ms, setup 0ms, collect 48ms, tests 1.17s, environment 0ms, prepare 51ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 94% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 52 | ×1 | 52 |
| Invocations | 79 | ×2 | 158 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 6 | ×5 | 30 |
| Assignments | 85 | ×6 | 510 |
| **Total Mass** | | | **790** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 156 |
| Functions | 32 |
| Longest Function | 13 lines |
| Avg LOC/Function | 3.50 |
| Median LOC/Function | 2.00 |
| Imports | 2 |

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
| McCabe (Cyclomatic) | 4 | 1.48 | 0 |
| Cognitive (SonarJS) | 3 | 1.38 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 57642271 |
| Context Utilization | 188% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 44 |
| Avg Cycle Time | 97.96s |
| Avg Red Phase | 21.8s |
| Avg Green Phase | 24.84s |
| Avg Refactor Phase | 51.32s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 88 |
| Predictions Total | 88 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 44 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 21 |


