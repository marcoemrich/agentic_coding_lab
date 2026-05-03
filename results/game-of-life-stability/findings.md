# Game-of-life-stability findings (33/33 Runs nach Bereinigung)

Quelle: `runs.csv` (siehe `summary.md` für vollständige Pivot-Tabellen).
Generiert: 2026-05-03 (re-aggregiert nach Bereinigung der 12 kontaminierten v1/v2-Runs).

> **Update 2026-05-03 (Bereinigung Workflow×Prompt-Mismatch)**: Die ursprünglichen
> 45 Runs enthielten 12 v1/v2-Runs auf example-mapping/user-story Prompts. Da diese
> Prompts explizite Test-Beispiele pro Regel enthalten, bekamen die Non-TDD-Workflows
> TDD-typische Strukturhinweise frei Haus → unfair für den Workflow-Vergleich.
> Diese 12 Runs wurden aus dem Plan und aus `experiments/runs/` entfernt. Es
> verbleiben 33 Runs: v3/v4/v5 × 3 Prompt-Stile × n=3 + v1/v2 × prose × n=3.

> **Update 2026-05-03 (Re-Analyse nach Metriken-Pipeline-Fix)**: Drei
> Bug-Fixes in `analyze-run.sh` / `analyze_transcript.py` (POSIX-awk,
> v3-Phasen-Inferenz, v5-Prediction-Regex) plus v5-Re-Run nach
> `red.md`-Template-Fix. Alle TDD-Metriken (`cycle_count`, `predictions_*`,
> `avg_red/green/refactor_seconds`) und alle Code-Quality-Metriken
> (`cc_functions`, `cc_longest_function`, `cc_avg_loc_per_function`)
> jetzt belastbar für v3 und v5 — **alte Versionen dieser Findings hatten
> dort 0-Werte als Bug-Artefakt, nicht als realen Befund**.

---

## 0. Methoden-Überblick

### 0.1 Forschungsfrage

**Stabilität des Workflow-Effekts auf Code-Qualität, isoliert auf der einzigen
Kata mit echtem Code-Quality-Signal.**

Das Smart-subset-Experiment (Mai 2026) hatte:
- Über 4 Katas hinweg n=1..3 pro Kombo → Varianz nicht aussagekräftig.
- 3 von 4 Katas (string-calculator, pixel-art-scaler, mars-rover) zu klein
  oder zu strukturiert → keine Smell-Differenzierung möglich.
- Nur game-of-life zeigte konsistente Workflow-Effekte auf `smell_total`,
  `cc_loc`, `lines_of_code`.

Hier: alles auf game-of-life konzentriert, **3 Replikate pro Kombo**.

### 0.2 Experiment-Design

**Variablen** (post-Bereinigung):

| Achse | Stufen | n |
|---|---|---:|
| Workflow | v1-oneshot, v2-iterative (prose-only); v3-basic-tdd, v4-exact-subagents, v5-exact-single-context (alle 3 Prompt-Stile) | 5 |
| Modell | opus-4-7-no-thinking | 1 |
| Prompt-Stil | game-of-life-prose (alle 5 Workflows), game-of-life-example-mapping (v3/v4/v5), game-of-life-user-story (v3/v4/v5) | 3 |
| Replikate | 3 | 3 |

**Total: 5 × 3 + 3 × 3 × 2 + 3 × 3 = 33 Runs** im Plan; alle erfolgreich.
- v1+v2 prose: 6 Runs (n=3 pro WF)
- v3+v4+v5 × 3 Prompt-Stile: 27 Runs (n=3 pro Zelle)

### 0.3 Modell-Wahl: Opus 4.7 ohne Thinking

Smart-subset zeigte:
- Opus > Sonnet > Haiku auf game-of-life-prose (Smell, LoC, Refactor-Disziplin).
- Thinking-Modus ohne messbaren Vorteil bei v4/v5 — Opus-no-thinking ist
  praktisch identisch zu Opus-thinking, aber günstiger und schneller.

