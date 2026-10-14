# Results site

## Pages

```bash
uv run --project ../experiments python ../experiments/build-site.py
                                             # all of it: re-aggregate every RQ, export, pnpm build;
                                             # durations, git diff --stat over research/; refuses during a batch
python3 ../experiments/export-site-data.py   # writes src/data/ (needs PyYAML; or uv run --project ../experiments)
pnpm dev                                     # dev server, pages at /rq/<id>/
pnpm build                                   # static pages under dist/
```

## Checks

```bash
pnpm test                 # full Vitest suite
pnpm typecheck            # TypeScript compiler
pnpm lint                 # ESLint/SonarJS smells in production src
pnpm --silent lint:json > /tmp/site-smells.json
pnpm --silent complexity:json > /tmp/site-complexity.json
```

The two JSON commands include all production `.ts` and `.tsx` files under `src/` and exclude `*.spec.ts(x)`. `lint:json` can exit nonzero when findings exist; its JSON output remains usable. A message's `filePath`, `line`, `ruleId` and `message` identify a finding. The `sonarjs/cognitive-complexity` rule in the smell configuration has a threshold of 10; treat its findings as measurements rather than additional smells.

`complexity:json` runs only ESLint's `complexity` (McCabe-style) and SonarJS's `sonarjs/cognitive-complexity` with reporting thresholds of zero. A function with no cognitive-complexity finding scores zero. APP mass is counted separately using the end-refactor skill's component weights; it is not an ESLint rule. The site uses TypeScript 6 because `typescript-eslint` does not yet support the TypeScript 7 native-preview compiler API.
