# RQ-model-quality-cursor — Findings

Modell-Effekt (Opus / Composer / Grok) auf Code-Qualität und TDD-Disziplin über den **cursor-cli-Harness** (`cursor-agent`), Kata `game-of-life-example-mapping`, Workflow `v6.2.1-phase-continuation-cursor`. n=5 pro Zelle, alle 15 Runs korrekt (Korrektheit innen & außen je 100 %, alle `completed_within_budget`).

Modell-IDs: `opus-cursor` → `claude-opus-4-8-medium`, `composer-cursor` → `composer-2.5`, `grok-cursor` → `cursor-grok-4.5-medium`.

## Übersicht

Primär-Metriken der Code-Qualität (alle **kleiner = besser**) plus Korrektheit. Da alle drei Modelle 100 % Korrektheit (innen) erreichen, sind die Qualitäts-Pokale nicht durch Korrektheit eingeschränkt — alle Zellen qualifizieren.

| Metrik (Richtung) | opus-cursor | composer-cursor | grok-cursor |
|---|---:|---:|---:|
| `cognitive_max` (Spitzen-Kognitiv, ↓) | 16.6 | **8.2** 🏆 | 10.6 |
| `cognitive_avg` (↓) | 15.3 | **5.93** 🏆 | 7.2 |
| `mccabe_max` (↓) | 10.6 | **7.6** 🏆 | 8.8 |
| `mccabe_avg` (↓) | 4.33 | **2.63** 🏆 | 3.38 |
| `smell_total` (Smell-Summe, ↓) | 4.0 | **3.4** 🏆 | 3.6 |
| Produktiv-LoC `lines_of_code` (↓) | **27.8** 🏆 | 59.2 | 42.8 |
| Code-Mass (APP) `code_mass` (↓) | **141.8** 🏆 | 182.2 | 149.2 |
| Korrektheit (innen) `tests_passing` (↑) | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 |
| `predictions_total` (Marker-Nutzung) | 18.4 | 7.0 | 9.8 |
| `duration_seconds` (↓) | 198 | **120.8** 🏆 | 169 |
| `total_tokens` (↓) | 1.74 M | **768 k** 🏆 | 1.17 M |

`cost_usd` fehlt für alle Runs — der cursor-cli-Pfad (Cursor-Abo) liefert keine Inline-Kosten pro Run.

---

## F-1.1 — Composer schreibt die komplexitätsärmste, Opus die knappste Lösung

Auf dem cursor-cli-Harness spreizen sich die drei Modelle deutlich auf zwei **entgegengesetzten** Qualitätsachsen:

- **composer-cursor** gewinnt jede Komplexitäts-Metrik: `cognitive_max` 8.2 vs. 16.6 (opus), `cognitive_avg` 5.93 vs. 15.3, `mccabe_max` 7.6, `mccabe_avg` 2.63, `smell_total` 3.4.
- **opus-cursor** gewinnt die Volumen-Metriken: Produktiv-LoC 27.8 vs. 59.2 (composer), Code-Mass (APP) 141.8.

| Achse | opus | composer | grok |
|---|---:|---:|---:|
| `cognitive_max` (↓) | 16.6 | **8.2** 🏆 | 10.6 |
| `mccabe_avg` (↓) | 4.33 | **2.63** 🏆 | 3.38 |
| Produktiv-LoC (↓) | **27.8** 🏆 | 59.2 | 42.8 |

Der Spread ist bei `cognitive_avg` groß (opus 15.3 vs. composer 5.93, ~2.5× bei σ≈3.8) und bei Produktiv-LoC ebenfalls (opus 27.8 vs. composer 59.2 bei σ≈6). Beides deutlich > 1σ.

**Begründung (Code-Inspektion bestätigt die Metriken):** Opus packt die gesamte Logik in eine dichte `nextGeneration` mit dreifach verschachtelten Schleifen (`dx`/`dy` + `continue`-Guard) — wenige Zeilen, hohe kognitive Last pro Zeile. Composer extrahiert `NEIGHBOR_OFFSETS` als Konstante plus `cellKey()`/`parseKey()`-Helfer und trennt Survival- und Birth-Pass in flache Einzelschritte — mehr Zeilen, aber jede Einheit simpel. **Parsimonie (wenig Code) und niedrige Komplexität fallen hier auseinander**: das knappste Modell ist nicht das komplexitätsärmste. grok-cursor liegt auf beiden Achsen dazwischen.

---

## F-1.2 — Modell-Spreizung bestätigt: der cursor-cli-Harness ist diskriminationsfähig

Der Harness macht Modell-Unterschiede messbar (H3 bestätigt). Über `cognitive_max` und `mccabe_avg` trennen sich die drei Modelle klar, bei durchgängig 100 % Korrektheit — die Spreizung ist also ein reines Qualitätssignal, kein Korrektheits-Confound.

Composer ist zudem **effizienter**: kürzeste Laufzeit (120.8 s vs. opus 198 s) und wenigste Tokens (768 k vs. opus 1.74 M) — bei gleicher Korrektheit und niedrigster Komplexität. Damit ist H2 (Composer als Unbekannte) beantwortet: Composer hält code-qualitativ nicht nur mit, sondern führt auf den Komplexitäts- und Effizienz-Achsen.

---

## F-1.3 — Opus nutzt die TDD-Marker-Mechanik am dichtesten

`predictions_total` spreizt stark: opus 18.4 vs. grok 9.8 vs. composer 7.0. opus fährt also mehr explizite Vorhersage-Marker pro Run, bei ebenfalls hoher Trefferquote (`predictions_correct` 18.4/18.4). `cycle_count` liegt dagegen enger beieinander (opus 8.4, composer 7.6, grok 9.6).

**Begründung:** Höhere `predictions_total` heißt dichtere Nutzung des Workflow-Marker-Pfads, **nicht** automatisch höhere TDD-Disziplin (parallel zum pi-/oc-Befund). Composer erreicht mit weniger Markern dieselbe Korrektheit und bessere Komplexitätswerte — Marker-Compliance und Ergebnisqualität sind hier entkoppelt.

---

## Caveats

- **Eigener Tarif-Confound:** Kosten laufen über das Cursor-Abo, nicht Requesty (pi/OC) oder Anthropic-Listenpreis (CC). `cost_usd` ist daher leer; Cross-Harness-Kostenvergleiche mit dieser RQ sind nicht möglich.
- **Routing-/Harness-Confound:** Alle Zellen laufen über cursor-cli mit dem cursor-spezifischen Workflow. Kein 1:1-Transfer der Modell-Werte zu RQ-model-quality (CC) / -oc / -pi. Der Opus-Cross-Check (H1) gegen die anderen Harnesse steht noch aus.
- `verification_pct` = 100 % spiegelt hier `tests_passing` (game-of-life hat keine externe Verifikations-Suite); Korrektheits-Anker ist `tests_passing` (innen).
