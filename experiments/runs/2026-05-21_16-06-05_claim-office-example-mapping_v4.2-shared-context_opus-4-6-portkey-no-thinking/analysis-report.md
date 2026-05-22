# Analysis Report: 2026-05-21_16-06-05_claim-office-example-mapping_v4.2-shared-context_opus-4-6-portkey-no-thinking

Generated: 2026-05-21T18:02:02+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4.2-shared-context |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 6956s |
| Started | 2026-05-21T16:06:05+00:00 |
| Ended | 2026-05-21T18:02:02+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 188
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 656
- **Active tests**: 49
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (49 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-21_16-06-05_claim-office-example-mapping_v4.2-shared-context_opus-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-21_16-06-05_claim-office-example-mapping_v4.2-shared-context_opus-4-6-portkey-no-thinking

/home/experimenter/experiments/runs/2026-05-21_16-06-05_claim-office-example-mapping_v4.2-shared-context_opus-4-6-portkey-no-thinking/src/claim-office.ts:142
      throw new Error(`Unknown item type: ${item.type}`);
            ^

Error: Unknown item type: broomstick
    at validateItemTypes (/home/experimenter/experiments/runs/2026-05-21_16-06-05_claim-office-example-mapping_v4.2-shared-context_opus-4-6-portkey-no-thinking/src/claim-office.ts:142:13)
    at calculateQuotePremium (/home/experimenter/experiments/runs/2026-05-21_16-06-05_claim-office-example-mapping_v4.2-shared-context_opus-4-6-portkey-no-thinking/src/claim-office.ts:148:3)
    at processScenario (/home/experimenter/experiments/runs/2026-05-21_16-06-05_claim-office-example-mapping_v4.2-shared-context_opus-4-6-portkey-no-thinking/src/claim-office.ts:163:23)
    at <anonymous> (/home/experimenter/experiments/runs/2026-05-21_16-06-05_claim-office-example-mapping_v4.2-shared-context_opus-4-6-portkey-no-thinking/src/cli.ts:5:17)
    at ModuleJob.run (node:internal/modules/esm/module_job:343:25)
    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:665:26)
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5)

Node.js v22.22.2
 ✓ src/claim-office.spec.ts  (49 tests) 1947ms

 Test Files  1 passed (1)
      Tests  49 passed (49)
   Start at  18:02:03
   Duration  2.15s (transform 50ms, setup 0ms, collect 49ms, tests 1.95s, environment 0ms, prepare 53ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 96% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 56 | ×1 | 56 |
| Invocations | 61 | ×2 | 122 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 10 | ×5 | 50 |
| Assignments | 52 | ×6 | 312 |
| **Total Mass** | | | **596** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 162 |
| Functions | 14 |
| Longest Function | 26 lines |
| Avg LOC/Function | 7.43 |
| Median LOC/Function | 6.50 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 1 |
| Code Quality | 0 |
| **Total** | **1** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 5 | 2.33 | 0 |
| Cognitive (SonarJS) | 4 | 2.70 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 13483352 |
| Context Utilization | 58% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 49 |
| Avg Cycle Time | 204.68s |
| Avg Red Phase | 59.39s |
| Avg Green Phase | 53.32s |
| Avg Refactor Phase | 91.97s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 179 |
| Predictions Total | 179 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 22 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 27 |


