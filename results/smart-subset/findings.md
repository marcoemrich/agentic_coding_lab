# Smart-subset findings (89 von 90 Runs)

Quelle: `runs.csv` (siehe `summary.md` für vollständige Pivot-Tabellen).
Generiert: 2026-05-03.

> **Update 2026-05-03 (post-hoc enrichment)**: Transcript-Pipeline und ESLint
> wurden via `experiments/enrich-runs.sh` nachträglich auf alle 89 Runs
> angewendet. Die unten in §Caveats benannten Daten-Lücken sind weitgehend
> geschlossen. Neue Sektionen 6 (TDD-Disziplin) und 7 (Code-Smells) hinzugefügt.

---

## Top-Befunde

### 1. Failure-Konzentration auf Haiku 4.5 in v4/v5

Pass-Rate über alle 11 (workflow × model)-Zellen:

| Zelle | Pass-Rate |
|---|---:|
| v4-exact-subagents × haiku-4-5 | **75 %** (6/8) |
| v5-exact-single-context × haiku-4-5 | **50 %** (4/8) |
| Alle 9 anderen Zellen | **100 %** |

Sonnet, Opus (mit/ohne Thinking) und alle Workflows v1–v3 liefern in dieser
Stichprobe durchgehend grüne Tests. Die einzigen Failures sind Haiku-4-5 in
den beiden anspruchsvollen Multi-Step-Workflows (v4/v5).

Die 4 v5+haiku-Failures sind alle vom selben Muster: nur Test-Liste
(`*.spec.ts` mit `it.todo`-Stubs), keine Implementation, `loc=0`. Das Modell
"vergisst" in dem single-context-Workflow nach dem Schreiben der Test-Liste
den Implementierungsschritt.

### 2. v5 ist substanziell schneller als v4 — bei gleicher Erfolgsrate (außer Haiku)

Mittlere Dauer pro Zelle:

| Zelle | v4 (s) | v5 (s) | Δ |
|---|---:|---:|---:|
| haiku-4-5 | 542 | 165 | **−70 %** |
| opus-4-7 | 549 | 245 | **−55 %** |
| opus-4-7-no-thinking | 650 | 230 | **−65 %** |
| sonnet-4-6 | 687 | 471 | **−31 %** |

v5 reduziert die Wallclock-Zeit um 31–70 %, ohne die Pass-Rate auf
Sonnet/Opus zu senken. Der einzige v5-Trade-off zeigt sich bei Haiku
(50 % vs. 75 %).

### 3. Opus 4.7 Thinking vs. No-Thinking: praktisch identisch

In dieser Stichprobe macht Adaptive Thinking kaum Unterschied auf den
Kern-Metriken:

| Workflow | Variante | n | Pass-Rate | Dauer | LoC |
|---|---|---:|---:|---:|---:|
| v4 | Opus thinking | 11 | 100 % | 549 s | 11.1 |
| v4 | Opus no-thinking | 8 | 100 % | 650 s | 13.0 |
| v5 | Opus thinking | 12 | 100 % | 245 s | 8.7 |
| v5 | Opus no-thinking | 8 | 100 % | 230 s | 12.6 |