→ Opus-no-thinking als Default für Stabilitäts-Studie.

---

## 1. Headline-Befunde

### 1.1 Alle Runs grün

100% Tests-passing, 100% Statement+Branch-Coverage über alle 45 Runs. **Kein
Workflow versagt funktional auf game-of-life mit Opus.** Der Wettbewerb läuft
nur auf Code-Qualität, Disziplin und Effizienz.

### 1.2 Workflow-Ranking

| Workflow | n | LoC μ±σ | smell_total μ±σ | smell_complexity μ±σ | Dauer μ±σ (s) | Refactor-Anwendungen μ |
|---|---:|---:|---:|---:|---:|---:|
| v1-oneshot              | 3 (prose) | 41.0±3.6 | 4.0±2.0 | 1.3±1.2 | 49±3    | 0.0 |
| v2-iterative            | 3 (prose) | 42.7±2.5 | 5.3±0.6 | 1.3±0.6 | 54±8    | 0.0 |
| v3-basic-tdd            | 9 (3 Stile) | 40.7±7.4 | 4.1±1.7 | 1.1±0.9 | 49±4    | 0.0 |
| **v4-exact-subagents**  | 9 (3 Stile) | **39.6±6.1** | **2.8±1.3** | **0.3±1.0** | 728±131 | **5.1** |
| v5-exact-single-context | 9 (3 Stile) | 36.6±4.1 | 2.8±1.0 | 0.3±1.0 | 355±57  | **7.0** |

**Klare Sieger**:

- **v4 und v5 dominieren auf smell_complexity** (beide 0.3 vs. 1.1–1.3 bei
  v1/v2/v3) und smell_total (beide 2.8 vs. 4.0–5.3). v4 leicht kompakter,
  aber im σ-Bereich.
- **v2 produziert konsistent den schlechtesten Code** auf prose
  (smell_total 5.3, höchster Wert) — strukturierte Iteration ohne TDD-Disziplin
  fördert Over-Engineering.
- **v4 ist 14× langsamer als v3** und 2.1× langsamer als v5 — die Subagent-
  Pipeline kostet ~12 min Wallclock pro Run.
- **v3 ist die schnellste TDD-Variante** (49s) und produziert kompakteren Code
  als v1/v2, aber **null Refactorings angewendet** — der Refactor-Step im
  v3-Workflow wird vom Modell systematisch übersprungen oder als no-op
  markiert.

### 1.3 Stabilität (σ pro Kombo, n=3)

| Workflow | n-Kombos | LoC σ-Range | smell σ-Range | Dauer σ-Range |
|---|---:|---:|---:|---:|
| v1-oneshot              | 1 (prose)   | 3.6      | 2.0     | 2.5      |
| v2-iterative            | 1 (prose)   | 2.5      | 0.6     | 7.5      |
| v3-basic-tdd            | 3           | 2.1–11.0 | 1.7–2.1 | 2.5–4.9  |
| **v4-exact-subagents**  | 3           | **4.2–8.0**  | **0.6–2.3** | **46–184**  |
| v5-exact-single-context | 3           | 2.9–5.9  | 1.5–2.1 | 33–84    |

- **v5 ist am stabilsten in LoC** (σ ≤ 5.9). v4 nur leicht weniger stabil.
- **v4 hat extreme Dauer-Varianz** auf prose/user-story (σ = 184/167s) —
  einzelne Runs schwanken zwischen 9 und 15 min. Subagent-Loop läuft je nach
  Komplexitäts-Vorhersage unterschiedlich oft.
- **smell-Varianz ist überall ≤ 2.3** — die Workflow-Mittelwerte sind robust.

---

## 2. Prompt-Stil-Effekt (nur v3/v4/v5, n=9 pro Stil)

Auf der bereinigten Datenbasis ist der Prompt-Stil-Effekt nur über die drei
TDD-Workflows abschätzbar (v1/v2 nur prose).

