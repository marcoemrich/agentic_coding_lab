---
id: RQ-context
question: "Welche Form der Kontext-Strukturierung — isolierte Subagent-Kontexte pro TDD-Phase (v4.1) oder ein geteilter, akkumulierter Single-Context (v5.1) — fuehrt zu besserer Code-Qualitaet, bei sonst identischem Phasen-Skript?"
factors:
  workflow: [v4.1-testlist-scope-fix, v5.1-testlist-scope-fix]
  kata_base: claim-office
controls:
  model:
    any:                            # OR-match: neue Runs via Portkey (Prio 1), bestehende Direct-Runs wiederverwenden
      - opus-4-7-portkey-no-thinking
      - opus-4-7-no-thinking
  prompt: example-mapping
outcomes:
  # primaer: Code-Qualitaet
  - code_mass
  - smell_total
  - cc_longest_function
  - cc_loc
  - mccabe_max
  - cognitive_max
  # sekundaer: Korrektheit (innen + aussen + Test-Staerke)
  - tests_passing
  - verification_pct
  - completed_within_budget
  - mutation_score
  # Kontext-Effizienz
  - total_tokens
  - duration_seconds
min_replicates: 3
status: aktiv
---

# RQ-context: Context-Engineering — Isolierte vs. geteilte Kontexte

Macht es einen Unterschied, ob die einzelnen TDD-Phasen (Test-Liste, Red, Green, Refactor) in **isolierten Subagent-Kontexten** ablaufen oder in **einem geteilten, akkumulierten Single-Context**?

## Motivation

v4.1-testlist-scope-fix und v5.1-testlist-scope-fix teilen sich **denselben Phasen-Skript-Inhalt** — gleiche Regeln, gleiche Prompts, gleiche Reihenfolge Test-Liste → Red → Green → Refactor. Der einzige systematische Unterschied liegt in der Kontext-Architektur:

| | v4.1-testlist-scope-fix | v5.1-testlist-scope-fix |
|---|---|---|
| Phase = | dedizierter Subagent (eigener Kontext, frischer System-Prompt) | Phase im selben Konversations-Kontext |
| Kontext-Uebergang | Subagent-Spawn, isoliert | nahtlos, gleiche History |
| Token-Profil | mehr (jeder Subagent liest Prompt-Inputs neu) | weniger (kumulativ pro Phase) — aber alle Phasen-Tokens summieren sich im einen Kontext |

Diese RQ extrahiert die Context-Engineering-Frage aus RQ-tdd-quality (wo sie als F-tdd-quality.3 nur ein Befund unter fuenf war). Sie ist die einzige RQ im Lab, die *isolierter vs geteilter Kontext* als minimal varierten Faktor isoliert — beide Workflows nutzen denselben Phasen-Skript, dieselbe Kata, dasselbe Modell, denselben Prompt. Die `.1`-Varianten wurden gezielt so abgeleitet, dass ihr Phasen-Skript-Inhalt zeichengenau uebereinstimmt und sich *nur* im Aufruf-Mechanismus (Subagent-Spawn vs. Skill-Invocation im selben Kontext) unterscheidet — siehe Caveat (c).

## Gegenlaeufige Hypothesen

**Pro isolierte Subagents (v4.1)**:
- Jeder Phasen-Schritt startet mit fokussiertem, ungestoertem Kontext.
- Keine Drift aus vorherigen Phasen, kein Akkumulieren von vergangener Diskussion.
- Haertere Phasen-Disziplin, weil der Green-Subagent keine "Erinnerung" an vorherige Helper-Funktionen hat und keine Versuchung, zu generalisieren.

**Pro Single-Context (v5.1)**:
- Komplette Lesbarkeit der bisherigen Konversation; keine Re-Establishment-Kosten.
- Spaetere Phasen koennen explizit auf frueheren Code referenzieren ("refactor the function we just wrote").
- Weniger Token-Overhead pro Phase, weil keine erneute Kontext-Einrichtung.

Die Wirkung der Kontext-Strukturierung auf Code-Qualitaet ist a priori unklar — beide Architekturen sind plausibel besser.

## Design

```
Faktor:    workflow   — 2 Stufen (v4.1-testlist-scope-fix, v5.1-testlist-scope-fix)
Kontrolle: model      — opus-4-7-no-thinking (Portkey ODER Direct, OR-match, siehe Caveat a)
Kontrolle: kata_base  — claim-office
Kontrolle: prompt     — example-mapping

Zellen:    2 (2 Workflows x 1 Kata)
Replikate: n = 3
Runs:      6 total — vollstaendig neu zu erheben (v5.1 ist neu;
           die alten v4-/v5-Runs sind nicht uebertragbar, da sie den
           test-list-scope-fix bzw. die Skript-Vereinheitlichung nicht haben)
```

## Hypothesen

- **H1 (Code-Qualitaet)**: Isolierte Subagent-Kontexte (v4.1) produzieren niedrigere Komplexitaets-Metriken (`cognitive_max`, `mccabe_max`, `cc_longest_function`, `smell_total`) als der Single-Context (v5.1).
  Plausible Mechanik: ohne kumulierte History kann die Green-Phase nicht "vorausschauend abstrahieren" und liefert die minimal-noetige Implementation; ohne Refactor-Drift bleibt die Refactor-Phase fokussiert auf reine Strukturverbesserung.
