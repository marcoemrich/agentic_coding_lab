---
id: RQ-emoji-v6.1
question: "Haben Decoration-Emojis (✅ ❌ 🔴 🟢 🔄 📋 🚨 ⚠️) in den Workflow-Prompts (Skills + Refactor-Agent + rules/tdd.md) auf v6.1-Basis einen messbaren Effekt auf Code-Qualitaet oder TDD-Disziplin?"
factors:
  workflow_x_prompt:
    - {workflow: v6.1-hybrid-testlist-scope-fix, prompt: example-mapping}
    - {workflow: v6.1-no-emoji,                  prompt: example-mapping}
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
  # TDD-Disziplin (besonders relevant — Predictions sind emoji-markiert)
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

# RQ-emoji-v6.1: Emoji-Effekt auf v6.1-Basis (Re-Run)

Haben die rund 95 Decoration-Emojis (✅ 45×, ❌ 25×, 🚨 6×, 🔴 4×, 🟢 2×, 📋 2×, 🔄 1×, ⚠️ 1×) in den Skill-Commands und im Refactor-Subagent von v6.1 einen messbaren Effekt auf TDD-Disziplin oder Code-Qualitaet — oder sind sie reine Decoration?

## Motivation

Wiederholung der archivierten RQ-emoji (`_archive/workflow-dev-v1/2.4-emoji-effect/`) auf der neuen, korrekturgefixten v6.1-Basis. Die alte RQ-emoji baute auf der v6-hybrid-Linie, die spaeter als korrektheits-defekt identifiziert wurde (Bruch v6-hybrid → v6.5-lean). Befunde aus der alten Linie sind potenziell durch den Test-List-Scope-Bug konfundiert — daher Wiederholung auf `v6.1-hybrid-testlist-scope-fix` als valider Basis (siehe Memory `v6-rebuild-new-base.md`).

`MARKERS.md` klassifiziert Emoji-Header (`🔴 / 🟢 / 🔄 / 📋`) und ✅/❌-Status-Marker weiterhin als **decorative content (safe to drop)**. RQ-emoji-v6.1 prueft diese Klassifikation gegen v6.1 — parallel zur Schwester-RQ [RQ-pep-v6.1](../1.1-pep-effect-v6.1/README.md).

Zusatz-Motivation: CLAUDE.md des Repos verbietet explizit Emojis in eigenen Files (`"Only use emojis if the user explicitly requests it"`). Die Workflow-Prompts widersprechen dieser Regel — RQ-emoji-v6.1 prueft, ob das gerechtfertigt ist.

## Workflow-Definition

- **v6.1-hybrid-testlist-scope-fix (Kontrolle, n=5)**: vollstaendige Decoration-Emojis ueber alle 5 Workflow-Files (`red.md`, `green.md`, `test-list.md`, `refactor.md`, `rules/tdd.md`).
- **v6.1-no-emoji (neu, n=5)**: identisch zu v6.1-hybrid-testlist-scope-fix, einzige Aenderungen: Decoration-Emojis entfernt.
  - **Decoration entfernt** (95 Vorkommen): ✅, ❌, 🚨, 🔴, 🟢, 🔄, 📋, ⚠️ aus Headern, DO/DON'T-Listen, Process-Check-Sub-Steps und Output-Templates ersatzlos.
  - **Parser-kritisch korrigiert**: `✅ Correct` / `❌ Incorrect` in den Red-Phase-Prediction-Templates → `- Correct` / `- Incorrect`. Der Parser-Regex `(- | ✅ | ❌) (Correct|Incorrect)` akzeptiert beide Varianten (verifiziert in alter v6.4-no-emoji).
  - **❓ behalten** (8 Vorkommen in `test-list.md`): semantische Referenz auf Spec-Syntax (Clarifying Questions in example-mapping-Prompts wie claim-office). Kein Decoration-Marker — Entfernung wuerde Cross-Reference zur Spec-Syntax verlieren. Im game-of-life-Spec inaktiv, in claim-office aktiv genutzt.
- **Was bleibt unveraendert**: alle operationalen Anweisungen, Process-Steps, APP, Four Rules, **Pep-Talks (inkl. Psychological Resistance-Sektion)**, Refactor-Subagent-Logik, Prediction-Format inkl. Step-7-Verbatim-Anweisung in red.md, `test-list.md` mit Scope-Fix, alle Rules-Files.

## Hypothesen

- **H1 (Emojis wirkungslos auf Code-Qualitaet)**: alle 5 primaeren Metriken (`code_mass`, `smell_total`, `cc_longest_function`, `cognitive_max`, `mccabe_max`) statistisch ununterscheidbar zwischen den Workflows (Median-Differenz innerhalb ±1 σ der v6.1-Streuung).
  Konsequenz bei H1: Emoji-Decoration ist Prompt-Ballast — MARKERS-Klassifikation bestaetigt, no-emoji kann mit weiteren Reduktionen kombiniert werden.
