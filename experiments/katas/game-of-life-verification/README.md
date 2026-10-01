# Verification suite for game-of-life (library form)

External acceptance suite for the library kata `game-of-life-{prose,user-story,example-mapping}`.

`adapter.ts` and `scenarios/` are symlinks to the sister directory `game-of-life-cli-verification/` — the 15 scenarios and the module-import adapter are identical. Difference from the CLI variant: no `src/cli.ts` is expected here; the adapter imports the `evolve`/`nextGeneration` function directly from `src/game-of-life.{ts,…}` and calls it `steps` times per scenario.

This keeps Correctness (external) (`verification_pct`) measurable on the library kata without mixing the CLI overhead into the code quality metrics.