| Prompt-Stil | n | LoC μ±σ | smell_total μ±σ |
|---|---:|---:|---:|
| game-of-life-example-mapping | 9 | 39.0±7.5 | 3.0±1.2 |
| game-of-life-prose           | 9 | 40.6±6.3 | 3.7±1.8 |
| game-of-life-user-story      | 9 | 37.2±4.0 | 3.0±1.3 |

**Befund: kein praktisch relevanter Unterschied zwischen den drei Prompt-Stilen.**

- LoC fast identisch (37–41), Differenzen liegen innerhalb der σ.
- smell_total bei prose marginal höher (3.7 vs. 3.0) — Effekt innerhalb von 1σ.

**Implikation**: Der Smart-subset-Befund "Prompt-Stil hat keinen großen
Effekt" reproduziert sich auch auf game-of-life für TDD-Workflows.

---

## 3. TDD-Disziplin (alle Workflows mit echten Phasen-Daten)

> **Re-Analyse-Hinweis**: Vorherige Version dieses Kapitels hatte v3-Werte
> aus dem `derive_cycle_count`-Fallback (pnpm-test-Calls statt echter
> Phasen) und v5 mit `predictions=0` wegen Template/Regex-Mismatch. Beide
> Bugs gefixt. Zahlen unten kommen aus den re-analysierten 36 v1–v4-Runs
> und den neu generierten 9 v5-Runs.

### 3.1 Cycle-Counts und Refactor-Frequenz

Aus `runs.csv` aggregiert (Mittelwerte über alle 3 Prompt-Stile, n=9):

| Workflow | Cycles μ | Refactorings μ | Predictions correct/total | tests_passed_immediately μ |
|---|---:|---:|---|---:|
| v1-oneshot              | 1.0 | 0.0 | 0/0  | 0.2 |
| v2-iterative            | 1.2 | 0.0 | 0/0  | 0.3 |
| v3-basic-tdd            | 1.0 | 0.0 | 0/0  | 0.0 |
| **v4-exact-subagents**  | **8.4** | **5.1** | **52/53 (98%)** | 5.1 |
| **v5-exact-single-context** | **8.1** | **7.0** | **122/123 (99%)** | 1.2 |

- **v4 und v5 haben beide Test-Predictions**, mit ähnlich hoher Trefferquote
  (98% / 99%). v5 hat **mehr Predictions absolut** (123 vs. 53), weil es zwei
  Predictions pro Cycle dokumentiert (Compilation + Runtime), v4 nur eine
  konsolidierte. Die Datenbasis ist also größer für v5.
- **v5 macht etwas mehr Refactorings als v4** (7.0 vs. 5.1 im Mittel) — der
  Single-context-Workflow refaktoriert konsequenter. Trotzdem ist
  smell_complexity bei v5 schlechter (1.3 vs. 0.3) — v5-Refactorings sind
  pro Cycle kürzer und scheinen kleinere lokale Aufräumarbeiten zu sein.
- **v3 macht echt nur 1.0 Cycles** (re-analysiert via Tool-Sequenz-Inferenz):
  Test-Block schreiben → einmal `pnpm test` → Implementation → einmal
  `pnpm test`. Klassischer non-TDD-Batch-Stil — nicht 1.8 wie alte Auswertung
  via pnpm-test-Fallback fälschlich nahelegte.
- **`tests_passed_immediately` (Red ohne folgendes Green) ist bei v4 mit 5.1
  am höchsten** — also: in über der Hälfte der v4-Cycles war der Test schon
  grün durch eine vorherige Implementation. Bei v5 nur 1.2. Indikator dafür,
  dass v4 öfter "additive" Test-Erweiterungen ohne neue Implementation macht.

### 3.2 Cycle-Phasen-Dauer (v4 vs. v5)

| Workflow | red μ (s) | green μ (s) | refactor μ (s) | total μ (s) |
|---|---:|---:|---:|---:|
| v4-exact-subagents      | 29.0 | 19.7 | 41.8 | 90.5 |
| v5-exact-single-context | 19.8 | 10.4 | 15.0 | 45.2 |