- **H2 (Emojis helfen messbar)**: v6.1-no-emoji verschlechtert sich auf mindestens zwei der fuenf primaeren Metriken um ≥ +1 σ mit konsistenter Richtung.
  Konsequenz bei H2: visuelle Marker tragen — MARKERS-Klassifikation muss korrigiert werden.
- **H3 (Emojis kosten Tokens)**: v6.1-no-emoji spart Tokens und/oder Wallclock messbar (≥ 5%). **A-priori klein** erwartet — die ~95 Emojis machen mengenmaessig nur einen Bruchteil der Token-Last aus.
- **H4 (Prediction-Disziplin-Effekt)**: besonders sensitiv ist `predictions_correct_rate`, weil ✅/❌ direkt im Prediction-Output-Template stehen. RQ-pep-v6.1 F-1.1 zeigte, dass Wortwahl in red.md `predictions_correct_rate` beeinflussen kann (no-pep: 100.0% vs pep: 98.8%). Parallel-Erwartung: Hyphen-Marker statt ✅/❌ koennte aehnliche Drift zeigen.
- **H5 (Replikation)**: Das Ergebnis-Muster matched die alte RQ-emoji-Linie. Abweichung waere ein Indiz, dass die v6-Linie tatsaechlich durch den Test-List-Scope-Bug konfundiert war.

**A-priori Erwartung:** MARKERS-Klassifikation + Reduktions-Serie (Four Rules wirkungslos, Pep-Talks ohne Qualitaets-Effekt) sprechen fuer H1 mit moeglicher Disziplin-Verschiebung wie in RQ-pep. RQ-app hat aber gezeigt, dass Null-Effekt nicht der Default sein darf — Daten muessen pruefen.

## Design

```
Faktor:    workflow_x_prompt — 2 Stufen (v6.1-hybrid-testlist-scope-fix, v6.1-no-emoji), beide mit example-mapping
Kontrolle: model            — opus-4-7-no-thinking
Kontrolle: kata_base        — game-of-life

Zellen:    2 (2 Workflows x 1 Kata)
Replikate: n = 5
Runs:      10 total
           — 5 v6.1-hybrid-testlist-scope-fix Runs (wiederverwendbar aus RQ-pep-v6.1, identische Kontroll-Zelle)
           — 5 v6.1-no-emoji Runs (1 Smoke + 4 Batch-Fill)
```

**Wiederverwendung:** Die Kontroll-Zelle `v6.1-hybrid-testlist-scope-fix × game-of-life-example-mapping × opus-4-7-no-thinking` ist identisch mit der Kontroll-Zelle aus RQ-pep-v6.1. `aggregate-by-query.py` sammelt alle matching Runs aus `experiments/runs/` — keine Re-Run-Notwendigkeit.

## Caveats

- **Single Kata, single Modell, n=5**: identisch zur archivierten RQ-emoji. Erweiterung auf claim-office und groesseres n nach Bedarf.
- **Asymmetrische Decoration-Last**: ✅/❌-Marker (70 Vorkommen) dominieren — andere Emojis (🔴🟢🔄📋🚨⚠️, 15 Vorkommen) sind selten. Ein Effekt, falls vorhanden, kommt vermutlich primaer aus ✅/❌.
- **❓ nicht entfernt**: Im game-of-life-Spec ist diese Konvention inaktiv (game-of-life-Spec nutzt kein ❓). Ein zukuenftiger Lauf auf claim-office wuerde fuer eine reine "alle Emojis weg"-Variante das ❓ ebenfalls ersatzlos streichen muessen — und damit eine zusaetzliche Behandlung der Spec-Lesart erfordern.
- **Parser-Kompatibilitaet bestaetigt**: Hyphen-Variante "- Correct"/"- Incorrect" wird vom Parser korrekt als Prediction erkannt (alte v6.4-no-emoji-Smoke: 18/18 predictions parsed).
- **Direct-API-Modell**: opus-4-7-no-thinking ohne Portkey-Routing — kein single-shard-Zwang noetig fuer 10 Runs, aber pro Memory-Konvention nicht sharden.

## Findings

Siehe [findings.md](findings.md).

## Datenquelle

Alle Runs in `experiments/runs/` mit
`workflow ∈ {v6.1-hybrid-testlist-scope-fix, v6.1-no-emoji}`,
`kata = game-of-life-example-mapping`,
`model = opus-4-7-no-thinking`.