- **H2 (Korrektheit)**: Beide Architekturen erreichen aehnliche `tests_passing` und `verification_pct` auf claim-office. Korrektheit ist nicht der primaere Engpass — der Kontext-Architektur-Effekt zeigt sich (falls vorhanden) in Code-Qualitaet und Kosten, nicht in der Aussen-Korrektheit. Falsifikation: eine Architektur trifft systematisch weniger Acceptance-Szenarien.
- **H3 (Token-Verbrauch)**: v4.1 verbraucht *weniger* Tokens als v5.1, weil isolierte Subagent-Kontexte zwar ueberlappen, aber jeder Subagent linear und kurz waechst — waehrend der v5.1-Single-Context die Tokens aller Phasen kumuliert.
- **H4 (Stabilitaet)**: Die Streuung der Code-Qualitaets-Metriken pro Zelle ist bei v4.1 systematisch niedriger als bei v5.1 (aus RQ-stability F-stability.2 bereits vorgezeichnet). Falsifikation H4: v5.1-Streuung ≤ v4.1-Streuung.
  **Vorbehalt (n=3)**: Bei der aktuellen Replikatzahl ist die Streuungs-Schaetzung pro Zelle statistisch schwach — H4 kann mit n=3 nur als Tendenz gepruft, nicht belastbar bestaetigt werden. Fuer eine tragfaehige Stabilitaets-Aussage muessen die Replikate spaeter erhoeht werden.
- **H5 (Wallclock)**: v4.1 ist **deutlich langsamer** als v5.1 in Wallclock-Zeit. Plausible Mechanik: jeder Subagent-Spawn pro TDD-Phase kostet eine Einrichtungs-Latenz (Modell-Warmup, Re-Read der Phasen-Definitionen aus den Agent-Files), die ueber die TDD-Zyklen pro Run und 4 Phasen je Zyklus aufsummiert wird; v5.1 zahlt diesen Overhead nur einmal pro Run. Erwartung: v4.1-Wallclock ≥ 2× v5.1-Wallclock auf claim-office.

**Falsifikation H1** (v5.1 ≤ v4.1 auf Komplexitaet): die Kontext-Trennung bringt keinen Code-Qualitaets-Vorteil — moeglicherweise schadet sie sogar, weil Refactor-Phase keine Kenntnis der Test-Historie hat.

**Falsifikation H3** (v4.1 ≥ v5.1 Tokens): die Subagent-Spawn-Overheads dominieren die durch Kontext-Akkumulation eingesparten Tokens.

**Falsifikation H5** (v4.1 ≤ v5.1 Wallclock): Subagent-Spawn-Overhead ist vernachlaessigbar gegenueber kumulierten Token-Verarbeitungs-Kosten im Single-Context.

## Caveats

- **(a) Single model, Routing gemischt**: Nur `opus-4-7-no-thinking`, aber `controls.model` ist eine ODER-Liste `[opus-4-7-portkey-no-thinking, opus-4-7-no-thinking]`. Neue Fill-Runs gehen ueber Portkey (Prio 1), bestehende Direct-Runs werden weiterverwendet; beide Routen zaehlen als eine Zelle. Annahme: Routing hat keinen Effekt auf Code-Qualitaet; auf `duration_seconds` (H5) ggf. schon (Portkey-Retry/Timeout-Charakteristik) — bei der Wallclock-Auswertung beachten, ggf. nach `model` statt `cell_model` gruppieren. Schwaechere Modelle koennten zudem von Phase-Isolation staerker profitieren (kein Drift) oder weniger (Re-Establishment-Kosten dominieren).
- **(b) Single kata**: Nur claim-office (CLI-Kata, novel) — gewaehlt, weil Context-Engineering auf einer Aufgabe geprueft werden soll, die das Modell nicht auswendig kann und bei der Korrektheit nicht selbstverstaendlich ist. game-of-life (Library-Form) und mars-rover bleiben als Cross-Kata-Replikation offen.
- **(c) Identischer Phasen-Skript-Inhalt**: garantiert durch die Workflow-Definition (siehe `experiments/workflows/v4.1-testlist-scope-fix/.claude/agents/` vs `experiments/workflows/v5.1-testlist-scope-fix/.claude/commands/`). Die `.1`-Varianten wurden gezielt so abgeleitet, dass die Phasen-Skript-Texte (Test-Liste, Red, Green, Refactor inkl. test-list-scope-fix) inhaltlich uebereinstimmen; der einzige Unterschied ist der Aufruf-Mechanismus — Subagent-Spawn (isolierter Kontext) bei v4.1 vs. Skill-Invocation im selben Kontext bei v5.1. Architektur-bedingt bleibt: bei v4.1 erhalten die Subagents ihren Kontext explizit per Prompt-Block (`tdd-experiment-mode.md`), bei v5.1 entfaellt das, weil der Kontext geteilt wird.
- **(d) Vollstaendig neue Datenerhebung**: Diese RQ erhebt alle Runs neu. Die alten v4-/v5-Runs sind nicht uebertragbar, weil v5.1 ein neuer Workflow ist und beide `.1`-Varianten den test-list-scope-fix bzw. die Skript-Vereinheitlichung tragen, die die alten Runs nicht hatten.

## Findings

Siehe [findings.md](findings.md).

## Datenquelle

Alle Runs in `experiments/runs/` mit
`workflow ∈ {v4.1-testlist-scope-fix, v5.1-testlist-scope-fix}`,
`kata = claim-office-example-mapping`,
`model ∈ {opus-4-7-portkey-no-thinking, opus-4-7-no-thinking}` (ODER-Match, siehe Caveat a).
