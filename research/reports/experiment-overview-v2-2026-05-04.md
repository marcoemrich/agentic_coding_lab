# Experiment-Overview: TDD-Workflows × Modelle × Prompt-Stile

Stand: 2026-05-03. Datenbasis: `experiments/runs/` (137 Runs, davon 89
smart-subset, 33 game-of-life-stability, 15 game-of-life-fair).

---

## 1. Forschungsfrage

Wie wirkt sich der **Workflow** (Stil und Strenge der TDD-Vorschrift), das
**Modell** (Opus 4.7, Sonnet 4.6, Haiku 4.5) und der **Prompt-Stil**
(prose / example-mapping / user-story) auf

- Korrektheit (Tests-passing-Rate),
- Code-Volumen (LoC, mass = LoC + test_lines),
- Code-Qualität (SonarJS smell_total, smell_complexity, cc_longest_function),
- TDD-Disziplin (Cycles, Refactorings, Predictions, sofort-grüne Tests) und
- Effizienz (Wallclock-Dauer)

aus, wenn ein einzelner Claude-Code-Agent eine TypeScript-Kata implementiert?

---

## 2. Experiment-Design

### 2.1 Variablen

**Workflow** — fünf Klassen mit zunehmender TDD-Strenge:

| Workflow | Aufbau | TDD-Strenge |
|---|---|---|
| v1-oneshot              | "Implementiere X." | keine |
| v2-iterative            | "Plane Schritt für Schritt, dann implementiere." | keine |
| v3-basic-tdd            | "Verwende TDD." | minimal (Self-Reporting) |
| v4-exact-subagents      | Eigener Subagent pro Phase (Predictor + Red/Green/Refactor) | strikt, multi-context |
| v5-exact-single-context | Alle Phasen in einer Konversation, gleiches Phasen-Skript | strikt, single-context |

Konfiguration: `experiments/workflows/v{1..5}-*/.claude/agents/` und
`.claude/rules/`.

**Modell × Thinking**:

| Modell-ID | Thinking | Repr. Vorkommen |
|---|---|---|
| `claude-opus-4-7` | Adaptive | smart-subset (n=23 Runs) |
| `claude-opus-4-7-no-thinking` | aus | smart-subset, stability, fair |
| `claude-sonnet-4-6` | Extended | smart-subset (n=34 Runs) |
| `claude-haiku-4-5-20251001` | Extended | smart-subset (n=16 Runs) |

**Kata × Prompt-Stil**:

| Kata | Prompt-Stile | Komplexität |
|---|---|---|
| string-calculator | prose, example-mapping, user-story | trivial (~3 LoC) |
| pixel-art-scaler  | prose, example-mapping, user-story | klein (~5 LoC, Eigenentwicklung) |
| mars-rover        | prose | mittel (~30 LoC) |
| game-of-life      | prose, example-mapping, user-story | groß (~40 LoC) |

Prompt-Stile:
- **prose**: Beschreibung der Regeln in Prosa, keine Test-Beispiele.
- **example-mapping**: Regel + 1–3 konkrete Input/Output-Beispiele pro Regel.
- **user-story**: "Als X möchte ich Y, damit Z" — Beschreibung ohne Beispiele.

### 2.2 Workflow → Prompt-Mapping

Wegen Methoden-Symmetrie:

| Workflow | erlaubte Prompt-Stile | Begründung |
|---|---|---|
| v1, v2 | nur prose | Test-Beispiele in example-mapping wären für Non-TDD-Workflows ein verstecktes Test-Geschenk → unfair gegenüber den TDD-Workflows. |
| v3, v4, v5 | alle drei | Beispiele dienen als natürliche Test-Cases — für TDD-Workflows ist das das Idealbild der Aufgabe. |

### 2.3 Replikation

| Studien-Block | Runs | Hauptzweck |
|---|---:|---|
| smart-subset | 89 | Modell- und Prompt-Stil-Vergleich; n=1 pro Zelle, n=3 auf 4 Headline-Zellen |
| game-of-life-stability | 33 | σ-Schätzung pro Workflow×Prompt-Zelle auf der einzigen Quality-differenzierenden Kata; n=3 |
| game-of-life-fair | 15 | Fairer Workflow-Vergleich mit korrektem Workflow→Prompt-Match; n=3, single-model |

