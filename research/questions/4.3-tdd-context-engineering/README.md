---
id: RQ-context
question: "Welche Form der Kontext-Strukturierung — isolierte Subagent-Kontexte pro TDD-Phase (v4.1), ein geteilter, akkumulierter Single-Context (v5.1) oder ein Hybrid mit Skill-basiertem Red/Green im Shared-Context und isoliertem Refactor-Subagent (v6.1) — fuehrt zu besserer Code-Qualitaet?"
factors:
  workflow: [v4.1-testlist-scope-fix, v5.1-testlist-scope-fix, v6.1-hybrid-testlist-scope-fix]
controls:
  kata_base: claim-office
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

# RQ-context: Context-Engineering — Isolierte, geteilte und hybride Kontexte

Macht es einen Unterschied, ob die einzelnen TDD-Phasen (Test-Liste, Red, Green, Refactor) in **isolierten Subagent-Kontexten** ablaufen, in **einem geteilten, akkumulierten Single-Context** oder in einer **Hybrid-Form** (Skill-basiertes Red/Green im Shared-Context plus isolierter Refactor-Subagent)?

## Motivation

v4.1-testlist-scope-fix und v5.1-testlist-scope-fix teilen sich **denselben Phasen-Skript-Inhalt** — gleiche Regeln, gleiche Prompts, gleiche Reihenfolge Test-Liste → Red → Green → Refactor. v6.1-hybrid-testlist-scope-fix nutzt **denselben Test-List-Scope-Fix**, aber eine dritte Kontext-Architektur: Red und Green laufen Skill-basiert im geteilten Konversations-Kontext (wie v5.1), während die Refactor-Phase als isolierter Subagent gespawnt wird (wie v4.1 für alle Phasen). v6.1 ist damit nicht zeichengenau aus den `.1`-Varianten abgeleitet — siehe Caveat (c).

| | v4.1-testlist-scope-fix | v5.1-testlist-scope-fix | v6.1-hybrid-testlist-scope-fix |
|---|---|---|---|
| Test-Liste | dedizierter Subagent | Skill im Single-Context | Skill im Single-Context |
| Red        | dedizierter Subagent | Skill im Single-Context | Skill im Single-Context |
| Green      | dedizierter Subagent | Skill im Single-Context | Skill im Single-Context |
| Refactor   | dedizierter Subagent | Skill im Single-Context | **dedizierter Subagent** |
| Token-Profil | mehr (jeder Subagent liest Prompt-Inputs neu) | weniger pro Phase, aber kumulativ im einen Kontext | Mischform — Red/Green im Single-Context plus separater Refactor-Kontext |

Diese RQ extrahiert die Context-Engineering-Frage aus RQ-tdd-quality (wo sie als F-tdd-quality.3 nur ein Befund unter fuenf war) und erweitert sie um den Hybrid-Punkt v6.1, der gezielt die Refactor-Phase isoliert (jene Phase, in der die Architektur-Architektur-Wirkung in F-tdd-quality.1 und F-context.1 am sichtbarsten ist). Die `.1`-Varianten wurden gezielt so abgeleitet, dass ihr Phasen-Skript-Inhalt zeichengenau uebereinstimmt; v6.1 ist ein eigenständiger Hybrid mit derselben Test-Listen-Disziplin, aber anderer Phasen-Aufruf-Struktur.

## Gegenlaeufige Hypothesen

**Pro isolierte Subagents (v4.1)**:
- Jeder Phasen-Schritt startet mit fokussiertem, ungestoertem Kontext.
- Keine Drift aus vorherigen Phasen, kein Akkumulieren von vergangener Diskussion.
- Haertere Phasen-Disziplin, weil der Green-Subagent keine "Erinnerung" an vorherige Helper-Funktionen hat und keine Versuchung, zu generalisieren.

**Pro Single-Context (v5.1)**:
- Komplette Lesbarkeit der bisherigen Konversation; keine Re-Establishment-Kosten.
- Spaetere Phasen koennen explizit auf frueheren Code referenzieren ("refactor the function we just wrote").
- Weniger Token-Overhead pro Phase, weil keine erneute Kontext-Einrichtung.

