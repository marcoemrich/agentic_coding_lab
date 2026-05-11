---
id: RQ-7
question: "Wirkt sich dedizierte Subagents-pro-Phase (v4) gegenüber Single-Context (v5) auf Code-Qualität und TDD-Disziplin aus, bei sonst identischem Phasen-Skript?"
factors:
  workflow: [v4-exact-subagents, v5-exact-single-context]
  kata_base: [claim-office, game-of-life]
controls:
  prompt: example-mapping
  model: opus-4-7-no-thinking
outcomes:
  - tests_passing
  - verification_pct
  - verification_passed
  - verification_total
  - cc_loc
  - code_mass
  - cc_avg_loc_per_function
  - cc_longest_function
  - smell_total
  - smell_complexity
  - mccabe_max
  - mccabe_avg
  - cognitive_max
  - cognitive_avg
  - cycle_count
  - refactorings_applied
  - predictions_correct
  - predictions_correct_rate
  - tests_passed_immediately
  - duration_seconds
  - total_tokens
min_replicates: 3
status: aktiv
---

# RQ-7: Subagents-Effekt (v4 vs v5)

v4-exact-subagents und v5-exact-single-context teilen sich **denselben
Phasen-Skript-Inhalt** (Predictor + Red + Green + Refactor mit gleichen
Regeln). Der einzige systematische Unterschied:

| | v4-exact-subagents | v5-exact-single-context |
|---|---|---|
| Phase = | dedizierter Subagent (eigener Kontext, frischer System-Prompt) | Phase im selben Konversations-Kontext |
| Kontext-Übergang | Subagent-Spawn, isoliert | nahtlos, gleiche History |
| Token-Profil | mehr (jeder Subagent liest Prompt-Inputs neu) | weniger (kumulativ) |

Die Frage: **Macht das Aufsplitten in Subagents einen messbaren
Unterschied** — auf Code-Qualität (smell_total, cc_longest_function),
TDD-Disziplin (predictions_correct, refactorings_applied) und Effizienz
(duration_seconds, total_tokens)?

## Forschungsmotivation

Subagents-pro-Phase haben zwei plausible, gegenläufige Effekte:

1. **Pro Subagents**: jeder Phasen-Schritt startet mit fokussiertem
   Kontext, keine Drift aus vorherigen Phasen, härtere
   Phasen-Disziplin.
2. **Contra Subagents**: jeder Phasenwechsel kostet Re-Establishment
   des Kontexts (Code lesen, State rekonstruieren), möglicher Verlust
   von Mikro-Entscheidungen aus vorheriger Phase, höhere Token-Kosten.

Die Beobachtung aus dem ersten claim-office-Run-Block legt nahe, dass
v4 deutlich aufwendiger ist (~58 min vs ~5 min für v3), bei gleicher
verification_pct, aber sehr niedrigerem `smell_total` (2 vs ~17–20)
und kompakterem `cc_loc` (28 vs ~100–125). Diese RQ verifiziert das
Muster gegen den methodisch sauberen Vergleichspartner v5.

### Trade-off-Lesart

H1, H3 und H4/H6 sind keine unabhängigen Hypothesen — sie spannen
zusammen einen Trade-off-Raum auf, in dem v4 nur dann sinnvoll
einsetzbar ist, wenn der Struktur-Gewinn nicht durch Korrektheits- und
Zeit-Kosten aufgefressen wird:

- **Struktur-Achse** (H1): liefert v4 messbar besseren Code als v5?
  Outcomes: `cc_longest_function`, `cc_functions`, `cc_avg_loc_per_function`,
  `mccabe_max`, `cognitive_max`, `smell_total`, `code_mass`.
- **Korrektheits-Achse** (H4/H6): bezahlt v4 für die bessere Struktur
  mit niedrigerer oder instabilerer Korrektheit?
  Outcomes: `verification_pct`, `tests_passing` (Rate über Replikate).
- **Zeit-Achse** (H3): wie teuer ist der Struktur-Gewinn pro Run?
  Outcomes: `duration_seconds`, `total_tokens`.

Eine v4-Konfiguration ist nur dann **strikt besser** als v5, wenn sie
auf der Struktur-Achse gewinnt UND auf den anderen beiden Achsen nicht
verliert. Verliert sie auf einer Achse, wird die Bewertung
kontextabhängig — und genau diese Kontext-Abhängigkeit ist H5/H6:
Kata-Komplexität moderiert, ob der Trade-off positiv oder negativ
ausfällt.

## Design-Begründung

**Single-factor Workflow (v4 vs v5)**: alle anderen Workflow-Aspekte
sind kontrolliert, weil v4 und v5 inhaltlich denselben Skript haben.

**Prompt = example-mapping**: für TDD-Workflows der Default-Stil
(siehe Methoden-Constraint), maximale Test-Anker-Information.

**Beide Katas (claim-office + game-of-life)**: claim-office liefert
das Korrektheits-Signal (verification_pct, dort sind Mehrdeutigkeiten),
game-of-life liefert das Code-Qualitäts-Signal (smell_total,
cc_longest_function differenzieren dort).

