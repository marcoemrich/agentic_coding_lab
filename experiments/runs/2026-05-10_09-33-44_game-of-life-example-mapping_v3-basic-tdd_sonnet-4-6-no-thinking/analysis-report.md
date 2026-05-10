# Analysis Report: 2026-05-10_09-33-44_game-of-life-example-mapping_v3-basic-tdd_sonnet-4-6-no-thinking

Generated: 2026-05-10T09:34:38+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v3-basic-tdd |
| Model | sonnet-4-6-no-thinking |
| Model Version(s) | claude-sonnet-4-6 |
| Thinking | unknown |
| Duration | 52s |
| Started | 2026-05-10T09:33:44+00:00 |
| Ended | 2026-05-10T09:34:38+00:00 |

## Code Metrics

- **Implementation file**: game-of-life.ts
- **Implementation LOC**: 39
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 73
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ❌ Tests failed or not runnable

```
Lockfile is up to date, resolution step is skipped
Already up to date

[ERR_PNPM_IGNORED_BUILDS] Ignored build scripts: esbuild@0.21.5, esbuild@0.27.7

Run "pnpm approve-builds" to pick which dependencies should be allowed to run scripts.
[ERROR] Command failed with exit code 1: /usr/local/bin/node /home/experimenter/.cache/node/corepack/v1/pnpm/11.0.8/bin/pnpm.mjs install

pnpm: Command failed with exit code 1: /usr/local/bin/node /home/experimenter/.cache/node/corepack/v1/pnpm/11.0.8/bin/pnpm.mjs install
    at getFinalError (file:///home/experimenter/.cache/node/corepack/v1/pnpm/11.0.8/dist/pnpm.mjs:28550:14)
    at makeError (file:///home/experimenter/.cache/node/corepack/v1/pnpm/11.0.8/dist/pnpm.mjs:30857:21)
    at getSyncResult (file:///home/experimenter/.cache/node/corepack/v1/pnpm/11.0.8/dist/pnpm.mjs:32701:10)
    at spawnSubprocessSync (file:///home/experimenter/.cache/node/corepack/v1/pnpm/11.0.8/dist/pnpm.mjs:32661:14)
    at execaCoreSync (file:///home/experimenter/.cache/node/corepack/v1/pnpm/11.0.8/dist/pnpm.mjs:32591:23)
    at callBoundExeca (file:///home/experimenter/.cache/node/corepack/v1/pnpm/11.0.8/dist/pnpm.mjs:35119:23)
    at boundExeca (file:///home/experimenter/.cache/node/corepack/v1/pnpm/11.0.8/dist/pnpm.mjs:35096:49)
    at sync (file:///home/experimenter/.cache/node/corepack/v1/pnpm/11.0.8/dist/pnpm.mjs:35255:10)
    at runPnpmCli (file:///home/experimenter/.cache/node/corepack/v1/pnpm/11.0.8/dist/pnpm.mjs:208877:5)
    at runDepsStatusCheck (file:///home/experimenter/.cache/node/corepack/v1/pnpm/11.0.8/dist/pnpm.mjs:210581:7)
```

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 19 | ×1 | 19 |
| Invocations | 19 | ×2 | 38 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 6 | ×5 | 30 |
| Assignments | 7 | ×6 | 42 |
| **Total Mass** | | | **141** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 30 |
| Functions | 2 |
| Longest Function | 29 lines |
| Avg LOC/Function | 18 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 1 |
| Magic Numbers | 3 |
| Code Quality | 0 |
| **Total** | **5** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 11 | 4.33 | 1 |
| Cognitive (SonarJS) | 12 | 12.00 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 446592 |
| Context Utilization | 3% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 1.98s |
| Avg Red Phase | 0s |
| Avg Green Phase | 1.98s |
| Avg Refactor Phase | 0s |

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
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