**Pro Hybrid (v6.1)**:
- Red/Green im Single-Context profitieren von kumulierter Test-/Implementations-Historie (wie v5.1).
- Die kostenintensive Refactor-Phase isoliert im Subagent — frischer Kontext erzwingt explizite Strukturanalyse statt opportunistischem Lokal-Aufraeumen.
- Sollte den Komplexitaets-Vorteil von v4.1 mit dem Stabilitaets- und Geschwindigkeits-Profil von v5.1 verbinden — *falls* der Architektur-Effekt aus F-tdd-quality.1 wirklich vom Refactor-Subagent kommt und nicht von der vollstaendigen Phasen-Isolation.

Die Wirkung der Kontext-Strukturierung auf Code-Qualitaet ist a priori unklar — alle drei Architekturen sind plausibel besser.

## Design

```
Faktor:    workflow   — 3 Stufen (v4.1-testlist-scope-fix, v5.1-testlist-scope-fix,
                                  v6.1-hybrid-testlist-scope-fix)
Kontrolle: model      — opus-4-7-no-thinking (Portkey ODER Direct, OR-match, siehe Caveat a)
Kontrolle: kata_base  — claim-office
Kontrolle: prompt     — example-mapping

Zellen:    3 (3 Workflows x 1 Kata)
Replikate: n = 3
Runs:      9 total — vollstaendig neu zu erheben (v5.1 ist neu;
           die alten v4-/v5-/v6-Runs sind nicht uebertragbar, da sie den
           test-list-scope-fix bzw. die Skript-Vereinheitlichung nicht haben)
```

## Hypothesen

- **H1 (Code-Qualitaet)**: Isolierte Subagent-Kontexte (v4.1) produzieren niedrigere Komplexitaets-Metriken (`cognitive_max`, `mccabe_max`, `cc_longest_function`, `smell_total`) als der Single-Context (v5.1). v6.1 liegt dazwischen, naeher an v4.1 — weil die kostenintensive Refactor-Phase isoliert laeuft und damit den Hauptmechanismus von v4.1 erbt.
  Plausible Mechanik: ohne kumulierte History kann die Green-Phase nicht "vorausschauend abstrahieren" und liefert die minimal-noetige Implementation; ohne Refactor-Drift bleibt die Refactor-Phase fokussiert auf reine Strukturverbesserung. Bei v6.1 wirkt nur der zweite Mechanismus.
- **H2 (Korrektheit)**: Alle drei Architekturen erreichen aehnliche `tests_passing` und `verification_pct` auf claim-office. Korrektheit ist nicht der primaere Engpass — der Kontext-Architektur-Effekt zeigt sich (falls vorhanden) in Code-Qualitaet und Kosten, nicht in der Aussen-Korrektheit. Falsifikation: eine Architektur trifft systematisch weniger Acceptance-Szenarien.
- **H3 (Token-Verbrauch)**: v4.1 verbraucht *weniger* Tokens als v5.1, weil isolierte Subagent-Kontexte zwar ueberlappen, aber jeder Subagent linear und kurz waechst — waehrend der v5.1-Single-Context die Tokens aller Phasen kumuliert. v6.1 bezahlt fuer den Refactor-Subagent zusaetzlich zum kumulierten Single-Context und liegt damit token-maessig ueber v5.1.
- **H4 (Stabilitaet)**: Die Streuung der Code-Qualitaets-Metriken pro Zelle ist bei v4.1 systematisch niedriger als bei v5.1 (aus RQ-stability F-stability.2 bereits vorgezeichnet). v6.1 sollte stabilitaets-maessig zwischen v4.1 und v5.1 liegen. Falsifikation H4: v5.1-Streuung ≤ v4.1-Streuung.
  **Vorbehalt (n=3)**: Bei der aktuellen Replikatzahl ist die Streuungs-Schaetzung pro Zelle statistisch schwach — H4 kann mit n=3 nur als Tendenz gepruft, nicht belastbar bestaetigt werden. Fuer eine tragfaehige Stabilitaets-Aussage muessen die Replikate spaeter erhoeht werden.
- **H5 (Wallclock)**: v4.1 ist **deutlich langsamer** als v5.1 in Wallclock-Zeit. Plausible Mechanik: jeder Subagent-Spawn pro TDD-Phase kostet eine Einrichtungs-Latenz (Modell-Warmup, Re-Read der Phasen-Definitionen aus den Agent-Files), die ueber die TDD-Zyklen pro Run und 4 Phasen je Zyklus aufsummiert wird; v5.1 zahlt diesen Overhead nur einmal pro Run. Erwartung: v4.1-Wallclock ≥ 2× v5.1-Wallclock auf claim-office. v6.1 zahlt den Spawn-Overhead nur einmal pro Cycle (Refactor) und sollte zwischen v5.1 und v4.1 liegen.