Total: 137 Runs.

---

## 3. Methodik

### 3.1 Run-Pipeline

1. Container-Image `docker-batch` (Node 22 slim, claude-code 2.1.107 gepinnt)
   wird gestartet.
2. Run-Dir `runs/<timestamp>_<kata>_<workflow>_<model>/` wird angelegt;
   Workflow-Konfig (`.claude/agents/`, `.claude/rules/`) und Kata-Prompt
   (`prompt.md`) hinein kopiert.
3. pnpm-Workspace mit TypeScript, Vitest, ESLint+SonarJS aufgesetzt
   (Cache via `experiments/docker/package.cache.json`).
4. `claude --print "$(< prompt.md)"` läuft headless, ohne HITL.
5. `analyze-run.sh` schreibt `metrics.json` und `analysis-report.md`.
   Smell-Detection via ESLint+SonarJS, TDD-Metriken aus `transcript.jsonl`
   (plus subagent-Transcripts bei v4).
6. `aggregate-runs.sh <plan>` baut `runs.csv` und `summary.md`.

### 3.2 Erfasste Metriken

**Korrektheit**:
- `tests_passing` — Vitest-Summary-Match: "passed" und nicht "failed" in der
  Summary-Zeile (`^\s*Tests\s+`).

**Effizienz**:
- `duration_seconds` — Wallclock von `claude --print`-Start bis Exit.
- `total_tokens` — Tokens des Hauptkontexts (bei v4 ohne Subagent-Tokens;
  Subagent-Tokens werden separat in `transcript-subagents/` gehalten).
- `context_utilization_pct` — % des Modell-Kontextfensters im längsten Turn.

**Code-Volumen**:
- `lines_of_code` — Summe LoC der `src/`-Dateien (ohne tests).
- `test_lines` — Summe LoC der `*.spec.ts`-Dateien.
- `tests_total` — Anzahl `it(...)`-Calls (ohne `it.todo`).
- `code_mass` — `lines_of_code + test_lines`.

**Code-Qualität (ESLint + SonarJS)**:
- `cc_loc`, `cc_functions`, `cc_longest_function`, `cc_avg_loc_per_function` —
  pro `src/`-Datei zusammengezählt.
- `smell_total` — Summe aller SonarJS-Findings.
- `smell_magic_numbers` — Verstöße gegen `no-magic-numbers`.
- `smell_complexity` — Verstöße gegen `sonarjs/cognitive-complexity`.
- `smell_duplication`, `smell_code_quality` — weitere SonarJS-Klassen.
- `coverage_statements_pct`, `coverage_branches_pct`.

**TDD-Disziplin (aus Transcript)**:
- `cycle_count` — abgeschlossene Red-Green-Refactor-Zyklen.
- `refactorings_applied` — explizite Refactoring-Schritte.
- `predictions_correct / predictions_total` — Trefferquote der
  Test-Predictions (in v4 und v5 vom Workflow eingefordert).
- `tests_passed_immediately` — Tests, die in der Red-Phase direkt grün sind.
- `avg_red_seconds`, `avg_green_seconds`, `avg_refactor_seconds` —
  durchschnittliche Phasen-Dauer.

### 3.3 Bewertungsgrundsätze

- **Korrektheit zuerst**: ein Run mit `tests_passing=false` zählt nicht als
  gleichwertige Lösung.
- **Pro Kata aggregieren**: string-calculator (~3 LoC) und game-of-life
  (~40 LoC) sind nicht vergleichbar. Workflow×Modell-Tabellen werden
  ausschließlich pro Kata gebildet; Cross-Kata-Mittel stehen nur als
  Sanity-Check im Anhang von `summary.md`.
- **Effekt-Schwelle**: Bei n=1 pro Zelle gelten nur Differenzen mit Faktor
  ≥ 2 oder klar getrennten σ-Bändern als belastbar.

### 3.4 Was diese Daten NICHT leisten

- **Keine statistischen Hypothesentests**. n=3 pro Zelle ist die obere
  Replikationsgrenze.
- **Keine Generalisierung über die 4 Katas hinaus**. Aussagen wie
  "v5 ist Code-kompakter als v4" gelten für game-of-life und tendenziell
  für mars-rover; auf trivialen Katas (~5 LoC) entfällt das Signal.
