---
id: RQ-context
question: "Welche Form der Kontext-Strukturierung — isolierte Subagent-Kontexte pro TDD-Phase (v4.1), ein geteilter, akkumulierter Single-Context (v5.1), ein Hybrid mit Skill-basiertem Red/Green im Shared-Context und isoliertem Refactor-Subagent (v6.1) oder ein Hybrid mit isolierten Green- und Refactor-Subagents bei Shared-Context-Test-Liste/Red (v7.1) — fuehrt zu besserer Code-Qualitaet?"
factors:
  workflow: [v4.1-testlist-scope-fix, v5.1-testlist-scope-fix, v6.1-hybrid-testlist-scope-fix, v7.1-hybrid-green-refactor-testlist-scope-fix]
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

Macht es einen Unterschied, ob die einzelnen TDD-Phasen (Test-Liste, Red, Green, Refactor) in **isolierten Subagent-Kontexten** ablaufen, in **einem geteilten, akkumulierten Single-Context**, in einer **Hybrid-Form mit nur isoliertem Refactor** (v6.1) oder in einer **Hybrid-Form mit isoliertem Green und Refactor** (v7.1)?

## Motivation

v4.1-testlist-scope-fix und v5.1-testlist-scope-fix teilen sich **denselben Phasen-Skript-Inhalt** — gleiche Regeln, gleiche Prompts, gleiche Reihenfolge Test-Liste → Red → Green → Refactor. v6.1-hybrid-testlist-scope-fix nutzt **denselben Test-List-Scope-Fix**, aber eine dritte Kontext-Architektur: Red und Green laufen Skill-basiert im geteilten Konversations-Kontext (wie v5.1), während die Refactor-Phase als isolierter Subagent gespawnt wird (wie v4.1 für alle Phasen). v7.1-hybrid-green-refactor-testlist-scope-fix geht einen Schritt weiter und isoliert **zusaetzlich die Green-Phase** als Subagent — nur Test-Liste und Red bleiben Skills im Shared-Context. v6.1 und v7.1 sind damit nicht zeichengenau aus den `.1`-Varianten abgeleitet — siehe Caveat (c).

| | v4.1-testlist-scope-fix | v5.1-testlist-scope-fix | v6.1-hybrid-testlist-scope-fix | v7.1-hybrid-green-refactor-testlist-scope-fix |
|---|---|---|---|---|
| Test-Liste | dedizierter Subagent | Skill im Single-Context | Skill im Single-Context | Skill im Single-Context |
| Red        | dedizierter Subagent | Skill im Single-Context | Skill im Single-Context | Skill im Single-Context |
| Green      | dedizierter Subagent | Skill im Single-Context | Skill im Single-Context | **dedizierter Subagent** |
| Refactor   | dedizierter Subagent | Skill im Single-Context | **dedizierter Subagent** | **dedizierter Subagent** |
| Token-Profil | mehr (jeder Subagent liest Prompt-Inputs neu) | weniger pro Phase, aber kumulativ im einen Kontext | Mischform — Red/Green im Single-Context plus separater Refactor-Kontext | Mischform — Test-Liste/Red im Single-Context plus separate Green- und Refactor-Kontexte |

Diese RQ extrahiert die Context-Engineering-Frage aus RQ-tdd-quality (wo sie als F-tdd-quality.3 nur ein Befund unter fuenf war) und erweitert sie um zwei Hybrid-Punkte: v6.1 isoliert nur die Refactor-Phase, v7.1 isoliert zusaetzlich die Green-Phase. Damit laesst sich ein Architektur-Gradient pruefen — von voller Phasen-Isolation (v4.1) ueber teil-isoliert mit zwei Subagent-Phasen (v7.1) bzw. einer Subagent-Phase (v6.1) bis voll geteilt (v5.1). Die `.1`-Varianten wurden gezielt so abgeleitet, dass ihr Phasen-Skript-Inhalt zeichengenau uebereinstimmt; v6.1 und v7.1 sind eigenständige Hybride mit derselben Test-Listen-Disziplin, aber anderer Phasen-Aufruf-Struktur.