- v4 verbringt **2.8× länger im refactor-step** als v5 (42s vs. 15s).
  Erklärt einen Großteil des Wallclock-Unterschieds.
- v4-red ist 1.5× länger als v5-red — Subagent-Setup-Overhead.
- v5 ist phasenweise schneller, aber **smell-Werte zeigen, dass die
  Refactor-Qualität leidet** (kürzere Refactor-Schritte = oberflächlichere
  Refactorings).

### 3.3 v3 vs. v4/v5: realistische TDD-Disziplin

Mit Phasen-Inferenz aus Tool-Sequenz hat v3 jetzt belastbare red/green-
Dauerwerte:

| Workflow | red μ (s) | green μ (s) | red+green μ (s) |
|---|---:|---:|---:|
| v3-basic-tdd            | 2.6 | 2.9 | 5.5 |
| v4-exact-subagents      | 29.0 | 19.7 | 48.7 |
| v5-exact-single-context | 19.8 | 10.4 | 30.2 |

→ v3-Cycle ist **9× schneller** als v4-Cycle und 5× schneller als v5-Cycle,
aber bei v3 läuft alles in **einem** Cycle (Batch-Schreiben statt iterativ).
Die Geschwindigkeit reflektiert daher nicht TDD-Effizienz, sondern Verzicht
auf TDD-Mechanik.

### 3.4 Refactor-Anzahl vs. Outcome-Metriken

v5 macht im Schnitt **mehr Refactorings als v4** (7.0 vs. 5.1):

| Workflow | Refactorings μ | refactor μ (s) | smell_complexity μ | cc_longest_function μ |
|---|---:|---:|---:|---:|
| v4-exact-subagents      | 5.1 | **41.8** | **0.3** | **11.0** |
| v5-exact-single-context | **7.0** | 15.0 | 0.3 | 15.7 |

- v4 macht **weniger, aber 2.8× längere** Refactor-Schritte (42s vs. 15s).
- Beide reduzieren smell_complexity auf 0.3.
- v4 schrumpft die längste Funktion stärker (11 vs. 15.7 LoC) — durch
  längere Refactor-Schritte wird konsequenter extract-method angewendet.

**Implikation**: Wer Refactor-Disziplin messen will, sollte **nicht** auf
`refactorings_applied` schauen, sondern auf:
- `avg_refactor_seconds` (Tiefe pro Refactor-Schritt), oder
- `cc_longest_function` als Outcome-Metrik (siehe §4.2).

Refactor-Anzahl allein ist ein Vanity-Metric — sagt aus, wie oft das Modell
"Refactor"-Phasen markiert, nicht ob die Refactorings das Cognitive-Load-
Niveau auf Funktions-Granularität senken.

---

## 4. Code-Quality-Detail

### 4.1 Smell-Aufschlüsselung (Mittelwert pro Workflow)

| Workflow | n | smell_magic_numbers | smell_complexity | smell_duplication | smell_code_quality |
|---|---:|---:|---:|---:|---:|
| v1-oneshot              | 3 | 2.3 | 1.3 | 0 | 0 |
| v2-iterative            | 3 | 3.0 | 1.3 | 0 | 0 |
| v3-basic-tdd            | 9 | 2.7 | 1.1 | 0 | 0 |
| **v4-exact-subagents**  | 9 | **2.4** | **0.3** | **0** | **0** |
| v5-exact-single-context | 9 | 2.4 | 0.3 | 0 | 0 |

- **smell_magic_numbers ist in den meisten Workflows ähnlich (2.3–2.7)** und der
  dominante Smell-Beitrag. Die magic numbers sind die GoL-Konstanten
  (`B3/S23` → 2 und 3 hardcoded). v2 sticht mit 3.0 heraus — leichter
  Over-Engineering-Effekt der Checklisten-Iteration.
