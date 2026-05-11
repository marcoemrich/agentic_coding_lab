# Analysis Report: 2026-05-11_02-31-25_game-of-life-example-mapping_v5-exact-single-context_opus-4-7

Generated: 2026-05-11T02:40:44+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v5-exact-single-context |
| Model | opus-4-7 |
| Model Version(s) | claude-opus-4-7 |
| Thinking | true |
| Duration | 557s |
| Started | 2026-05-11T02:31:25+00:00 |
| Ended | 2026-05-11T02:40:44+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 40
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 56
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ❌ Tests failed or not runnable

```
Lockfile is up to date, resolution step is skipped
Already up to date

[ERR_PNPM_IGNORED_BUILDS] Ignored build scripts: esbuild@0.21.5, esbuild@0.27.7

Run "pnpm approve-builds" to pick which dependencies should be allowed to run scripts.
[ERROR] Command failed with exit code 1: /usr/local/bin/node /home/experimenter/.cache/node/corepack/v1/pnpm/11.0.9/bin/pnpm.mjs install

pnpm: Command failed with exit code 1: /usr/local/bin/node /home/experimenter/.cache/node/corepack/v1/pnpm/11.0.9/bin/pnpm.mjs install
    at getFinalError (file:///home/experimenter/.cache/node/corepack/v1/pnpm/11.0.9/dist/pnpm.mjs:28547:14)
    at makeError (file:///home/experimenter/.cache/node/corepack/v1/pnpm/11.0.9/dist/pnpm.mjs:30854:21)
    at getSyncResult (file:///home/experimenter/.cache/node/corepack/v1/pnpm/11.0.9/dist/pnpm.mjs:32698:10)
    at spawnSubprocessSync (file:///home/experimenter/.cache/node/corepack/v1/pnpm/11.0.9/dist/pnpm.mjs:32658:14)
    at execaCoreSync (file:///home/experimenter/.cache/node/corepack/v1/pnpm/11.0.9/dist/pnpm.mjs:32588:23)
    at callBoundExeca (file:///home/experimenter/.cache/node/corepack/v1/pnpm/11.0.9/dist/pnpm.mjs:35116:23)
    at boundExeca (file:///home/experimenter/.cache/node/corepack/v1/pnpm/11.0.9/dist/pnpm.mjs:35093:49)
    at sync (file:///home/experimenter/.cache/node/corepack/v1/pnpm/11.0.9/dist/pnpm.mjs:35252:10)
    at runPnpmCli (file:///home/experimenter/.cache/node/corepack/v1/pnpm/11.0.9/dist/pnpm.mjs:210243:5)
    at runDepsStatusCheck (file:///home/experimenter/.cache/node/corepack/v1/pnpm/11.0.9/dist/pnpm.mjs:211947:7)
```

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 15 | ×1 | 15 |
| Invocations | 19 | ×2 | 38 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 7 | ×5 | 35 |
| Assignments | 17 | ×6 | 102 |
| **Total Mass** | | | **202** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 34 |
| Functions | 3 |
| Longest Function | 25 lines |
| Avg LOC/Function | 12.33 |
| Median LOC/Function | 10.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 2 |
| Code Quality | 0 |
| **Total** | **3** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 8 | 4.00 | 0 |
| Cognitive (SonarJS) | 11 | 10.50 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 12268474 |
| Context Utilization | 14% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 10 |
| Avg Cycle Time | 84.24s |
| Avg Red Phase | 36.01s |
| Avg Green Phase | 25.12s |
| Avg Refactor Phase | 23.11s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 19 |
| Predictions Total | 20 |
| Accuracy | 95% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 4 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 7 |