## Gegenlaeufige Hypothesen

**Pro isolierte Subagents (v4.1)**:
- Jeder Phasen-Schritt startet mit fokussiertem, ungestoertem Kontext.
- Keine Drift aus vorherigen Phasen, kein Akkumulieren von vergangener Diskussion.
- Haertere Phasen-Disziplin, weil der Green-Subagent keine "Erinnerung" an vorherige Helper-Funktionen hat und keine Versuchung, zu generalisieren.

**Pro Single-Context (v5.1)**:
- Komplette Lesbarkeit der bisherigen Konversation; keine Re-Establishment-Kosten.
- Spaetere Phasen koennen explizit auf frueheren Code referenzieren ("refactor the function we just wrote").
- Weniger Token-Overhead pro Phase, weil keine erneute Kontext-Einrichtung.

**Pro Hybrid v6.1 (nur Refactor isoliert)**:
- Red/Green im Single-Context profitieren von kumulierter Test-/Implementations-Historie (wie v5.1).
- Die kostenintensive Refactor-Phase isoliert im Subagent — frischer Kontext erzwingt explizite Strukturanalyse statt opportunistischem Lokal-Aufraeumen.
- Sollte den Komplexitaets-Vorteil von v4.1 mit dem Stabilitaets- und Geschwindigkeits-Profil von v5.1 verbinden — *falls* der Architektur-Effekt aus F-tdd-quality.1 wirklich vom Refactor-Subagent kommt und nicht von der vollstaendigen Phasen-Isolation.

**Pro Hybrid v7.1 (Green und Refactor isoliert)**:
- Test-Liste/Red im Single-Context fuehren die Spec-Anker und die juengste Test-Diskussion am Stueck (wie v5.1).
- Der Green-Subagent sieht *nur* den Roten Test und die Aufgabe "make it pass" — ohne Akkumulation aus Test-Listen-Brainstorming oder vorherigen Cycle-Diskussionen, also haerter auf Minimal-Loesung getrimmt (wie in v4.1).
- Der Refactor-Subagent erbt zusaetzlich den Kontext-Reset-Vorteil aus v6.1.
- Sollte den Komplexitaets-Vorteil von v4.1 noch staerker treffen als v6.1, *falls* die Green-Drift im Single-Context ein eigenstaendiger Treiber von Code-Mass/Komplexitaet ist und nicht nur der Refactor.

Die Wirkung der Kontext-Strukturierung auf Code-Qualitaet ist a priori unklar — alle vier Architekturen sind plausibel besser.

## Design

```
Faktor:    workflow   — 4 Stufen (v4.1-testlist-scope-fix, v5.1-testlist-scope-fix,
                                  v6.1-hybrid-testlist-scope-fix,
                                  v7.1-hybrid-green-refactor-testlist-scope-fix)
Kontrolle: model      — opus-4-7-no-thinking (Portkey ODER Direct, OR-match, siehe Caveat a)
Kontrolle: kata_base  — claim-office
Kontrolle: prompt     — example-mapping

Zellen:    4 (4 Workflows x 1 Kata)
Replikate: n = 3
Runs:      12 total — vollstaendig neu zu erheben (v5.1 und v7.1 sind neu;
           die alten v4-/v5-/v6-/v7-Runs sind nicht uebertragbar, da sie den
           test-list-scope-fix bzw. die Skript-Vereinheitlichung nicht haben)
```

## Hypothesen