- **Keine Modell-Coverage außerhalb von Anthropic-Modellen**.
- **Keine produktiven Aufgaben**, nur synthetische Katas.

---

## 4. Ergebnisse

### 4.1 Workflow-Effekt auf Code-Qualität (game-of-life-fair, n=3, opus-4-7-no-thinking)

| Workflow | Prompt | LoC μ | mass μ | smell_total μ | smell_complexity μ | dur μ (s) |
|---|---|---:|---:|---:|---:|---:|
| v1-oneshot | prose | 41.0 | 163.7 | 4.0 | 1.3 | 48.7 |
| v2-iterative | prose | 42.7 | 165.0 | 5.3 | 1.3 | 53.7 |
| v3-basic-tdd | example-mapping | 40.3 | 159.0 | 4.0 | 1.3 | 49.7 |
| **v4-exact-subagents** | example-mapping | 41.0 | 183.0 | **2.7** | **0.0** | **686.3** |
| **v5-exact-single-context** | example-mapping | **35.7** | **151.3** | **2.3** | **0.0** | 353.3 |

**Befunde**:

- **smell_complexity ist die TDD-Workflow-diskriminierende Metrik**: v4 und
  v5 erreichen 0.0; v1, v2 und v3 alle 1.3. Echte Refactor-Phasen
  (Subagent in v4, Skill-Step in v5) eliminieren `cognitive-complexity`-
  Verstöße. v3 ("nur TDD sagen") tut das nicht.
- **v3 produziert keine Refactorings** (0 in allen 3 Runs); 1 Cycle pro
  Run; 0/0 Predictions. Das Modell schreibt im Batch-Stil.
- **v5 ist die kompakteste Lösung** (LoC 35.7, mass 151.3). v4 produziert
  trotz besser strukturierter Funktionen mehr LoC und mass.
- **v2 hat den höchsten smell_total** (5.3) — getrieben primär durch
  smell_magic_numbers (3.0).

### 4.2 Workflow-Stabilität (game-of-life-stability, n=9 für v3/v4/v5 über 3 Prompt-Stile)

| Workflow | n | LoC μ±σ | smell_total μ±σ | smell_complexity μ±σ | dur μ±σ (s) | refac μ |
|---|---:|---:|---:|---:|---:|---:|
| v1-oneshot              | 3 (prose)   | 41.0±3.6 | 4.0±2.0 | 1.3±1.2 | 49±3    | 0.0 |
| v2-iterative            | 3 (prose)   | 42.7±2.5 | 5.3±0.6 | 1.3±0.6 | 54±8    | 0.0 |
| v3-basic-tdd            | 9 (3 Stile) | 40.7±7.4 | 4.1±1.7 | 1.1±0.9 | 49±4    | 0.0 |
| **v4-exact-subagents**  | 9 (3 Stile) | 39.6±6.1 | 2.8±1.3 | 0.3±1.0 | 728±131 | **5.1** |
| v5-exact-single-context | 9 (3 Stile) | 36.6±4.1 | 2.8±1.0 | 0.3±1.0 | 355±57  | **7.0** |

**Befunde**:

- σ-Bänder bestätigen das fair-Ergebnis: smell_complexity-Differenz zwischen
  v3 (1.1±0.9) und v4/v5 (0.3±1.0) ist ein realer Effekt, nicht Rauschen.
- v5 ist am stabilsten in LoC (σ ≤ 5.9 pro Zelle).
- v4-Dauer schwankt extrem (σ = 131 s); einzelne Runs zwischen 11 min und
  18 min — der Subagent-Loop läuft je nach Komplexitäts-Vorhersage
  unterschiedlich oft.

### 4.3 Speed-Ranking

Aus game-of-life-fair (n=3, opus-4-7-no-thinking):

| Workflow | dur μ (s) | dur Range (s) | Faktor zu v1 |
|---|---:|---|---:|
| v1-oneshot | 48.7 | 46–51 | 1.0× |
| v3-basic-tdd | 49.7 | 47–52 | 1.0× |
| v2-iterative | 53.7 | 44–59 | 1.1× |
| v5-exact-single-context | 353.3 | 338–377 | **7.3×** |
| v4-exact-subagents | 686.3 | 659–740 | **14.1×** |

