# Analysis Report: 2026-10-20_03-26-59_claim-office-example-mapping_exact-subagents-v1-cc_fable-5-no-thinking

Generated: 2026-10-20T04:40:26+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-subagents-v1-cc |
| Model | fable-5-no-thinking |
| Model Version(s) | claude-fable-5 |
| Thinking | unknown |
| Duration | 4404s |
| Started | 2026-10-20T03:26:59+00:00 |
| Ended | 2026-10-20T04:40:25+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 284
- **Test files**: claim-office.spec.ts, cli.spec.ts
- **Test LOC** (total): 385
- **Active tests**: 44
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (44 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-20_03-26-59_claim-office-example-mapping_exact-subagents-v1-cc_fable-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-20_03-26-59_claim-office-example-mapping_exact-subagents-v1-cc_fable-5-no-thinking

 ✓ src/claim-office.spec.ts  (39 tests) 6ms
/home/experimenter/experiments/runs/2026-10-20_03-26-59_claim-office-example-mapping_exact-subagents-v1-cc_fable-5-no-thinking/src/claim-office.ts:28
    throw new Error(`Unknown item type: ${type}`);
          ^

Error: Unknown item type: broomstick
    at basePremiumFor (/home/experimenter/experiments/runs/2026-10-20_03-26-59_claim-office-example-mapping_exact-subagents-v1-cc_fable-5-no-thinking/src/claim-office.ts:28:11)
    at premiumForGroup (/home/experimenter/experiments/runs/2026-10-20_03-26-59_claim-office-example-mapping_exact-subagents-v1-cc_fable-5-no-thinking/src/claim-office.ts:48:23)
    at <anonymous> (/home/experimenter/experiments/runs/2026-10-20_03-26-59_claim-office-example-mapping_exact-subagents-v1-cc_fable-5-no-thinking/src/claim-office.ts:59:39)
    at Array.reduce (<anonymous>)
    at totalBasePremiumFor (/home/experimenter/experiments/runs/2026-10-20_03-26-59_claim-office-example-mapping_exact-subagents-v1-cc_fable-5-no-thinking/src/claim-office.ts:58:27)
    at quote (/home/experimenter/experiments/runs/2026-10-20_03-26-59_claim-office-example-mapping_exact-subagents-v1-cc_fable-5-no-thinking/src/claim-office.ts:125:29)
    at <anonymous> (/home/experimenter/experiments/runs/2026-10-20_03-26-59_claim-office-example-mapping_exact-subagents-v1-cc_fable-5-no-thinking/src/cli.ts:35:21)
    at ModuleJob.run (node:internal/modules/esm/module_job:343:25)
    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:681:26)
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5)

Node.js v22.23.3
/home/experimenter/experiments/runs/2026-10-20_03-26-59_claim-office-example-mapping_exact-subagents-v1-cc_fable-5-no-thinking/src/claim-office.ts:217
    throw new Error(`Negative damage amount: ${negativeDamage.amount}`);
          ^

Error: Negative damage amount: -200
    at assertDamageAmountsNotNegative (/home/experimenter/experiments/runs/2026-10-20_03-26-59_claim-office-example-mapping_exact-subagents-v1-cc_fable-5-no-thinking/src/claim-office.ts:217:11)
    at claim (/home/experimenter/experiments/runs/2026-10-20_03-26-59_claim-office-example-mapping_exact-subagents-v1-cc_fable-5-no-thinking/src/claim-office.ts:227:3)
    at <anonymous> (/home/experimenter/experiments/runs/2026-10-20_03-26-59_claim-office-example-mapping_exact-subagents-v1-cc_fable-5-no-thinking/src/cli.ts:41:20)
    at ModuleJob.run (node:internal/modules/esm/module_job:343:25)
    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:681:26)
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5)

Node.js v22.23.3
 ✓ src/cli.spec.ts  (5 tests) 309ms

 Test Files  2 passed (2)
      Tests  44 passed (44)
   Start at  04:40:26
   Duration  601ms (transform 45ms, setup 0ms, collect 43ms, tests 315ms, environment 0ms, prepare 86ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 82% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 48 | ×1 | 48 |
| Invocations | 59 | ×2 | 118 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 10 | ×5 | 50 |
| Assignments | 85 | ×6 | 510 |
| **Total Mass** | | | **782** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 234 |
| Functions | 21 |
| Longest Function | 13 lines |
| Avg LOC/Function | 3.86 |
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
| McCabe (Cyclomatic) | 4 | 1.67 | 0 |
| Cognitive (SonarJS) | 4 | 1.58 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 56220444 |
| Context Utilization | 94% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 44 |
| Avg Cycle Time | 110.63s |
| Avg Red Phase | 34.86s |
| Avg Green Phase | 25.97s |
| Avg Refactor Phase | 49.8s |

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
| Refactorings Applied | 28 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 16 |


