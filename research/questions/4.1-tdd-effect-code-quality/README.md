---
id: RQ-tdd-quality
question: "Wie wirkt sich die Workflow-Struktur (von oneshot ueber iterativ bis zu striktem TDD mit Subagents) auf die Code-Qualitaet aus, und macht die TDD-Striktheit einen Unterschied?"
factors:
  workflow_x_prompt:
    - {workflow: v1-oneshot,             prompt: prose}
    - {workflow: v2-iterative,           prompt: prose}
    - {workflow: v3-basic-tdd,           prompt: example-mapping}
    - {workflow: v4.1-testlist-scope-fix, prompt: example-mapping}
    - {workflow: v5.1-testlist-scope-fix, prompt: example-mapping}
    - {workflow: v6.1-hybrid-testlist-scope-fix, prompt: example-mapping}
controls:
  kata_base: game-of-life
  model:
    any:                            # OR-match: neue Runs via Portkey (Prio 1), bestehende Direct-Runs wiederverwenden
      - opus-4-7-portkey-no-thinking
      - opus-4-7-no-thinking
outcomes:
  # primaer: Code-Qualitaet
  - code_mass
  - smell_total
  - cc_longest_function
  - cc_loc
  - mccabe_max
  - cognitive_max
  # Test-Staerke: operationalisiert die Kern-Hypothese, ob TDD-Workflows
  # substanziellere Tests erzeugen als Post-hoc-Tests (v1/v2). Wird nur
  # fuer grüne Runs berechnet; bei v1/v2 darum oft nur Teilabdeckung.
  - mutation_score
  # sekundaer: Korrektheit (innen + aussen)
  - tests_passing
  - verification_pct
  - verification_passed
  - verification_total
  - completed_within_budget
  # TDD-Disziplin (nur v3/v4.1/v5.1/v6.1 sinnvoll)
  - tdd_cycles
  - refactorings
  - prediction_accuracy
  - tests_immediately_passing
  # Kontext
  - duration_seconds
  - total_tokens
min_replicates: 3
status: aktiv
---

# RQ-tdd-quality: Workflow-Effekt auf Code-Qualitaet

Wie veraendern sich Code-Qualitaet, Korrektheit und TDD-Disziplin entlang der Workflow-Spanne von "vibe-coding ohne TDD" (v1) ueber iteratives Vorgehen (v2), minimales TDD (v3) bis hin zu strikt phasen-isoliertem TDD mit Subagents (v4.1) bzw. strikt phasen-strukturiertem TDD im Single-Context (v5.1)?

## Motivation

Die Workflow-Variante ist die zentrale "Hebel"-Variable des Lab-Setups — wir haben fuenf Varianten mit unterschiedlicher TDD-Striktheit und Phasenstruktur, aber bisher keine kontrollierte Modell-pinned-Messung ihrer Wirkung auf Code-Qualitaet *auf der jetzt vollstaendigen Metrik-Basis* (Code-Mass, Smells, McCabe, Cognitive, plus Aussen-Korrektheit ueber Modul-Import-Adapter aus RQ-model-quality).

Insbesondere offen:

1. **Macht TDD ueberhaupt einen Unterschied?** (v1+v2 vs v3+v4.1+v5.1)
2. **Macht die Striktheit einen Unterschied?** (v3 minimal vs v4.1/v5.1 strikt)
3. **Phasen-Isolierung vs Shared-Context?** (v4.1 vs v5.1)

## Modell- und Kata-Wahl

| Variable | Wert | Begruendung |
|---|---|---|
| Modell | `opus-4-7-no-thinking` (Portkey ODER Direct, OR-match) | Aktuellste Opus-Version. Neue Fill-Runs gehen ueber Portkey (Prio 1), bestehende Direct-Runs werden wiederverwendet; beide Routen zaehlen als eine Zelle (siehe Caveat b). RQ-model-quality zeigt: Opus-Modelle differenzieren sich in Code-Qualitaet nur marginal, Thinking-Effekt ist modell-individuell; ein einziger Modell-Pin isoliert den Workflow-Effekt cleanly. Workflow x Modell-Interaktion bleibt eine spaetere RQ. |
| Kata | `game-of-life` (Library-Form, kein CLI) | Code-Qualitaet wird ohne CLI-Overhead-Anteil gemessen. Externe Korrektheit ueber `game-of-life-verification/` ist seit RQ-model-quality-Folgeschritt auch ohne CLI verfuegbar (Modul-Import-Adapter). |
| Prompt-Pairing | v1/v2 → prose, v3/v4.1/v5.1 → example-mapping | Methodologie-Constraint: Examples in v1/v2 koennten den Agenten zu Test-First-Verhalten anstacheln und damit den Non-TDD-Vergleich kontaminieren. RQ-prompt-known-kata hat zudem gezeigt, dass auf trainingsbekannten Katas der Prompt-Stil keinen konsistenten Qualitaetseffekt hat — die Asymmetrie sollte das Ergebnis nicht verzerren. |

## Design

