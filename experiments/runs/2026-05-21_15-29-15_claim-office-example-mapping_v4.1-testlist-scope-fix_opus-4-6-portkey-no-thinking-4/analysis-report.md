# Analysis Report: 2026-05-21_15-29-15_claim-office-example-mapping_v4.1-testlist-scope-fix_opus-4-6-portkey-no-thinking-4

Generated: 2026-05-21T16:45:10+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4.1-testlist-scope-fix |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 4553s |
| Started | 2026-05-21T15:29:15+00:00 |
| Ended | 2026-05-21T16:45:10+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 157
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 1163
- **Active tests**: 52
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (52 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-21_15-29-15_claim-office-example-mapping_v4.1-testlist-scope-fix_opus-4-6-portkey-no-thinking-4
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-21_15-29-15_claim-office-example-mapping_v4.1-testlist-scope-fix_opus-4-6-portkey-no-thinking-4

/home/experimenter/experiments/runs/2026-05-21_15-29-15_claim-office-example-mapping_v4.1-testlist-scope-fix_opus-4-6-portkey-no-thinking-4/src/claim-office.ts:95
      throw new Error(`Unknown item type: ${item.type}`);
      ^

Error: Unknown item type: broomstick
    at processQuote (/home/experimenter/experiments/runs/2026-05-21_15-29-15_claim-office-example-mapping_v4.1-testlist-scope-fix_opus-4-6-portkey-no-thinking-4/src/claim-office.ts:95:13)
    at claimOffice (/home/experimenter/experiments/runs/2026-05-21_15-29-15_claim-office-example-mapping_v4.1-testlist-scope-fix_opus-4-6-portkey-no-thinking-4/src/claim-office.ts:140:20)
    at Socket.<anonymous> (/home/experimenter/experiments/runs/2026-05-21_15-29-15_claim-office-example-mapping_v4.1-testlist-scope-fix_opus-4-6-portkey-no-thinking-4/src/cli.ts:10:19)
    at Socket.emit (node:events:531:35)
    at endReadableNT (node:internal/streams/readable:1698:12)
    at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

Node.js v22.22.2
/home/experimenter/experiments/runs/2026-05-21_15-29-15_claim-office-example-mapping_v4.1-testlist-scope-fix_opus-4-6-portkey-no-thinking-4/src/claim-office.ts:44
      throw new Error(`More damages of type ${type} than insured`);
      ^

Error: More damages of type amulet than insured
    at processClaim (/home/experimenter/experiments/runs/2026-05-21_15-29-15_claim-office-example-mapping_v4.1-testlist-scope-fix_opus-4-6-portkey-no-thinking-4/src/claim-office.ts:44:13)
    at claimOffice (/home/experimenter/experiments/runs/2026-05-21_15-29-15_claim-office-example-mapping_v4.1-testlist-scope-fix_opus-4-6-portkey-no-thinking-4/src/claim-office.ts:138:20)
    at Socket.<anonymous> (/home/experimenter/experiments/runs/2026-05-21_15-29-15_claim-office-example-mapping_v4.1-testlist-scope-fix_opus-4-6-portkey-no-thinking-4/src/cli.ts:10:19)
    at Socket.emit (node:events:531:35)
    at endReadableNT (node:internal/streams/readable:1698:12)
    at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

Node.js v22.22.2
/home/experimenter/experiments/runs/2026-05-21_15-29-15_claim-office-example-mapping_v4.1-testlist-scope-fix_opus-4-6-portkey-no-thinking-4/src/claim-office.ts:50
      throw new Error("Negative damage amount");
      ^

Error: Negative damage amount
    at processClaim (/home/experimenter/experiments/runs/2026-05-21_15-29-15_claim-office-example-mapping_v4.1-testlist-scope-fix_opus-4-6-portkey-no-thinking-4/src/claim-office.ts:50:13)
    at claimOffice (/home/experimenter/experiments/runs/2026-05-21_15-29-15_claim-office-example-mapping_v4.1-testlist-scope-fix_opus-4-6-portkey-no-thinking-4/src/claim-office.ts:138:20)
    at Socket.<anonymous> (/home/experimenter/experiments/runs/2026-05-21_15-29-15_claim-office-example-mapping_v4.1-testlist-scope-fix_opus-4-6-portkey-no-thinking-4/src/cli.ts:10:19)
    at Socket.emit (node:events:531:35)
    at endReadableNT (node:internal/streams/readable:1698:12)
    at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

Node.js v22.22.2
 ✓ src/claim-office.spec.ts  (52 tests) 1799ms

 Test Files  1 passed (1)
      Tests  52 passed (52)
   Start at  16:45:11
   Duration  1.99s (transform 48ms, setup 0ms, collect 59ms, tests 1.80s, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 50 | ×1 | 50 |
| Invocations | 54 | ×2 | 108 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 11 | ×5 | 55 |
| Assignments | 54 | ×6 | 324 |
| **Total Mass** | | | **589** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 133 |
| Functions | 3 |
| Longest Function | 18 lines |
| Avg LOC/Function | 7.33 |
| Median LOC/Function | 2.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 4 |
| Duplication | 0 |
| Magic Numbers | 11 |
| Code Quality | 0 |
| **Total** | **15** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 17 | 5.57 | 2 |
| Cognitive (SonarJS) | 20 | 10.75 | 2 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 16330090 |
| Context Utilization | 75% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 51 |
| Avg Cycle Time | 154.78s |
| Avg Red Phase | 41.61s |
| Avg Green Phase | 40.61s |
| Avg Refactor Phase | 72.56s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 102 |
| Predictions Total | 102 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 5 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 30 |