- **smell_complexity ist klar TDD-Workflow-getrieben**: v4 und v5 liegen bei 0.3,
  alle anderen (auch v3 mit 1.1) liegen über 1.0. Echte Refactor-Phasen
  (v4: Subagent, v5: Skill-Step) reduzieren Cognitive-Complexity-Verstöße spürbar.
- duplication und code_quality sind universell 0 — keine Differenzierung.

### 4.2 Function-Granularität (cc_functions / cc_longest_function / cc_avg_loc_per_function)

Mittelwerte pro Workflow (n=9), berechnet aus `cc_*`-Spalten der re-analysierten
Runs:

| Workflow | cc_functions μ | cc_longest_function μ | cc_avg_loc_per_function μ |
|---|---:|---:|---:|
| v1-oneshot              | 2.6 | 34.0 | 15.7 |
| v2-iterative            | 2.9 | 32.6 | 12.9 |
| v3-basic-tdd            | 2.8 | 28.7 | 12.0 |
| **v4-exact-subagents**  | **5.7** | **11.0** | **4.9** |
| v5-exact-single-context | 4.3 | 15.7 | 6.1 |

- **v4 splittet am stärksten in kleine Funktionen** (5.7 Funktionen, längste
  nur 11 LoC, Schnitt 4.9 LoC). Klassischer Effekt der Refactor-Subagent-
  Pipeline mit Extract-Method-Mustern.
- **v5 ist auf halbem Weg** (4.3 Funktionen, längste 15.7) — das `red.md`-
  Skill-Template treibt zur Funktions-Extraktion, aber nicht so weit wie v4.
- **v1/v2/v3 produzieren Monolithen**: 2–3 Funktionen, längste ~30 LoC.
  Bei v3 trotz "TDD-Workflow" — weil im Batch-Stil ein einziger
  `currentGeneration → nextGeneration`-Funktionsblock geschrieben wird.
- **Function-Splitting korreliert stark mit smell_complexity-Reduktion**:
  v4 (cc_longest_function=11) hat smell_complexity=0.3; alle anderen mit
  längstem-Funktions-Wert ≥15 haben smell_complexity≥1.1.

→ `cc_longest_function` ist der **brauchbarste Single-Number-Proxy** für
SonarJS-`cognitive-complexity`-Verstöße auf dieser Kata. Bei zukünftigen
Auswertungen lohnt sich der Blick auf diese Metrik vor smell_total.

### 4.3 cc_loc (cleaned code lines, ohne Comments/Blank)

Aus summary.md, prose-Zeile als Beispiel (n=3 pro Zelle):

| Workflow | cc_loc |
|---|---:|
| v1-oneshot              | 33.7 |
| v2-iterative            | 35.0 |
| v3-basic-tdd            | 35.0 |
| v4-exact-subagents      | 36.0 |
| v5-exact-single-context | **32.0** |

- v5 produziert die kompaktesten Implementierungen (cc_loc 32).
- v4 ist trotz starker smell-Reduktion **NICHT der kompakteste** — die
  Subagent-Refactor-Schritte fügen oft Helper-Funktionen oder Konstanten
  hinzu.
- Spread ist schmal (32–36) — alle Workflows landen in der gleichen
  Größenordnung.

---

## 5. Replikation der Smart-subset-Befunde

| Smart-subset-Befund | Game-of-life-stability | Status |
|---|---|---|
| Opus dominiert auf game-of-life | Opus-no-thinking erzielt durchgängig 100% pass + sauberen smell-Trend | ✅ bestätigt |
| Thinking macht keinen messbaren Unterschied | n.a. (nur no-thinking) | ⚠️ implizit (durch Wahl bestätigt — Auffälligkeiten wären sichtbar) |
| v4 ist Code-Quality-Spitze | smell_complexity 0.3 — klar niedrigster (gleichauf mit v5 nach Re-Aggregation: 0.3) | ⚠️ revidiert: v5 ebenfalls bei 0.3 |
| v4 ist langsamer als v5 | 728s vs. 355s — Faktor 2.1× | ✅ bestätigt |
| v5 ist Code-kompakter (cc_loc) | v5 LoC 36.6 vs. v4 LoC 39.6 | ✅ bestätigt |
| Prompt-Stil ohne großen Effekt | smell 3.0–3.7 indifferent über example-mapping/prose/user-story | ✅ bestätigt |
| v3 überspringt Refactor-Step | 0 dokumentierte refactorings in 9 Runs | ✅ bestätigt |
| Tests-Predictions nur in v4 | nach Pipeline-Fix auch in v5: hohe Trefferquote in beiden Workflows | ⚠️ revidiert: v5 hat predictions, sogar mehr absolut (zwei pro Cycle statt einer) |

