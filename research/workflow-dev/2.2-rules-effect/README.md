---
id: RQ-9
question: "Liefern die 'Four Rules of Simple Design' im Refactor-Subagent einen messbaren Code-Qualitaets-Vorteil ueber APP + Naming-Eval allein?"
factors:
  workflow_x_prompt:
    - {workflow: v6-hybrid,     prompt: example-mapping}
    - {workflow: v6.2-no-rules, prompt: example-mapping}
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

# RQ-9: Four Rules of Simple Design im Refactor-Subagent — notwendig oder Ballast?

Liefern die **Four Rules of Simple Design** (Kent Beck: Tests Pass → Reveals Intent → No Duplication → Fewest Elements) im Refactor-Subagent von v6-hybrid einen messbaren Code-Qualitaets-Vorteil — oder reichen APP + Naming-Eval + MUST-attempt allein?

## Motivation

Nach RQ-8 ist klar: **APP** im Refactor-Subagent traegt — Entfernung verschlechtert alle 5 primaeren Code-Qualitaets-Metriken und verdoppelt die Streuung. Damit ist APP als Pflicht-Bestandteil des v6-Refactor-Subagents identifiziert.

Naechster Kandidat in der Reduktions-Analyse: die **Four Rules of Simple Design**. Sie nehmen im aktuellen Refactor-Prompt einen vergleichbar grossen Block ein wie APP — komplette Sektion "Simple Design Rules (Priority Order)" mit Rule 1-4 und je drei bis fuenf Bullet-Sub-Items, plus eigener Process-Schritt "Apply Simple Design Rules" mit systematischer Rule-fuer-Rule-Evaluierung, plus mehrfache Erwaehnungen in DO/DON'T-Listen und Examples.

Das Reduktions-Pattern aus RQ-8 wird wiederholt: ein klar isolierbarer Prompt-Bestandteil wird entfernt, alles andere bleibt identisch. Falls Four Rules ohne Effekt sind, waere v6.2 ein Zwischenkandidat fuer einen schlankeren Hybrid mit gleicher Qualitaet.

## Workflow-Definition

- **v6-hybrid (Kontrolle, n=10 aus RQ-5-Pool)**: Refactor-Subagent mit vollem Setup (APP + Four Rules + Naming-Eval + MUST-attempt + Examples).
- **v6.2-no-rules (neu, n=5)**: identisch zu v6, einzige Aenderung im `agents/refactor.md`:
  - Sektion "Simple Design Rules (Priority Order)" mit Rule 1-4 entfernt
  - Process-Schritt "Apply Simple Design Rules (in order)" entfernt; ersetzt durch generischen "Identify and Implement Refactoring"-Schritt mit Beispiel-Liste fuer Refactoring-Typen
  - Rule-Verweise aus DO/DON'T-Listen, Mission, Examples und Remember entfernt
  - In `rules/tdd.md` der Hinweis "Apply Four Rules of Simple Design (priority order)" entfernt
- **Was bleibt unveraendert**: APP komplett (Mass-Formel, Component-Werte, Step "Calculate Initial APP Mass", Step "Calculate New APP Mass", Mass-Reporting), Naming-Eval als Step 1, "MUST attempt at least one refactoring", Process-Skelett, Refactoring-Beispiele.

## Hypothesen

- **H1 (Four Rules wirkungslos)**: v6.2 produziert auf den primaeren Code-Qualitaets-Metriken statistisch ununterscheidbare Werte zu v6. Operationalisierung wie in RQ-8: alle Median-Differenzen liegen innerhalb von ±1 σ der v6-Streuung aus RQ-5.
  Konsequenz bei H1: Four Rules sind redundant zu APP + Naming. v6.2 koennte neuer Default werden.
- **H2 (Four Rules helfen messbar)**: v6.2 produziert systematisch hoehere Werte auf mindestens zwei der fuenf primaeren Metriken mit konsistenter Richtung. Operationalisierung wie in RQ-8 (Median-Differenz ≥ +1 σ in mindestens zwei).
  Konsequenz bei H2: Four Rules tragen unabhaengig von APP. Bleiben im Workflow.
- **H3 (Four Rules kosten)**: v6.2 spart Tokens und/oder Wallclock messbar (≥ 5%) durch den schlankeren Prompt.
- **H4 (TDD-Disziplin unveraendert)**: cycle_count, refactorings_applied, predictions_correct_rate bleiben in den engen v6-Baendern aus RQ-5 F-5.6.

**Spezifische Erwartung gegenueber RQ-8:** APP wirkt vermutlich ueber den **objektiven Mess-Anker** (Mass vorher/nachher). Four Rules sind dagegen **qualitative Heuristiken**, die sich groesstenteils mit dem APP-Mechanismus ueberlappen (DRY → Mass-Reduktion durch Extract; Fewest Elements → Mass-Reduktion durch Inline; Reveals Intent → Naming-Eval). H1 ist daher die a-priori plausiblere Hypothese: ein Grossteil der Four-Rules-Wirkung sollte schon durch APP + Naming abgedeckt sein.

**Falsifikation H1**: v6.2 deutlich schlechter — Four Rules tragen orthogonal zu APP. Suchraum fuer weitere Reduktion verschiebt sich zu kleineren Prompt-Bloecken (Examples, Failure-Modes-Listen).

## Design

```
Faktor:    workflow_x_prompt — 2 Stufen (v6-hybrid, v6.2-no-rules), beide mit example-mapping
Kontrolle: model            — opus-4-7-no-thinking
Kontrolle: kata_base        — game-of-life

Zellen:    2 (2 Workflows x 1 Kata)
Replikate: n = 5
Runs:      15 total
           — 10 v6-Runs wiederverwendet aus RQ-5 (n=10 game-of-life-example-mapping)
           — 5 neue v6.2-no-rules Runs
```

## Caveats

- **Single Kata, single Modell, n=5**: identische Limitierungen wie RQ-8. Erweiterung auf claim-office und n=10 nach Bedarf.
- **Ueberlappung mit APP-Mechanismus**: Four Rules und APP koennten redundant sein. Ein Null-Effekt in RQ-9 schliesst nicht aus, dass *beide gemeinsam* entfernt einen grossen Effekt haetten — das waere eine separate RQ (z.B. RQ-10: v6 vs v6.3-only-naming).
- **Prompt-Inhalt nicht voellig orthogonal**: Some Four Rules text mentions "Reveals Intent" in der Naming-Sektion. Diese Verschraenkung wurde belassen, weil das eigentlich Naming-Eval-spezifischer Inhalt ist.

## Findings

Siehe [findings.md](findings.md).

## Datenquelle

Alle Runs in `experiments/runs/` mit
`workflow ∈ {v6-hybrid, v6.2-no-rules}`,
`kata = game-of-life-example-mapping`,
`model = opus-4-7-no-thinking`.