→ v4 ist 14× langsamer als v1 bei vergleichbarer LoC und nur leicht
besserer smell_total. Der Aufpreis lohnt sich nur, wenn smell_complexity
ein hartes Ziel ist (v4 = 0.0 vs. v1 = 1.3).

### 4.4 Modell-Effekt (smart-subset, game-of-life-prose, v4, n=1)

| Modell | LoC | cc_longest_function | smell_total |
|---|---:|---:|---:|
| Opus 4.7 (Adaptive Thinking) | 32 | **4** | 2 |
| Opus 4.7 no-thinking | 41 | 10 | 2 |
| Sonnet 4.6 | 42 | 18 | 3 |
| Haiku 4.5 | 59 | 22 | 4 |

→ Klare Reihenfolge **Opus < Sonnet < Haiku** in Code-Qualität. Auf der
größten Kata trennt v4 die Modelle in einem cc_longest_function-Verhältnis
von 1:5 (Opus-Thinking 4 vs. Haiku 22).

### 4.5 Modell-Reliability in Multi-Step-Workflows (smart-subset)

| Workflow × Modell | n | Pass-Rate |
|---|---:|---:|
| v4 × haiku-4-5 | 8 | **75 %** |
| v5 × haiku-4-5 | 8 | **50 %** |
| Alle anderen 9 Zellen | 73 | 100 % |

→ Haiku 4.5 hat zu wenig Reasoning-Kapazität für Multi-Step-Subagent-
Workflows. v5+haiku-Failures sind alle vom Muster "Test-Liste mit
`it.todo` geschrieben, dann Implementierungs-Schritt vergessen". v1–v3
funktionieren universell auf allen Modellen.

### 4.6 Thinking-Effekt (smart-subset, Opus-thinking vs. Opus-no-thinking)

Cross-Kata-gemittelt:

| Workflow | thinking | n | Pass-Rate | dur μ (s) |
|---|---|---:|---:|---:|
| v4 | thinking | 11 | 100 % | 549 |
| v4 | no-thinking | 8 | 100 % | 650 |
| v5 | thinking | 12 | 100 % | 245 |
| v5 | no-thinking | 8 | 100 % | 230 |

Auf game-of-life-prose konkret (n=1):

| Workflow × Variante | cc_longest_function |
|---|---:|
| v4 × opus-thinking | 4 |
| v4 × opus-no-thinking | 10 |
| v5 × opus-thinking | 19 |
| v5 × opus-no-thinking | 29 |

→ Thinking hat keinen Pass-Rate-Effekt und nur kleinen Dauer-Effekt
(±15 %). Auf Code-Qualität auf der größten Kata bringt Thinking eine
sichtbare Verbesserung — auf v4 von cc_longest 10 auf 4, auf v5 von 29 auf
19. Workflow-Druck (v4-Subagent-Pipeline) erzwingt Qualität sogar ohne
Thinking; bei v5 ist Thinking wertvoller, weil das Modell
Refactoring-Schritte sonst eher knausernd ausführt.

### 4.7 Prompt-Stil-Effekt (game-of-life-stability, v3/v4/v5, n=9 pro Stil)

| Prompt-Stil | n | LoC μ±σ | smell_total μ±σ |
|---|---:|---:|---:|
| game-of-life-example-mapping | 9 | 39.0±7.5 | 3.0±1.2 |
| game-of-life-prose           | 9 | 40.6±6.3 | 3.7±1.8 |
| game-of-life-user-story      | 9 | 37.2±4.0 | 3.0±1.3 |

→ **Kein praktisch relevanter Unterschied zwischen den drei Prompt-Stilen.**
Differenzen liegen innerhalb 1σ. Konsequenz: Aufgaben-Formulierung-Effort
spart man besser ein und nimmt den kürzesten Stil (prose).

### 4.8 TDD-Disziplin-Bänder

Aus game-of-life-fair (n=3) und game-of-life-stability (n=9):

