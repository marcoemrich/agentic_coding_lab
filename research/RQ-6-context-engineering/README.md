---
id: RQ-6
question: "Welche Form der Kontext-Strukturierung — isolierte Subagent-Kontexte pro TDD-Phase (v4) oder ein geteilter, akkumulierter Single-Context (v5) — fuehrt zu besserer Code-Qualitaet, bei sonst identischem Phasen-Skript?"
factors:
  workflow: [v4-exact-subagents, v5-exact-single-context]
controls:
  model: opus-4-7-no-thinking
  kata_base: game-of-life
  prompt: example-mapping
outcomes:
  # primaer: Code-Qualitaet
  - code_mass
  - smell_total
  - cc_longest_function
  - cc_loc
  - mccabe_max
  - cognitive_max
  # sekundaer: Korrektheit
  - tests_passing
  - verification_pct
  - completed_within_budget
  # Kontext-Effizienz
  - total_tokens
  - duration_seconds
min_replicates: 10
status: aktiv
---

# RQ-6: Context-Engineering — Isolierte vs. geteilte Kontexte

Macht es einen Unterschied, ob die einzelnen TDD-Phasen (Test-Liste, Red, Green, Refactor) in **isolierten Subagent-Kontexten** ablaufen oder in **einem geteilten, akkumulierten Single-Context**?

## Motivation

v4-exact-subagents und v5-exact-single-context teilen sich **denselben Phasen-Skript-Inhalt** — gleiche Regeln, gleiche Prompts, gleiche Reihenfolge Test-Liste → Red → Green → Refactor. Der einzige systematische Unterschied liegt in der Kontext-Architektur:

| | v4-exact-subagents | v5-exact-single-context |
|---|---|---|
| Phase = | dedizierter Subagent (eigener Kontext, frischer System-Prompt) | Phase im selben Konversations-Kontext |
| Kontext-Uebergang | Subagent-Spawn, isoliert | nahtlos, gleiche History |
| Token-Profil | mehr (jeder Subagent liest Prompt-Inputs neu) | weniger (kumulativ pro Phase) — aber alle Phasen-Tokens summieren sich im einen Kontext |

Diese RQ extrahiert die Context-Engineering-Frage aus RQ-4 (wo sie als F-4.3 nur ein Befund unter fuenf war). Sie ist die einzige RQ im Lab, die *isolierter vs geteilter Kontext* als minimal varierten Faktor isoliert — beide Workflows nutzen denselben Phasen-Skript, dieselbe Kata, dasselbe Modell, denselben Prompt.

## Gegenlaeufige Hypothesen

**Pro isolierte Subagents (v4)**:
- Jeder Phasen-Schritt startet mit fokussiertem, ungestoertem Kontext.
- Keine Drift aus vorherigen Phasen, kein Akkumulieren von vergangener Diskussion.
- Haertere Phasen-Disziplin, weil der Green-Subagent keine "Erinnerung" an vorherige Helper-Funktionen hat und keine Versuchung, zu generalisieren.

**Pro Single-Context (v5)**:
- Komplette Lesbarkeit der bisherigen Konversation; keine Re-Establishment-Kosten.
- Spaetere Phasen koennen explizit auf frueheren Code referenzieren ("refactor the function we just wrote").
- Weniger Token-Overhead pro Phase, weil keine erneute Kontext-Einrichtung.

Die Wirkung der Kontext-Strukturierung auf Code-Qualitaet ist a priori unklar — beide Architekturen sind plausibel besser.

## Design

```
Faktor:    workflow   — 2 Stufen (v4-exact-subagents, v5-exact-single-context)
Kontrolle: model      — opus-4-7-no-thinking
Kontrolle: kata_base  — game-of-life
Kontrolle: prompt     — example-mapping

Zellen:    2
Replikate: n = 10 (uebernommen aus RQ-5; keine neuen Runs noetig)
Runs:      20 total
```

## Hypothesen

- **H1 (Code-Qualitaet)**: Isolierte Subagent-Kontexte (v4) produzieren niedrigere Komplexitaets-Metriken (`cognitive_max`, `mccabe_max`, `cc_longest_function`, `smell_total`) als der Single-Context (v5).
  Plausible Mechanik: ohne kumulierte History kann die Green-Phase nicht "vorausschauend abstrahieren" und liefert die minimal-noetige Implementation; ohne Refactor-Drift bleibt die Refactor-Phase fokussiert auf reine Strukturverbesserung.
- **H2 (Korrektheit)**: Beide Architekturen erreichen `tests_passing = 100 %` und `verification_pct = 100 %` (auf game-of-life). Korrektheit ist nicht der Engpass.
- **H3 (Token-Verbrauch)**: v4 verbraucht *weniger* Tokens als v5, weil isolierte Subagent-Kontexte zwar ueberlappen, aber jeder Subagent linear und kurz waechst — waehrend der v5-Single-Context die Tokens aller Phasen kumuliert.
- **H4 (Stabilitaet)**: Die Streuung der Code-Qualitaets-Metriken pro Zelle ist bei v4 systematisch niedriger als bei v5 (aus RQ-5 F-5.2 bereits vorgezeichnet). Falsifikation H4: v5-Streuung ≤ v4-Streuung.

**Falsifikation H1** (v5 ≤ v4 auf Komplexitaet): die Kontext-Trennung bringt keinen Code-Qualitaets-Vorteil — moeglicherweise schadet sie sogar, weil Refactor-Phase keine Kenntnis der Test-Historie hat.

**Falsifikation H3** (v4 ≥ v5 Tokens): die Subagent-Spawn-Overheads dominieren die durch Kontext-Akkumulation eingesparten Tokens.

## Caveats

- **(a) Single model**: Nur `opus-4-7-no-thinking`. Schwaechere Modelle koennten von Phase-Isolation staerker profitieren (kein Drift) oder weniger (Re-Establishment-Kosten dominieren).
- **(b) Single kata**: Nur Game of Life (Library-Form). Cross-Kata-Validierung mit `claim-office` (CLI-Kata) ist eine offene Erweiterung — wuerde das Muster auf einer komplexeren Aufgabe replizieren oder widerlegen.
- **(c) Identischer Phasen-Skript-Inhalt**: garantiert durch die Workflow-Definition (siehe `experiments/workflows/v4-exact-subagents/.claude/agents/` vs `experiments/workflows/v5-exact-single-context/.claude/commands/`). Beide Workflows nutzen dieselben Skill-Texte; nur der Aufruf-Mechanismus (Subagent-Spawn vs Skill-Invocation im gleichen Kontext) unterscheidet sich.
- **(d) Wiederverwendung der RQ-5-Daten**: Diese RQ aggregiert ueber die bestehenden 20 Runs aus dem Pool; keine eigenstaendige Datenakquise. Bei kuenftigen Wiederholungen bleibt dieselbe Selektor-Logik anwendbar.

## Findings

Siehe [findings.md](findings.md).

## Datenquelle

Alle Runs in `experiments/runs/` mit
`workflow ∈ {v4-exact-subagents, v5-exact-single-context}`,
`kata = game-of-life-example-mapping`,
`model = opus-4-7-no-thinking`.