```
Faktor:    workflow_x_prompt  — 6 Stufen (v1+prose, v2+prose,
                                          v3+EM, v4.1+EM, v5.1+EM, v6.1+EM)
Kontrolle: model              — opus-4-7-no-thinking (Portkey ODER Direct, OR-match, siehe Caveat b)
Kontrolle: kata_base          — game-of-life

Zellen:    6
Replikate: n = 3
Runs:      18 total
```

## Hypothesen

- **H1 (TDD-Effekt vorhanden)**: v3/v4.1/v5.1 zeigen niedrigere `cognitive_max`, `mccabe_max`, `smell_total` als v1/v2 — TDD diszipliniert Funktionsgroesse und Komplexitaet, weil jeder Test eine inkrementelle Designvorgabe macht.
- **H2 (Striktheit verbessert weiter)**: v4.1/v5.1 (phasen-strukturiert) liefern strengere Code-Qualitaet als v3 (minimal-TDD). Insbesondere v4.1 (phasen-isolierte Subagents) produziert die kuerzesten Funktionen (`cc_longest_function`), weil jede Green-Phase isoliert in einem frischen Kontext laeuft und keinen Anreiz hat, ueberzuimplementieren.
- **H3 (v4.1 vs v5.1 unterscheiden sich)**: v4.1 vs v5.1 zeigen unterschiedliche Disziplin-Muster — v4.1 hat hoehere `prediction_accuracy` (frischer Kontext erzwingt explizite Zustandsbeschreibung), v5.1 hat hoehere `refactorings` (geteilter Kontext erlaubt opportunistisches Aufraeumen).
- **H4 (Aussen-Korrektheit unabhaengig vom Workflow)**: `verification_pct` liegt fuer alle Zellen bei 1.00 — der Repraesentations-Effekt aus F-model-quality.5 ist Modell-getrieben (Opus = Tupel), nicht Workflow-getrieben. Falsifikation: ein Workflow erzeugt systematisch andere Repraesentationen.

**Falsifikation H1** (Code-Qualitaet zwischen v1/v2 und v3/v4.1/v5.1 ueberlappt vollstaendig oder ist umgekehrt): TDD diszipliniert die Code-Qualitaet auf diesem Setup nicht — Konsequenz fuer alle nachfolgenden TDD-Varianten-Vergleiche, weil dann die TDD-Variante kein dominanter Faktor mehr ist.

**Falsifikation H2** (v3 ≈ v4.1 ≈ v5.1 in Qualitaet): TDD-Striktheit traegt keinen messbaren Vorteil — minimal-TDD reicht aus.

## Caveats

- **(a) Single workflow point je Cell**: Jeder Workflow nur einmal — keine "Workflow x sub-Variante"-Differenzierung (z.B. v4.1 mit/ohne explizite Skill-Definitionen).
- **(b) Single model, Routing gemischt**: Nur `opus-4-7-no-thinking`, aber `controls.model` ist eine ODER-Liste `[opus-4-7-portkey-no-thinking, opus-4-7-no-thinking]`. Neue Fill-Runs gehen ueber Portkey (Prio 1), bestehende Direct-Runs werden weiterverwendet; beide Routen zaehlen als eine Zelle. Annahme: Routing hat keinen Effekt auf Code-Qualitaet (selbes Modellgewicht, selbe Sampling-Parameter); auf `duration_seconds`/`completed_within_budget` ggf. schon (Portkey-Retry/Timeout-Charakteristik). Falls Pivots starke routing-bedingte Streuung zeigen, nach `model` statt `cell_model` gruppieren. Workflow-Effekte koennten zudem bei schwaecheren Modellen anders aussehen (vgl. RQ-model-quality Sonnet-Repraesentations-Problem).
- **(c) Single kata**: Nur Game of Life (Library-Form). mars-rover bleibt offen.
- **(d) Prompt-Asymmetrie**: v1/v2 nutzen `prose`, v3/v4.1/v5.1/v6.1 nutzen `example-mapping`. Methodologie-Constraint; ein hypothetischer Prompt-Effekt auf game-of-life ist nach RQ-prompt-known-kata nicht zu erwarten, kann aber nicht ganz ausgeschlossen werden.
- **(e) Aussen-Korrektheit via Tupel-Adapter**: `verification_pct` setzt `[number, number][]`-Repraesentation voraus (siehe RQ-model-quality F-model-quality.5). Bei opus-4-7-no-thinking war die Tupel-Wahl in RQ-model-quality in 3/4 Runs gegeben, 1/4 nutzte Objekte. Ggf. landen einzelne Zellen unter 100 % aus diesem Grund — siehe H4.

## Findings

Siehe [findings.md](findings.md).

## Datenquelle

Alle Runs in `experiments/runs/` mit
`workflow ∈ {v1-oneshot, v2-iterative, v3-basic-tdd, v4.1-testlist-scope-fix, v5.1-testlist-scope-fix, v6.1-hybrid-testlist-scope-fix}`,
`kata ∈ {game-of-life-prose, game-of-life-example-mapping}` (jeweils nach Workflow-Constraint),
`model ∈ {opus-4-7-portkey-no-thinking, opus-4-7-no-thinking}` (ODER-Match, siehe Caveat b).
