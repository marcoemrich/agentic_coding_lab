# TODOs and Ideas - In-Box

 * Optimize: Alternative Refactor-Techniques: based on Deterministic Refactorings

* TDD-Micro-Cycle, assertion-first

* Metric gap readability (from RQ-architecture-axis-sol-pi, F-1.11):
  none of the current metrics separates readable from unreadable code.
  3 of 10 cells have Smell Total 0.0 on code manually rated as bad.
  - Decomposition: covered by avg_loc_per_function, ok
  - Declarative instead of imperative: measurable, but unmeasured — ratio of for/while
    to map/filter/reduce/some/flatMap. A simple AST counter in analyze-run.sh
    is enough; eslint-plugin-unicorn would be overkill (no-for-loop does not hit for...of at all,
    plus image rebuild + reanalysis of all existing runs).
    Caution: once it is a metric, it is gameable via the workflow prompt (README "Compliance metrics"),
    and "a reduce chain is better than a clear loop" is debatable on the merits.

## Use Architecture Concepts

* Quality Attributes
* Diagramms
* Design Styles
* Arch. Pattterns

## Metrics

* Build a smell-detection agent with knowledge from books, maybe use JEV-like
* research from science papers about TDD Studies
* Typing Strength
* Interdeps

## Skills/Workflows to investigate
  - End-refactor: prevent metric gaming when resolving `no-magic-numbers`. Replacing
    `toFixed(2)` with `TWO_DECIMAL_PLACES` only moves the literal into a name;
    it does not explain why that precision is required. Before introducing a
    constant, identify the rule it represents and name the purpose (e.g.
    `PLAIN_NUMBER_PRECISION` versus `USD_PRECISION`), or keep a clear literal
    when no shared rule exists. Do not treat a lower smell count as evidence of
    better design if the new abstraction adds noise or couples unrelated rules.
  - nWave — Outside-In through the driving port; refactor position unresolved
    (the canon reads RED → GREEN → COMMIT). Expensive to dock: DELIVER needs the
    artifact chain from the preceding waves.
  - TDD-MCP (Chris Lucian) — https://github.com/ChrisLucian-HunterIndustries/TDD-MCP
    Enforces TDD mechanically instead of by prompt: the MCP server is the only write
    path for code (built-in Edit/Write denied), state machine plan → red → green →
    refactor. `plan_tests` requires a test list with name/arrange/act/assert; red
    advances only with exactly one failing test; tests locked in green; branch-coverage
    gate on changed lines removes speculative code; commit per step; no comments.
    Supports pytest + vitest. Candidate workflow: feed the EXACT test list (from
    Example Mapping) into `plan_tests`, use the server as the enforcement layer.
    Open: no human checkpoint on the plan (autonomy levels), does not force
    triangulation (hardcoding per case still passes), fit with the lab's harness.

## Merge with other science framework or take ideas from it

* https://github.com/vercel-labs/agent-eval/
* /plugin install plugin-eval@claude-code-workflows
* Harbor https://www.harborframework.com
* SlopCodeBench (SCBench) — https://github.com/SprocketLab/slop-code-bench,
  https://www.scbench.ai, paper https://arxiv.org/abs/2603.24755 (MIT)
  Multi-checkpoint tasks: the agent extends its own code as the spec grows
  (36 problems, 196 checkpoints, Python track, black-box CLI/API tests).
  Metrics: Erosion = share of CC × √SLOC mass held by functions with CC > 10;
  Verbosity = lines hit by 137 AST-grep rules or clones / LoC.
  Their finding: erosion rises in 77 % of trajectories; anti-slop and plan-first
  prompts only lower the starting point, the slope stays (~1.3 pp per checkpoint).
  Idea for us: a multi-checkpoint RQ measuring the erosion *slope* per checkpoint —
  does a TDD workflow with an enforced refactor phase flatten the curve, or only
  shift the start like a prompt does? Single-shot katas cannot answer this.
  Erosion as a plain column on current katas is not worth it: ~90 % of runs have
  no function above CC 10 (floor effect).
  Open: how to implement in the lab — staged existing kata (claim-office?) vs.
  porting SCBench problems; run-batch.sh has no follow-up turns on the same workspace yet.

