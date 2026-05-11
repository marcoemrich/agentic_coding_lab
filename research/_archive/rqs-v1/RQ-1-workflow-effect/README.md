---
id: RQ-1
question: "Wirkt der gewählte Workflow auf Code-Qualität, Korrektheit und TDD-Disziplin?"
factors:
  workflow_x_prompt:
    - {workflow: v1-oneshot,              prompt: prose}
    - {workflow: v2-iterative,            prompt: prose}
    - {workflow: v3-basic-tdd,            prompt: example-mapping}
    - {workflow: v4-exact-subagents,      prompt: example-mapping}
    - {workflow: v5-exact-single-context, prompt: example-mapping}
  kata_base: [game-of-life, claim-office]
controls:
  model: opus-4-7-no-thinking
outcomes:
  - tests_passing              # Korrektheit (Vitest, Innen-Sicht)
  - verification_pct           # Korrektheit (Akzeptanz-Suite, Außen-Sicht; null bei Vitest-Katas)
  - verification_passed        # Anzahl bestandene Akzeptanz-Szenarien
  - verification_total         # Anzahl Akzeptanz-Szenarien insgesamt
  - cc_loc                     # produktiver Code-LoC (clean-code, ohne Tests)
  - code_mass                  # Code-Mass (APP): LoC + test_lines
  - cc_avg_loc_per_function    # Clean-Code: mittlere Funktionslänge
  - cc_longest_function        # Spitzen-Komplexität (längste Funktion)
  - smell_total                # SonarJS-Smell-Summe
  - smell_complexity           # cognitive-complexity-Findings (Anzahl Schwellwert-Verstöße)
  - mccabe_max                 # numerische McCabe-Komplexität (höchste Funktion)
  - mccabe_avg                 # numerische McCabe-Komplexität (Mittelwert)
  - cognitive_max              # numerische Cognitive Complexity (höchste Funktion)
  - cognitive_avg              # numerische Cognitive Complexity (Mittelwert)
  - cycle_count                # TDD-Disziplin: Anzahl Red-Green-Refactor-Zyklen
  - refactorings_applied       # TDD-Disziplin: explizite Refactor-Phasen
  - predictions_correct        # TDD-Disziplin: korrekte Test-Outcome-Vorhersagen (absolut)
  - predictions_correct_rate   # TDD-Disziplin: Vorhersage-Trefferquote (pooled %)
  - tests_passed_immediately   # TDD-Anti-Signal: Tests gleich grün
  - duration_seconds           # Effizienz
  - completed_within_budget    # Praktikabilität: Anteil Runs, die im 90-min-Budget fertig wurden
min_replicates: 3
status: aktiv
---

# RQ-1: Workflow-Effekt

Wirkt sich der gewählte Workflow (von Stilanweisung "implementiere"
über "iteriere" und "verwende TDD" bis hin zu strikt geskriptetem
Phasen-Workflow) auf das Ergebnis aus, wenn ein einzelner
Claude-Code-Agent eine TypeScript-Kata implementiert?

Workflows können sich entlang vieler Dimensionen unterscheiden — TDD-
Vorschrift, Phasen-Aufteilung, Anzahl Subagents, Reflexions-Schritte,
Tool-Restriktionen etc. Diese RQ beobachtet den Gesamteffekt der
Workflow-Wahl, nicht eine einzelne Dimension davon.

## Aktuelles Workflow-Spektrum

| ID | Aufbau | Charakter |
|---|---|---|
| v1-oneshot              | "Implementiere X." | kein TDD, keine Iteration |
| v2-iterative            | "Plane Schritt für Schritt, dann implementiere." | kein TDD, mit Plan |
| v3-basic-tdd            | "Verwende TDD." | TDD per Self-Reporting |
| v4-exact-subagents      | Eigener Subagent pro Phase (Predictor + Red/Green/Refactor) | striktes TDD, multi-context |
| v5-exact-single-context | Alle Phasen in einer Konversation, gleiches Phasen-Skript | striktes TDD, single-context |

Konfiguration: `experiments/workflows/v{1..5}-*/.claude/agents/` und
`.claude/rules/`. Künftige Workflows (v6+) werden hier ergänzt.

## Design-Begründung

**Faires Workflow→Prompt-Pairing**: v1/v2 bekommen prose (kein
Test-Hint), v3/v4/v5 bekommen example-mapping (Beispiele = natürliche
Test-Cases für TDD). Siehe Methoden-Constraint im
Top-README, Abschnitt [Methodology constraints](../../README.md#methodology-constraints).

**Kontrolle auf game-of-life**: Einzige Kata mit verlässlichem
Code-Quality-Signal (mars-rover hat zu wenig Smells, string-calculator
und pixel-art-scaler waren trivial).

**Single Model (opus-4-7-no-thinking)**: Eliminiert Modell-Konfundierung.
Modell-Effekte sind Gegenstand von [RQ-3](../RQ-3-model-and-thinking/),
Wechselwirkungen von [RQ-4](../RQ-4-workflow-model-interaction/).

**No-thinking**: Adaptive Thinking ist Gegenstand von RQ-3. Hier wird es
ausgeschaltet, damit der Workflow-Effekt nicht von Thinking-Zugewinn
überlagert wird.

## Untersuchte Hypothesen

- H1: TDD-Workflows (v3/v4/v5) produzieren niedrigere `code_mass`
  als die Non-TDD-Workflows v1/v2.
- H2: TDD-Workflows reduzieren `smell_total` und `cc_longest_function`
  gegenüber v1/v2.
- H3: v5 (single-context) und v4 (multi-context) liefern vergleichbare
  Code-Qualität bei unterschiedlicher Token-Effizienz.
- H4: v3 ("verwende TDD" ohne Skript) zeigt schwächere TDD-Disziplin
  (`predictions_correct`, `tests_passed_immediately`) als v4/v5.

## Findings

Siehe [findings.md](findings.md).

## Datenquelle

Aggregation läuft über alle Runs in `experiments/runs/`, die zu
einem `(workflow, prompt)`-Paar aus dem Faktor-Pairing gehören und
mit `kata=game-of-life-{prompt}` und
`model=opus-4-7-no-thinking` matchen.

Aktuelle Datenbasis (Stand der Findings):

- 15 Runs aus dem ehemaligen `game-of-life-fair`-Batch (n=3 pro Zelle)
- Zusätzliche game-of-life-stability-Runs, sofern (workflow, prompt) matcht
