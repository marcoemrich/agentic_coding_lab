# TODOs and Ideas - In-Box

 * Optimize: Alternative Refactor-Techniques: based on Deterministic Refactorings

* TDD-Micro-Cycle, assertion-first

* Metric gap readability (from RQ-architecture-axis-sol-pi, F-1.11):
  none of the current metrics separates readable from unreadable code.
  3 of 10 cells have Smell Total 0.0 on code manually rated as bad.
  - Decomposition: covered by cc_avg_loc_per_function, ok
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
  - nWave — Outside-In through the driving port; refactor position unresolved
    (the canon reads RED → GREEN → COMMIT). Expensive to dock: DELIVER needs the
    artifact chain from the preceding waves.

## Merge with other science framework or take ideas from it

* https://github.com/vercel-labs/agent-eval/
* /plugin install plugin-eval@claude-code-workflows
* Harbor https://www.harborframework.com

