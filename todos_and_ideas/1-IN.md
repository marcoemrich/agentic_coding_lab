# TODOs and Ideas - In-Box

* H: Mars-Rover command-idea, wie integrieren
 * Optimize: Alternative Refactor-Techniques: based on Deterministic Refactorings

* TDD-Micro-Cycle
* FP-Stuff, check for immutabilitym pure functions
* switch everything to english
* Language-Erweiterung: RUST
* Neuer Worflow Red->Green, Refactoring nur am Ende

* Skills zum Untersuchen:
  - Omakase — https://omakaseagent.com
  - Ponytail — https://github.com/DietrichGebert/ponytail/tree/main

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

* Kleinere Novel-Kata fuer schnelleren Durchsatz.
  Aus RQ-architecture-axis-sol-pi: claim-office 229-4296 s/Run, game-of-life 140-899 s.
  claim-office ist der Flaschenhals, game-of-life ist schnell aber trainingsbekannt
  und differenziert kaum (alle 5 Zellen verification_pct 100 %).
  Gesucht: klein genug fuer Durchsatz UND novel genug zum Trennen. Ob beides
  gleichzeitig geht, ist offen. Material in research/kata-design/.

* Konsequenz aus RQ-architecture-axis-sol-pi: der auf Opus gebaute Workflow
  ist nicht auf Sol uebertragbar. Mechanismus in F-1.10 — Sol produziert den
  TDD-Zyklus von sich aus (6 Rot-Gruen-Zyklen, Extract Method ohne Aufforderung),
  Opus nicht (1 Zyklus, ganze Suite auf einmal). Die Architektur ist auf Opus'
  Defizit gebaut. Auf game-of-life ist v3 die beste Zelle im Feld; auf claim-office
  kauft v6.6 real etwas (Smell Total 0.0 vs 6.8, cognitive_max 4.4 vs 9.2) bei 6x Kosten.
  → Workflow-Entwicklung fuer Sol muesste bei v3 anfangen, nicht bei v6.