**Single Model (opus-4-7-no-thinking)**: hält RQ-7 single-factor in
Modell-Dimension.

## Untersuchte Hypothesen

- H1: v4 produziert weniger `code_mass` und `smell_total` als v5
  (frischer Kontext pro Phase → kompaktere Implementierung,
  diszipliniertere Refactor-Phase).
- H2: v4 zeigt höhere `predictions_correct_rate` als v5 (Predictor-
  Subagent kann nicht von vorheriger Konversation lecken).
- H3: v4 braucht deutlich mehr `duration_seconds` und `total_tokens`
  als v5 (mehrfaches Kontext-Re-Establishment).
- H4: `verification_pct` ist zwischen v4 und v5 vergleichbar — das
  Skript bestimmt die Korrektheit, nicht die Subagent-Topologie.
- H5 (Kata-Komplexität moderiert Struktur-Vorteil): Der Vorteil von v4
  in Funktions-Zerlegung (kürzere `cc_longest_function`, höhere
  Funktions-Anzahl) zeigt sich nur auf Katas oberhalb einer
  Komplexitäts-Schwelle. Auf game-of-life (~30 src-LoC) sind v4 und v5
  strukturell ebenbürtig; auf claim-office (~210 src-LoC) divergieren
  sie deutlich.
  **Operationalisierung:** Differenz `Δ cc_longest_function = v5 − v4`
  als Funktion von src-LoC der erfolgreichen Implementierung.
- H6 (v4-Korrektheit fällt mit Kata-Komplexität): v4 verliert an
  `verification_pct` / `tests_passing`, je mehr State der Subagent
  zwischen Phasen rekonstruieren muss. Auf game-of-life (kleiner State)
  erreicht v4 öfter 100%, auf claim-office (zwei Operationen, Shared
  State) bricht v4 häufiger ein. Falsifiziert H4 in Richtung
  Kata-Abhängigkeit.
- H7 (v4 inflationiert code_mass pro bestandenen Test): Frischer
  Subagent pro Phase liest Test-Datei neu und neigt dazu, Test-Cases
  ohne Übersicht über bereits abgedeckte Fälle hinzuzufügen.
  Erwartung: `code_mass / verification_passed` ist bei v4 systematisch
  höher als bei v5.
  **Operationalisierung:** Ratio pro Run, dann Workflow-Mittel.
- H8 (Trade-off-Profil): Pro Zelle (kata × model) lassen sich v4 und
  v5 als Tripel (Struktur, Korrektheit, Zeit) charakterisieren, und
  die Vorzeichen der drei Differenzen bestimmen, ob eine Konfiguration
  v4-dominiert ist (alle drei Differenzen sprechen für v4),
  v5-dominiert ist (alle drei für v5) oder einen echten Trade-off
  darstellt (gemischte Vorzeichen).
  **Operationalisierung:** pro Zelle drei Differenzen ausrechnen:
  - Struktur: `cc_longest_function`(v5) − (v4) — positiv heißt v4 hat
    kürzere Spitzen-Funktion.
  - Korrektheit: `verification_pct`(v4) − (v5) — positiv heißt v4 ist
    korrekter (bei Vitest-only-Katas: `tests_passing`-Rate).
  - Zeit: `duration_seconds`(v5) − (v4) — positiv heißt v4 ist
    schneller.
  Berichten als Tabelle Zelle × Differenz-Tripel. Aus den Vorzeichen
  ergibt sich automatisch "v4-dominiert / v5-dominiert / Trade-off"
  ohne willkürliche Schwellwerte.
  Erwartet (basierend auf bisherigen Daten): game-of-life × Opus zeigt
  Trade-off (Struktur und Korrektheit für v4, Zeit gegen v4),
  claim-office × Opus zeigt Trade-off mit anderem Profil (Struktur
  für v4, Korrektheit gegen v4, Zeit deutlich gegen v4). Welche der
  beiden "lohnender" ist, hängt vom Gewicht ab, das ein Anwender den
  drei Achsen gibt — diese Bewertung gehört nicht in die Hypothese.

## Findings

Siehe [findings.md](findings.md).

## Datenquelle

Alle Runs in `experiments/runs/` mit
`workflow ∈ {v4-exact-subagents, v5-exact-single-context}`,
`prompt=example-mapping`,
`model=opus-4-7-no-thinking`,
`kata ∈ {claim-office-example-mapping, game-of-life-example-mapping}`.

Aktuelle Datenbasis (Stand 2026-05-09):
- claim-office × v4: 1 Run vorhanden, 2 ausstehend (laufender Batch
  enthält v4-Slots für andere Modelle, aber nur 1 weiteren no-thinking-
  Run; 2 Nachzieh-Runs nötig).
- claim-office × v5: 3 Runs ausstehend (im laufenden Batch enthalten).
- game-of-life × v4 / v5: aus den smart-subset / game-of-life-fair-
  Batches abgedeckt.
