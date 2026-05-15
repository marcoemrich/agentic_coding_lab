---
id: RQ-8
question: "Liefert die APP-Heuristik (Code-Mass-Berechnung) im Refactor-Subagent einen messbaren Code-Qualitaets-Vorteil ueber Four Rules + Naming-Eval allein?"
factors:
  workflow_x_prompt:
    - {workflow: v6-hybrid,   prompt: example-mapping}
    - {workflow: v6.1-no-app, prompt: example-mapping}
controls:
  model: opus-4-7-no-thinking
  kata_base: game-of-life
outcomes:
  # primaer: Code-Qualitaet
  - code_mass
  - smell_total
  - cc_longest_function
  - cognitive_max
  - mccabe_max
  # TDD-Disziplin
  - refactorings_applied
  - cycle_count
  - predictions_correct_rate
  - tests_passed_immediately
  # Kosten
  - duration_seconds
  - total_tokens
  # Korrektheit (Sanity)
  - tests_passing
  - verification_pct
  - completed_within_budget
min_replicates: 5
status: aktiv
---

# RQ-8: APP-Heuristik im Refactor-Subagent — notwendig oder Ballast?

Liefert die *Absolute Priority Premise* (APP, Code-Mass-Berechnung) im Refactor-Subagent von v6-hybrid einen messbaren Code-Qualitaets-Vorteil — oder reichen die Four Rules of Simple Design plus Naming-Evaluation allein?

## Motivation

Nach RQ-7 ist v6-hybrid der vielversprechendste Workflow: bessere Code-Qualitaet als v4 in deutlich kuerzerer Wallclock, dazu erstmals 100 % Korrektheit-aussen auf claim-office. Token-Kosten sind aktuell der einzige Tradeoff (~2.4× v4). Vor weiteren strukturellen Aenderungen will RQ-8 einen isolierten, **klar einzeln entfernbaren** Prompt-Bestandteil pruefen: die APP-Heuristik im Refactor-Subagent.

APP nimmt im v6-Refactor-Prompt einen substanziellen Block ein (Mass-Formel, Component-Werte-Tabelle, Step 2 + Step 5 als eigene Berechnungs-Schritte, Mass-Reporting in den Output-Templates). Falls APP ohne messbaren Effekt ist, wuerde v6.1-no-app sowohl Prompt-Tokens als auch Modell-Aufmerksamkeit fuer wirksamere Inhalte freigeben.

## Workflow-Definition

- **v6-hybrid (Kontrolle, n=10 aus dem RQ-5-Pool)**: Refactor-Subagent mit vollem APP-Block: Mass-Formel, Component-Werte, Step "Calculate Initial APP Mass" + "Calculate New APP Mass", Mass-Reporting im Endblock.
- **v6.1-no-app (neu, n=5)**: identisch zu v6, einzige Aenderung im `agents/refactor.md`:
  - Sektion "Absolute Priority Premise (APP)" entfernt
  - Step 2 + Step 5 (APP-Mass-Berechnung) entfernt
  - Mass-Zeilen aus Step-6/7-Output-Templates entfernt
  - Mass-Berechnungen in den Refactoring-Beispielen entfernt
  - DO-Bullet "Calculate APP mass" + DON'T-Bullet "Never sacrifice clarity for lower mass" entfernt
  - In `rules/tdd.md` der Hinweis "Calculate APP mass before/after" entfernt
- **Was bleibt unveraendert**: "MUST attempt at least one refactoring", Four Rules of Simple Design, Naming-Evaluation als erster Schritt, Process-Skelett, Refactoring-Beispiele (nur die Mass-Kommentare gestrichen).

## Hypothesen

- **H1 (APP wirkungslos)**: v6.1 produziert auf den primaeren Code-Qualitaets-Metriken (`code_mass`, `smell_total`, `cognitive_max`, `mccabe_max`, `cc_longest_function`) statistisch ununterscheidbare Werte zu v6. Operationalisierung: alle Median-Differenzen pro Metrik liegen innerhalb von ±1 σ der v6-Streuung aus RQ-5.
  Konsequenz bei H1: APP ist Prompt-Ballast. v6.1 wird neuer Default-Hybrid, v6 archiviert.