| Workflow | cycles μ | refactorings μ | predictions correct/total | tests_immediately μ |
|---|---:|---:|---|---:|
| v1-oneshot              | 1.0 | 0.0 | 0/0      | 0.7 |
| v2-iterative            | 1.0 | 0.0 | 0/0      | 0.3 |
| v3-basic-tdd            | 1.0 | 0.0 | 0/0      | 0.0 |
| **v4-exact-subagents**  | 8.7 | 4.0 | 15/16 (94 %) | **5.7** |
| v5-exact-single-context | 8.0 | 6.7 | 47/48 (98 %) | 1.3 |

**Befunde**:

- **v3 macht systematisch genau 1 Cycle**, schreibt im Batch-Stil. v3 ist
  damit operativ kein TDD-Workflow, sondern "Test-Driven-Reporting".
- **v4 und v5 haben hohe Prediction-Trefferquoten** (94–98 %). Die Modelle
  können beim Schreiben eines Tests zuverlässig vorhersagen, ob er gleich
  rot oder grün sein wird.
- **v4 hat den höchsten "sofort-grün"-Anteil** (5.7/8.7 ≈ 65 %). Erklärung:
  generalisierende Implementierungen aus den ersten Cycles erfüllen schon
  viele spätere Tests. Konsistent damit, dass v4 auch die längsten
  Refactor-Phasen hat (≈ 42 s pro Refactor) — Refactor-Subagent extrahiert
  früh generische Helper.

### 4.9 Code-Funktion-Granularität (game-of-life-stability, n=9)

| Workflow | cc_functions μ | cc_longest_function μ | cc_avg_loc_per_function μ |
|---|---:|---:|---:|
| v1-oneshot              | 2.6 | 34.0 | 15.7 |
| v2-iterative            | 2.9 | 32.6 | 12.9 |
| v3-basic-tdd            | 2.8 | 28.7 | 12.0 |
| **v4-exact-subagents**  | **5.7** | **11.0** | **4.9** |
| v5-exact-single-context | 4.3 | 15.7 | 6.1 |

→ **v4 splittet am stärksten in kleine Funktionen** (5.7 Funktionen, längste
nur 11 LoC). v5 ist auf halbem Weg. v1/v2/v3 produzieren Monolithen
(2–3 Funktionen, längste ~30 LoC).

`cc_longest_function` ist der **brauchbarste Single-Number-Proxy** für
SonarJS-`cognitive-complexity`-Verstöße.

### 4.10 Smells nach Klasse

Aus stability+fair, gemittelt über alle Workflows:

| Smell-Klasse | Anteil aller Smells |
|---|---:|
| smell_magic_numbers | ~80 % |
| smell_complexity | ~20 % |
| smell_duplication | ~0 % |
| smell_code_quality | ~0 % |

→ **Magic Numbers sind die niedrig-hängende Frucht**. 80 % aller Smells
sind unbenannte Konstanten (z.B. `B3/S23` → `2`, `3` hardcoded; `0.5`,
`8` in pixel-art-scaler). Kein Workflow eliminiert sie systematisch — auch
v4 nicht. Ein expliziter Refactor-Schritt "extrahiere benannte Konstanten"
wäre ein einfacher Hebel.

---

## 5. Schlussfolgerungen

1. **TDD-Workflows sind nicht alle gleich.** v3 ("Verwende TDD") triggert
   beim Modell ein Self-Reporting-Verhalten, aber keine echte
   Phasen-Mechanik. Erst v4 (Subagent-Pipeline) und v5 (single-context-Skill)
   erzwingen Cycles + Refactorings + Predictions, und nur dort sinkt
   `smell_complexity` von 1.3 auf 0.0.

2. **Workflow-Wahl ist bedeutsamer als Modell-Wahl auf großen Katas.**
   Auf game-of-life trennen sich Workflows in cc_longest_function um Faktor
   2.6× (v4: 11.0 vs. v1: 34.0); Modell-Effekt unter v4 ist Faktor ~3×
   (Opus 4 vs. Haiku 22). Aber: Modell-Wahl ist entscheidend für
   **Workflow-Tauglichkeit** — Haiku 4.5 schafft v4/v5 nicht zuverlässig.

3. **v5 ist der praktische Sweet Spot.** Höchste Code-Qualität gleichauf mit
   v4 (smell_complexity 0.0; smell_total 2.3 vs. 2.7), kompakteste Lösung
   (LoC 36 vs. 41), 2× schneller als v4 (355 s vs. 686 s). Einziger v4-Vorteil:
   stärkere Funktion-Aufsplittung (cc_longest 11 vs. 16).

