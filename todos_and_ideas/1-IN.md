# TODOs and Ideas - In-Box

 * Optimize: Alternative Refactor-Techniques: based on Deterministic Refactorings

* TDD-Micro-Cycle, assertion-first
* switch everything to english

* Skills zum Untersuchen:
  - nWave — Outside-In through the driving port; refactor position unresolved
    (the canon reads RED → GREEN → COMMIT). Expensive to dock: DELIVER needs the
    artifact chain from the preceding waves.

* Metrik-Lücke Lesbarkeit (aus RQ-architecture-axis-sol-pi, F-1.11):
  keine der aktuellen Metriken trennt lesbaren von unlesbarem Code.
  3 von 10 Zellen haben Smell Total 0.0 bei manuell als schlecht bewertetem Code.
  - Schnitt: von cc_avg_loc_per_function abgedeckt, ok
  - Deklarativ-statt-imperativ: messbar, aber ungemessen — Ratio for/while
    gegen map/filter/reduce/some/flatMap. Simpler AST-Zähler in analyze-run.sh
    reicht; eslint-plugin-unicorn wäre Overkill (no-for-loop trifft for...of gar nicht,
    plus Image-Rebuild + Reanalyse aller Bestandsruns).
    Vorsicht: sobald Metrik, ist sie per Workflow-Prompt gameable (README "Compliance metrics"),
    und "reduce-Kette besser als klare Schleife" ist inhaltlich strittig.

## Merge with other science framework or take ideas from it
Prio: Low

* https://github.com/vercel-labs/agent-eval/
* /plugin install plugin-eval@claude-code-workflows
* Harbor https://www.harborframework.com

## UI for Run-Filtering->Statistics

## Use Architecture Concepts

* Quality Attributes
* Diagramms
* Design Styles
* Arch. Pattterns

## Metrics

* Smell-Detect-Agent bauen mit Wissen aus Büchern
* research from science papers about TDD Studies
* Typing Strength
* Interdeps