- **H2 (APP hilft messbar)**: v6.1 produziert systematisch hoehere `code_mass` *und/oder* hoehere Komplexitaets-Metriken (smell/cognitive/mccabe) als v6. Operationalisierung: Median-Differenz ≥ +1 σ der v6-Streuung in mindestens zwei der fuenf primaeren Metriken, mit konsistenter Richtung (v6.1 schlechter).
  Konsequenz bei H2: APP liefert echten Mehrwert, bleibt im Workflow. Suchrichtung wechselt zu anderen Prompt-Bestandteilen.
- **H3 (APP kostet)**: v6.1 hat geringeren `total_tokens`-Verbrauch (kuerzerer Refactor-Subagent-Prompt + keine aktive Mass-Berechnung im Output). Operationalisierung: median(v6.1.total_tokens) < median(v6.total_tokens) bei mindestens 5 % Differenz.
  H3 ist orthogonal zu H1/H2 — eine v6.1 mit gleichwertiger Qualitaet *und* niedrigeren Tokens ist die staerkste Verbesserung.
- **H4 (TDD-Disziplin unveraendert)**: `cycle_count`, `refactorings_applied`, `predictions_correct_rate` bleiben bei v6.1 in den engen v6-Baendern (vgl. RQ-5 F-5.6). Falsifikation H4: ohne Mass-Heuristik fallen die Refactor-Quoten ab — moeglicherweise war Mass-Berechnung der Trigger, der den Subagent zum tatsaechlichen Refactor zwang.

**Falsifikation H1** waere ein klares Signal, dass nicht *jeder* Prompt-Bestandteil im v6-Refactor-Subagent traegt — Suchraum fuer weitere Prompt-Reduktion oeffnet sich.

## Design

```
Faktor:    workflow_x_prompt — 2 Stufen (v6-hybrid, v6.1-no-app), beide mit example-mapping
Kontrolle: model            — opus-4-7-no-thinking
Kontrolle: kata_base        — game-of-life

Zellen:    2 (2 Workflows x 1 Kata)
Replikate: n = 5
Runs:      15 total
           — 10 v6-Runs wiederverwendet aus RQ-5 (n=10 game-of-life-example-mapping)
           — 5 neue v6.1-no-app Runs
```

## Caveats

- **(a) Single Kata**: nur game-of-life. CLI-Kata claim-office bleibt eine offene Erweiterung — der APP-Effekt koennte dort anders aussehen, weil claim-office stark verzweigte Logik enthaelt (potenziell mehr Mass-Reduktions-Spielraum).
- **(b) Single Modell**: nur opus-4-7-no-thinking. Auf schwaecheren Modellen koennte APP als expliziter Berechnungs-Schritt mehr Struktur geben (oder mehr Halluzinationen ausloesen).
- **(c) n=5 fuer v6.1**: ausreichend fuer Median-Differenzen, zu klein fuer robuste Stabilitaets-Aussagen (vgl. RQ-5 F-5.3, n=3 instabil). Erweiterung auf n=10 vorgesehen, falls Erstsignal nicht eindeutig.
- **(d) v6-Vergleichsdaten aus RQ-5-Pool**: v6 hat im Pool n=10 auf game-of-life-example-mapping. Der Vergleich nutzt also asymmetrische Sample-Groessen (10 vs 5) — fuer Median-Differenz unproblematisch, fuer σ-Vergleich (Stabilitaets-Substudie) ist die Asymmetrie zu beachten.
- **(e) Indirekte Marker-Pruefung**: v6.1 nutzt denselben Skill-/Task-Mechanismus wie v6, der Parser braucht keine Anpassung. Die einzige Quelle fuer einen Marker-Bruch waere, dass das Modell ohne den expliziten APP-Schritt seltener `Task(refactor)` aufruft oder das `Red Phase Complete`-Format aendert — wird im Pipeline-Sanity-Check pro Run gegenkontrolliert.

## Findings

Siehe [findings.md](findings.md).

## Datenquelle

Alle Runs in `experiments/runs/` mit
`workflow ∈ {v6-hybrid, v6.1-no-app}`,
`kata = game-of-life-example-mapping`,
`model = opus-4-7-no-thinking`.
