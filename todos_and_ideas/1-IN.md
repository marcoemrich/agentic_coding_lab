# TODOs and Ideas - In-Box

* H: Mars-Rover command-idea, wie integrieren
 * Optimize: Alternative Refactor-Techniques: based on Deterministic Refactorings

* TDD-Micro-Cycle
* FP-Stuff, check for immutabilitym pure functions
* switch everything to english
* Language-Erweiterung: RUST
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
  - Benennung: kein brauchbarer Proxy. Identifier-Länge belohnt processDataHelper2,
    Prompt-Vokabular-Overlap belohnt Abschreiben. Nur LLM-as-judge mit Rubrik —
    neuer Metriktyp (subjektiv, modellabhängig), müsste gegen Menschenurteil kalibriert werden.
  Entscheidung wirkt auf alle RQs, nicht nur auf die eine.

* cc_avg_loc_per_function nur ex post messen, nie als Optimierungsparameter
  ins Modell geben. Sobald ein Workflow-Prompt die Metrik nennt, optimiert das
  Modell darauf statt auf Zerlegung (README "Compliance metrics") — und die Metrik
  ist trivial gamebar: step1..step10 schneidet gut ab. Gilt fuer jede Metrik,
  die als Qualitaetsmass in einer RQ auftaucht.