- **H1 (Code-Qualitaet)**: Isolierte Subagent-Kontexte (v4.1) produzieren niedrigere Komplexitaets-Metriken (`cognitive_max`, `mccabe_max`, `cc_longest_function`, `smell_total`) als der Single-Context (v5.1). v6.1 liegt dazwischen, naeher an v4.1 — weil die kostenintensive Refactor-Phase isoliert laeuft und damit den Hauptmechanismus von v4.1 erbt. v7.1 liegt noch naeher an v4.1 als v6.1, weil zusaetzlich der Green-Drift-Mechanismus wirkt.
  Plausible Mechanik: ohne kumulierte History kann die Green-Phase nicht "vorausschauend abstrahieren" und liefert die minimal-noetige Implementation; ohne Refactor-Drift bleibt die Refactor-Phase fokussiert auf reine Strukturverbesserung. Bei v6.1 wirkt nur der zweite, bei v7.1 beide Mechanismen.
- **H2 (Korrektheit)**: Alle vier Architekturen erreichen aehnliche `tests_passing` und `verification_pct` auf claim-office. Korrektheit ist nicht der primaere Engpass — der Kontext-Architektur-Effekt zeigt sich (falls vorhanden) in Code-Qualitaet und Kosten, nicht in der Aussen-Korrektheit. Falsifikation: eine Architektur trifft systematisch weniger Acceptance-Szenarien.
- **H3 (Token-Verbrauch)**: v4.1 verbraucht *weniger* Tokens als v5.1, weil isolierte Subagent-Kontexte zwar ueberlappen, aber jeder Subagent linear und kurz waechst — waehrend der v5.1-Single-Context die Tokens aller Phasen kumuliert. v6.1 bezahlt fuer den Refactor-Subagent zusaetzlich zum kumulierten Single-Context und liegt damit token-maessig ueber v5.1. v7.1 bezahlt zwei Subagent-Phasen (Green + Refactor) zusaetzlich zum Single-Context und liegt erwartungsgemaess noch ueber v6.1.
- **H4 (Stabilitaet)**: Die Streuung der Code-Qualitaets-Metriken pro Zelle ist bei v4.1 systematisch niedriger als bei v5.1 (aus RQ-stability F-stability.2 bereits vorgezeichnet). v6.1 und v7.1 sollten stabilitaets-maessig zwischen v4.1 und v5.1 liegen, v7.1 naeher an v4.1. Falsifikation H4: v5.1-Streuung ≤ v4.1-Streuung.
  **Vorbehalt (n=3)**: Bei der aktuellen Replikatzahl ist die Streuungs-Schaetzung pro Zelle statistisch schwach — H4 kann mit n=3 nur als Tendenz gepruft, nicht belastbar bestaetigt werden. Fuer eine tragfaehige Stabilitaets-Aussage muessen die Replikate spaeter erhoeht werden.
- **H5 (Wallclock)**: v4.1 ist **deutlich langsamer** als v5.1 in Wallclock-Zeit. Plausible Mechanik: jeder Subagent-Spawn pro TDD-Phase kostet eine Einrichtungs-Latenz (Modell-Warmup, Re-Read der Phasen-Definitionen aus den Agent-Files), die ueber die TDD-Zyklen pro Run und 4 Phasen je Zyklus aufsummiert wird; v5.1 zahlt diesen Overhead nur einmal pro Run. Erwartung: v4.1-Wallclock ≥ 2× v5.1-Wallclock auf claim-office. v6.1 zahlt den Spawn-Overhead einmal pro Cycle (Refactor), v7.1 zweimal pro Cycle (Green + Refactor); beide sollten zwischen v5.1 und v4.1 liegen, v7.1 naeher an v4.1.

**Falsifikation H1** (v5.1 ≤ v4.1 auf Komplexitaet, oder v6.1/v7.1 weit ueber v4.1): die Kontext-Trennung bzw. die Refactor-/Green-Isolation bringt keinen Code-Qualitaets-Vorteil — moeglicherweise schadet sie sogar, weil isolierte Subagents keine Kenntnis der Test-Historie haben.

**Falsifikation H3** (v4.1 ≥ v5.1 Tokens, oder v6.1/v7.1 ≤ v5.1): die Subagent-Spawn-Overheads dominieren die durch Kontext-Akkumulation eingesparten Tokens; bzw. die isolierten Subagents sind nicht die dominanten Token-Treiber.