Auf v4 ist Thinking sogar leicht schneller (−15 %), auf v5 minimal
langsamer (+7 %). Lines of Code sind tendenziell mit Thinking etwas
kompakter. Kein klares Signal, dass Thinking hier den Unterschied macht
— der headline-Befund aus den 235 alten Runs ("v4 + Opus + Thinking ist
die Speerspitze") sieht in dieser Replikation eher wie "Opus auf v4/v5
funktioniert solide, Thinking-Bonus ist klein" aus.

### 4. v1/v2/v3 + Sonnet sind die schnellste 100 %-Lösung

Alle drei "klassischen" Workflows mit Sonnet schaffen 100 % Pass-Rate
in 33–50 s mittlerer Wallclock-Zeit — eine Größenordnung schneller als
v4/v5. v2-iterative (n=2) ist hier nicht aussagekräftig, aber v1-oneshot
(n=8, 33 s) und v3-basic-tdd (n=8, 39 s) sind beide voll grün.

Damit relativiert sich der Wert der aufwändigen Subagent/Single-Context-
Workflows: Sie bringen auf den getesteten Katas keine bessere Pass-Rate
und kosten 10–20× mehr Zeit. Ihr Mehrwert müsste sich auf
Code-Qualitäts-Metriken (Coverage, Smells, LoC, Modularität) zeigen — nicht
auf Korrektheit.

### 5. Coverage und LoC: v4/v5 bringen messbar mehr Tests

| Workflow | Avg test_lines | Avg tests_total | Coverage stmt |
|---|---:|---:|---:|
| v1-oneshot | 40.4 | 6.9 | 100 % |
| v3-basic-tdd | 54.4 | 7.6 | 100 % |
| v4 (avg über Modelle, n=35) | 30.8 | 6.7 | 94.3 % |
| v5 (avg über Modelle, n=36) | 27.6 | 5.2 | 88.8 % |

Überraschend: v3-basic-tdd hat die höchsten test_lines (54.4) und
tests_total (7.6) — die strikteren Workflows v4/v5 produzieren *weniger*
Tests, vermutlich weil ihr engerer Cycle weniger Beispielskanten
abdeckt. Coverage bleibt für Sonnet/Opus auf v4/v5 weiterhin bei
99–100 % — die Tests die geschrieben werden, decken alles ab.

LoC pro Lösung schwankt wenig (4–14 für funktionierende Runs); v4 +
haiku ist mit 24 LoC der Ausreißer, was auf weniger refaktorierten Code
in den haiku-Failures hindeutet (Implementation-Versuche, die nicht
abgeschlossen wurden).

### 6. TDD-Disziplin: v4 macht echtes TDD, v3 fakest es weiterhin

Mit der nachträglich angereicherten Transcript-Pipeline lassen sich Cycle-
und Refactoring-Counts pro Run rekonstruieren. Aggregat über alle Katas:

| Workflow × Modell | n | avg cycles | avg refactorings | predictions correct/total | tests_passed_immediately |
|---|---:|---:|---:|---:|---:|
| v1-oneshot × sonnet-4-6 | 7 | 1.1 | 0.0 | – | – |
| v3-basic-tdd × sonnet-4-6 | 8 | **1.2** | **0.0** | – | – |
| v4-exact-subagents × opus-4-7 | 11 | 6.2 | 4.7 | 4.6/4.6 (100 %) | 2.0 |
| v4-exact-subagents × opus-4-7-no-thinking | 8 | 6.8 | 5.4 | 5.2/5.2 (100 %) | 3.2 |
| v4-exact-subagents × sonnet-4-6 | 8 | 6.8 | 5.8 | 5.8/6.4 (91 %) | 2.5 |
| v4-exact-subagents × haiku-4-5 | 8 | 5.8 | 5.2 | 2.1/2.2 (95 %) | 0.9 |
| v5-exact-single-context × opus-4-7 | 12 | 5.5 | 4.2 | – (v5 macht keine) | 1.5 |
| v5-exact-single-context × sonnet-4-6 | 8 | 5.5 | 5.5 | – | 1.9 |

Wichtigste Befunde:

- **v3-basic-tdd reproduziert das alte "Fake-TDD"-Muster**: 1.2 Cycles im
  Schnitt, 0 Refactorings — v3 schreibt Tests + Implementation oft in
  einem Schritt, ohne ehrlichen Red→Green→Refactor-Zyklus.
- **v4 macht echtes TDD**: 5.8–6.8 Cycles, 4.7–5.8 Refactorings — die
  Disziplin steckt im Workflow, nicht im Modell.
- **Predictions auf v4 sind nahezu perfekt**: Opus 4.7 ohne Thinking
  schlägt mit 100 %/5.2-Vorhersagen sogar minimal Opus mit Thinking
  (100 %/4.6) — Adaptive Thinking bringt hier kein Plus.
- **v5 macht keine Predictions** (das Workflow-Design verlangt sie nicht),
  hat aber ähnliche Cycle-/Refactoring-Counts wie v4.

### 7. Code-Smells: nur große Katas haben Spielraum

Smells aus ESLint+SonarJS (Magic Numbers, Cognitive Complexity ≥10,
max-depth >3, Duplikation):

| Kata | Anzahl Runs mit smell>0 | typischer Smell |
|---|---:|---|
| game-of-life-prose | **7/12** | magic_numbers (2–3) + complexity (haiku: zusätzliche duplication) |
| mars-rover-prose | 2/12 | magic_numbers (sonnet/v1), complexity (sonnet/v3) |
| pixel-art-scaler-* | 0/30 | sauber |
| string-calculator-* | 0/35 | sauber |

→ Der Mai-Code ist auf den kleinen Katas (string-calculator,
pixel-art-scaler) so knapp, dass er die SonarJS-Schwellen nicht reißt.
Erst bei game-of-life und mars-rover differenziert sich was: dort haben
**v1/v3-Runs (sonnet)** sichtbar mehr Smells (4–5) als v4/v5 (2–3).

Magic Numbers dominieren. Nur ein Run (v5+opus-no-thinking auf
game-of-life) bricht die cognitive-complexity-Schwelle 3×. Duplication
und Code-Quality-Smells praktisch null.

---

## Caveats

- **n pro Zelle ist klein** (2–12). Pass-Rate-Differenzen unter ~20 % sind
  nicht signifikant.
- **6 Runs ohne transcript** (von 89): Bei diesen ist `cycle_count=0` weil
  die Session-JSONL fehlt (gefailte Runs ohne Schreibvorgang im
  `~/.claude/projects/`-Cache).
- **Smells stark konzentriert auf 2 Katas** (game-of-life, mars-rover).
  Aussagen zu Smells über alle Katas hinweg sind dadurch dünn.
- **1 Plan-Triple fehlt**: `pixel-art-scaler-prose × v4-exact-subagents ×
  opus-4-7` hat 2 statt 3 Replikate (das initiale 2.1.37-Hänger-Run-Dir
  wurde gelöscht).
- **2 frühere Tests-passing-True-False-Korrekturen**: zwei v4+haiku-Runs
  (`pixel-art-scaler-example-mapping`, `pixel-art-scaler-user-story`)
  wurden manuell auf `tests_passing=false` gepatcht (Bug in
  `analyze-run.sh:258` jetzt gefixt).

---

## Empfehlungen für die nächste Iteration

1. **Transcript-Pipeline ist jetzt im Batch eingebaut** (run-batch.sh's
   `save_transcript()`); für künftige Batches automatisch aktiv. Kein
   Action-Item mehr, nur dokumentiert.
2. **ESLint+SonarJS jetzt nachträglich verfügbar**, aber für Batch-Runs
   sollte das ins Run-Template + pnpm-Cache verlegt werden, damit es
   nicht jedes Mal ad-hoc installiert wird.
3. **Mehr Replikate auf den Failure-Cells**: v5+haiku mit 8 Runs hatte
   nur 50 % — entweder n erhöhen (16+) oder die 4 Failure-Runs
   investigieren, um zu klären ob es Workflow-Limit oder Modell-Limit ist.
4. **Smell-Differenzierung braucht größere Katas**: pixel-art-scaler und
   string-calculator sind zu trivial. Nächster Batch sollte den Anteil
   game-of-life/mars-rover erhöhen oder zusätzliche schwere Katas
   einführen.
5. **Headline-Befund nachschärfen**: v4-exact-subagents mit
   Opus-4-7-Thinking als "Speerspitze" hält in dieser Replikation nicht
   stand — Pass-Rate ist gleich gut wie viele billigere Setups, Dauer
   ist 10× höher. Mit den neuen TDD-Disziplin-Daten zeigt sich aber: v4
   liefert die einzigen Runs mit echter Cycle-Disziplin. v5 ist
   "Disziplin light", v1/v3 keine.