**Falsifikation H1** (v5.1 ≤ v4.1 auf Komplexitaet, oder v6.1 weit ueber v4.1): die Kontext-Trennung bzw. die Refactor-Isolation bringt keinen Code-Qualitaets-Vorteil — moeglicherweise schadet sie sogar, weil Refactor-Phase keine Kenntnis der Test-Historie hat.

**Falsifikation H3** (v4.1 ≥ v5.1 Tokens, oder v6.1 ≤ v5.1): die Subagent-Spawn-Overheads dominieren die durch Kontext-Akkumulation eingesparten Tokens; bzw. der Refactor-Subagent ist nicht der dominante Token-Treiber.

**Falsifikation H5** (v4.1 ≤ v5.1 Wallclock): Subagent-Spawn-Overhead ist vernachlaessigbar gegenueber kumulierten Token-Verarbeitungs-Kosten im Single-Context.

## Caveats

- **(a) Single model, Routing gemischt**: Nur `opus-4-7-no-thinking`, aber `controls.model` ist eine ODER-Liste `[opus-4-7-portkey-no-thinking, opus-4-7-no-thinking]`. Neue Fill-Runs gehen ueber Portkey (Prio 1), bestehende Direct-Runs werden weiterverwendet; beide Routen zaehlen als eine Zelle. Annahme: Routing hat keinen Effekt auf Code-Qualitaet; auf `duration_seconds` (H5) ggf. schon (Portkey-Retry/Timeout-Charakteristik) — bei der Wallclock-Auswertung beachten, ggf. nach `model` statt `cell_model` gruppieren. Schwaechere Modelle koennten zudem von Phase-Isolation staerker profitieren (kein Drift) oder weniger (Re-Establishment-Kosten dominieren).
- **(b) Single kata**: Nur claim-office (CLI-Kata, novel) — gewaehlt, weil Context-Engineering auf einer Aufgabe geprueft werden soll, die das Modell nicht auswendig kann und bei der Korrektheit nicht selbstverstaendlich ist. game-of-life (Library-Form) und mars-rover bleiben als Cross-Kata-Replikation offen.
- **(c) Identischer Phasen-Skript-Inhalt nur fuer v4.1 ↔ v5.1**: garantiert durch die Workflow-Definition (siehe `experiments/workflows/v4.1-testlist-scope-fix/.claude/agents/` vs `experiments/workflows/v5.1-testlist-scope-fix/.claude/commands/`). Die `.1`-Varianten wurden gezielt so abgeleitet, dass die Phasen-Skript-Texte (Test-Liste, Red, Green, Refactor inkl. test-list-scope-fix) inhaltlich uebereinstimmen; der einzige Unterschied ist der Aufruf-Mechanismus — Subagent-Spawn (isolierter Kontext) bei v4.1 vs. Skill-Invocation im selben Kontext bei v5.1. v6.1 hingegen ist **kein zeichengenaues Derivat**: es teilt den test-list-scope-fix und nutzt Red/Green als Skills im Single-Context (wie v5.1), spawnt aber den Refactor als Subagent (wie v4.1 fuer alle Phasen). Konsequenz: der v4.1↔v5.1-Vergleich isoliert den reinen Architektur-Effekt, der v6.1-Vergleich vermischt Architektur- und (geringe) Skript-Unterschiede in der Refactor-Spezifikation. Bei v4.1 und v6.1 erhalten die Refactor-Subagents ihren Kontext explizit per Prompt-Block (`tdd-experiment-mode.md`), bei v5.1 entfaellt das, weil der Kontext geteilt wird.
- **(d) Vollstaendig neue Datenerhebung**: Diese RQ erhebt alle Runs neu. Die alten v4-/v5-/v6-Runs sind nicht uebertragbar, weil v5.1 ein neuer Workflow ist und alle drei Varianten den test-list-scope-fix bzw. die Skript-Vereinheitlichung tragen, die die alten Runs nicht hatten.

## Findings

Siehe [findings.md](findings.md).

## Datenquelle

Alle Runs in `experiments/runs/` mit
`workflow ∈ {v4.1-testlist-scope-fix, v5.1-testlist-scope-fix, v6.1-hybrid-testlist-scope-fix}`,
`kata = claim-office-example-mapping`,
`model ∈ {opus-4-7-portkey-no-thinking, opus-4-7-no-thinking}` (ODER-Match, siehe Caveat a).