**Falsifikation H5** (v4.1 ≤ v5.1 Wallclock): Subagent-Spawn-Overhead ist vernachlaessigbar gegenueber kumulierten Token-Verarbeitungs-Kosten im Single-Context.

## Caveats

- **(a) Single model, Routing gemischt**: Nur `opus-4-7-no-thinking`, aber `controls.model` ist eine ODER-Liste `[opus-4-7-portkey-no-thinking, opus-4-7-no-thinking]`. Neue Fill-Runs gehen ueber Portkey (Prio 1), bestehende Direct-Runs werden weiterverwendet; beide Routen zaehlen als eine Zelle. Annahme: Routing hat keinen Effekt auf Code-Qualitaet; auf `duration_seconds` (H5) ggf. schon (Portkey-Retry/Timeout-Charakteristik) — bei der Wallclock-Auswertung beachten, ggf. nach `model` statt `cell_model` gruppieren. Schwaechere Modelle koennten zudem von Phase-Isolation staerker profitieren (kein Drift) oder weniger (Re-Establishment-Kosten dominieren).
- **(b) Single kata**: Nur claim-office (CLI-Kata, novel) — gewaehlt, weil Context-Engineering auf einer Aufgabe geprueft werden soll, die das Modell nicht auswendig kann und bei der Korrektheit nicht selbstverstaendlich ist. game-of-life (Library-Form) und mars-rover bleiben als Cross-Kata-Replikation offen.
- **(c) Identischer Phasen-Skript-Inhalt nur fuer v4.1 ↔ v5.1**: garantiert durch die Workflow-Definition (siehe `experiments/workflows/v4.1-testlist-scope-fix/.claude/agents/` vs `experiments/workflows/v5.1-testlist-scope-fix/.claude/commands/`). Die `.1`-Varianten wurden gezielt so abgeleitet, dass die Phasen-Skript-Texte (Test-Liste, Red, Green, Refactor inkl. test-list-scope-fix) inhaltlich uebereinstimmen; der einzige Unterschied ist der Aufruf-Mechanismus — Subagent-Spawn (isolierter Kontext) bei v4.1 vs. Skill-Invocation im selben Kontext bei v5.1. v6.1 und v7.1 sind hingegen **keine zeichengenauen Derivate**: beide teilen den test-list-scope-fix und nutzen Test-Liste/Red als Skills im Single-Context (wie v5.1); v6.1 spawnt zusaetzlich den Refactor als Subagent, v7.1 spawnt Green und Refactor als Subagents (jeweils wie v4.1 fuer diese Phasen). Konsequenz: der v4.1↔v5.1-Vergleich isoliert den reinen Architektur-Effekt, die v6.1- und v7.1-Vergleiche vermischen Architektur- und (geringe) Skript-Unterschiede in den Subagent-Spezifikationen. Bei v4.1, v6.1 und v7.1 erhalten die Subagents ihren Kontext explizit per Prompt-Block (`tdd-experiment-mode.md`), bei v5.1 entfaellt das, weil der Kontext geteilt wird.
- **(d) Vollstaendig neue Datenerhebung**: Diese RQ erhebt alle Runs neu. Die alten v4-/v5-/v6-/v7-Runs sind nicht uebertragbar, weil v5.1 und v7.1 neue Workflows sind und alle vier Varianten den test-list-scope-fix bzw. die Skript-Vereinheitlichung tragen, die die alten Runs nicht hatten.

## Findings

Siehe [findings.md](findings.md).

## Datenquelle

Alle Runs in `experiments/runs/` mit
`workflow ∈ {v4.1-testlist-scope-fix, v5.1-testlist-scope-fix, v6.1-hybrid-testlist-scope-fix, v7.1-hybrid-green-refactor-testlist-scope-fix}`,
`kata = claim-office-example-mapping`,
`model ∈ {opus-4-7-portkey-no-thinking, opus-4-7-no-thinking}` (ODER-Match, siehe Caveat a).