4. **v1-oneshot ist überraschend kompetent.** 100 % Pass-Rate auf allen
   Modellen, ~50 s Wallclock, smell_complexity 1.3 (gleichauf mit v3) und
   LoC 41 (gleichauf mit v3 und v4). Wer keine harten
   smell_complexity-Anforderungen hat, kommt mit v1 schneller und
   günstiger weiter.

5. **Adaptive Thinking ist nur bei v5 wertvoll.** Pass-Rate-Effekt = 0;
   Code-Qualitäts-Effekt klein bei v4 (Workflow erzwingt Qualität ohnehin),
   sichtbar bei v5 (cc_longest 19 vs. 29 auf game-of-life). Auf v1–v3
   nicht systematisch getestet.

6. **Prompt-Stil ist irrelevant.** prose, example-mapping und user-story
   liefern in TDD-Workflows praktisch identische Ergebnisse. Beim
   Aufgaben-Aufschreiben kann der einfachste Stil gewählt werden (prose).
   Wichtig: für Non-TDD-Workflows (v1, v2) müssen example-mapping und
   user-story-Formate **vermieden** werden, weil sie Test-Beispiele
   einschmuggeln und den Workflow-Vergleich verzerren.

7. **Code-Qualitäts-Differenzierung braucht große Katas.** string-calculator
   (~3 LoC) und pixel-art-scaler (~5 LoC) sind so trivial, dass alle Workflows
   und Modelle smell_total = 0 erreichen. Quality-Aussagen müssen auf
   game-of-life und mars-rover basieren.

---

## 6. Limitierungen

- **Nur Anthropic-Modelle** (Opus 4.7, Sonnet 4.6, Haiku 4.5).
- **Nur synthetische TDD-Katas**, keine echten Codebasen oder Brownfield-Tasks.
- **Nur TypeScript**, keine anderen Sprachen oder Test-Frameworks.
- **Headless ohne HITL** — kein realer Entwickler-Korrektur-Loop.
- **n ≤ 3 pro Zelle in der σ-belastbaren Studie (game-of-life-stability/fair)**;
  smart-subset hat n=1 für die meisten Modell×Workflow×Kata-Kombis.
- **Modell-Coverage ist asymmetrisch**: alle Workflows × Opus existieren,
  aber Sonnet/Haiku nur über smart-subset (kein n=3-Replikate-Block).
- **Single-Modell für Workflow-Stabilitätsaussage**: game-of-life-fair und
  -stability sind opus-4-7-no-thinking only — Workflow-Effekt unter
  anderen Modellen mit n=3 nicht validiert.
- **Magic Numbers dominieren das Smell-Signal**. Eine differenziertere
  Quality-Sicht würde benannte-Konstanten-Heuristiken brauchen.

---

## 7. Reproduzierbarkeit

Alle Daten und Analyse-Skripte liegen im Repo:

- `experiments/batch-plans/*.json` — Batch-Pläne
- `experiments/batch-plans/generators/*.py` — Plan-Generatoren
- `experiments/docker/Dockerfile` + `run-batch.sh` + `batch.sh` — Container-Pipeline
- `experiments/analyze-run.sh` + `analyze_transcript.py` — Run-Analyse
- `experiments/aggregate-runs.sh` — CSV/Markdown-Aggregation
- `experiments/runs/*/metrics.json` — Rohdaten pro Run
- `results/<plan>/runs.csv` + `summary.md` — Aggregat pro Plan

Container-Pin: `claude-code@2.1.107` (siehe `experiments/docker/Dockerfile`).

---

## 8. Files

| Pfad | Inhalt |
|---|---|
| `results/smart-subset/findings.md` | Modell- und Prompt-Stil-Studie (89 Runs) |
| `results/game-of-life-stability/findings.md` | Workflow-σ-Studie (33 Runs, n=3 pro Zelle) |
| `results/game-of-life-fair/summary.md` | Fairer Workflow-Vergleich (15 Runs) |
| `experiments/runs/` | Alle Run-Verzeichnisse mit Source, Transcript, Metriken |