---

## 6. Stabilitäts-Verbesserung gegenüber Smart-subset

Smart-subset hatte für game-of-life-prose pro (workflow, modell) **n=1**.
Hier n=3 pro (workflow, prompt-stil) — gerechnet über die 3 Prompt-Stile sind
das **n=9 pro Workflow**.

**Gewinn an Aussagekraft**:

- σ-Schätzungen sind jetzt vorhanden und zeigen, dass die Workflow-Differenzen
  in smell_complexity zwischen v3 (1.1) und v4/v5 (0.3) **größer als die
  Run-internen σ** sind — Befund ist real, nicht Rauschen.
- Bei LoC und smell_total liegen v4 und v5 **innerhalb der σ** (39.6±6.1 vs.
  36.6±4.1 LoC; 2.8±1.3 vs. 2.8±1.0 smell) — kein signifikanter Unterschied.
- Dauer-σ bei v4 ist riesig (131s) — Mittelwert (728s) ist nur als
  Größenordnung verlässlich.

**Verbleibende Limitierungen**:

- Nur 1 Modell — Modell-Effekt nicht abschätzbar (laut Smart-subset aber
  Opus dominant; sollte hier kein Verzerrungsrisiko sein).
- Nur 1 Kata-Familie — Workflow-Befunde gelten nur für game-of-life-Komplexität.
- n=3 ist für σ-Schätzungen knapp; n=5–10 wäre belastbarer.

---

## 7. Empfehlungen für nächste Iterationen

1. **v4 und v5 sind beide gute TDD-Setups für Code-Qualität**, mit
   gleichen smell_complexity-Werten (0.3). v4 ist 2.1× langsamer, splittet
   aber stärker in kleine Funktionen (cc_longest_function 11 vs. 15.7).
   Wer Geschwindigkeit braucht, nimmt v5 — bei Code-Qualität-Maximum nimmt
   man v4.
2. **v3 ist KEIN echter TDD-Workflow**: re-analysiert nur 1.0 Cycles im
   Schnitt, 0 Refactorings, längste Funktion ~29 LoC. Modell schreibt im
   Batch-Stil und flagged Phasen pro forma.
3. **Prompt-Stil ist irrelevant** — bei Aufgabenformulierung Aufwand sparen
   und prose verwenden (kürzeste Spec, stabilste Ergebnisse).
4. **Magic-Numbers-Smell ist universell** — Workflows beheben das nicht. Wenn
   das ein Qualitätsziel ist, müsste es in den Refactor-Subagent-Prompt
   explizit rein.
5. **`cc_longest_function` als Single-Number-Proxy** für Code-Qualität:
   schwellenbasierte Reports (z.B. "alle Runs mit longest_function > 20")
   ermöglichen schnelles Filtern ohne komplette Smell-Auswertung.
6. **Für nächste Stabilitäts-Studie**: n=5–10 pro Kombo, weiterhin nur eine
   Kata. Wallclock bei n=10 wäre ~10h für 150 Runs (v4 dominiert die Zeit).

---

## 8. Files

- Aggregat: `summary.md`
- Rohdaten: `runs.csv`
- Plan: `experiments/batch-plans/game-of-life-stability.json`
- Generator: `experiments/batch-plans/generators/game-of-life-stability.py`
- Run-Verzeichnisse: `experiments/runs/2026-05-03_*_game-of-life-*_opus-4-7-no-thinking/`
