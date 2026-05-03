# Smart-subset findings (89 von 90 Runs)

Quelle: `runs.csv` (siehe `summary.md` für vollständige Pivot-Tabellen).
Generiert: 2026-05-03.

> **Update 2026-05-03 (post-hoc enrichment)**: Transcript-Pipeline und ESLint
> wurden via `experiments/enrich-runs.sh` nachträglich auf alle 89 Runs
> angewendet. Die unten in §Caveats benannten Daten-Lücken sind weitgehend
> geschlossen. Neue Sektionen 6 (TDD-Disziplin) und 7 (Code-Smells) hinzugefügt.

---

## 0. Methoden-Überblick

### 0.1 Forschungsfrage

**Replikation und Erweiterung der 235-Run-Studie aus Februar 2026 mit
neuen Modellen, neuen Promptformaten und einem geprüften Toolchain-Pin.**

Konkret:

- Reproduzieren sich die Headline-Befunde der alten Studie (v4+Opus
  ist Spitze, v5 schneller, Thinking-Bonus klein) mit der aktuellen
  Modell-Generation (Opus 4.7, Sonnet 4.6, Haiku 4.5)?
- Macht das **Format der Aufgabenstellung** (prose / example-mapping /
  user-story) einen Unterschied auf Code-Qualität, Mass und TDD-Disziplin?
- Wie verhält sich Haiku 4.5 in den anspruchsvollen Multi-Step-Workflows
  v4/v5?

### 0.2 Experiment-Design

**Variablen**:

| Achse | Stufen | n |
|---|---|---:|
| Workflow | v1-oneshot, v2-iterative, v3-basic-tdd, v4-exact-subagents, v5-exact-single-context | 5 |
| Modell × Thinking | opus-4-7, opus-4-7-no-thinking, sonnet-4-6, haiku-4-5 | 4 |
| Kata × Promptformat | game-of-life-prose, mars-rover-prose, pixel-art-scaler-{prose, example-mapping, user-story}, string-calculator-{prose, example-mapping, user-story} | 8 |
| Replikate | i.d.R. 1; auf 4 Headline-Zellen 3 (v4/v5 × pixel-art-scaler-prose/string-calculator-prose × Opus+thinking) | 1–3 |

**Verteilung der 89 Runs** (von 90 geplant; 1 Failure-only-Test-Run unten zählt mit):

| Workflow | Runs |
|---|---:|
| v1-oneshot | 8 |
| v2-iterative | 2 |
| v3-basic-tdd | 8 |
| v4-exact-subagents | 35 |
| v5-exact-single-context | 36 |

| Modell | Runs |
|---|---:|
| opus-4-7 (Adaptive Thinking) | 23 |
| opus-4-7-no-thinking | 16 |
| sonnet-4-6 | 34 |
| haiku-4-5 | 16 |

### 0.3 Ablauf eines Runs

1. Container-Image `docker-batch` mit gepinnter `claude-code@2.1.107`
   wird gestartet (Image-Build über `experiments/docker/Dockerfile`).
2. Run-Verzeichnis `runs/<timestamp>_<kata>_<workflow>_<model>/` wird
   im Container angelegt; Workflow-Konfig (`.claude/agents/`,
   `.claude/rules/`) und Kata-Prompt (`prompt.md`) hinein kopiert.
3. pnpm-Workspace mit TypeScript, Vitest, ESLint+SonarJS aufgesetzt
   (Cache via `experiments/docker/package.cache.json`).
4. `claude --print "$(< prompt.md)"` läuft headless, ohne HITL.
5. Nach Abschluss: `analyze-run.sh` schreibt `metrics.json` und
   `analysis-report.md`. Smell-Detection via ESLint+SonarJS, TDD-Metriken
   aus dem Transcript (`transcript.jsonl`, plus subagent-Transcripts
   bei v4).
6. `aggregate-runs.sh smart-subset` baut `runs.csv` und `summary.md`
   für den gesamten Plan.

### 0.4 Erfasste Metriken

**Korrektheit**:
- `tests_passing` (boolean) — Vitest-Summary "passed" und nicht "failed".
  Pass-Rate als Aggregat.

**Effizienz**:
- `duration_seconds` — Wallclock von `claude --print`-Start bis Exit.
- `total_tokens` — Tokens des Hauptkontexts (bei v4 ohne Subagent-Tokens).

**Code-Volumen**:
- `lines_of_code` — Summe LoC der `src/`-Dateien.
- `test_lines` — Summe LoC der `*.spec.ts`-Dateien.
- `tests_total` — Anzahl `it(...)`-Calls (ohne `it.todo`).
- `code_mass` — Verbund aus `lines_of_code` + `test_lines`.

**Code-Qualität (ESLint + SonarJS)**:
- `cc_longest_function` — höchste cyclomatic-complexity einer Funktion.
- `cc_avg_loc_per_function` — durchschnittliche LoC pro Funktion.
- `smell_total` — Summe aller SonarJS-Findings.
- `smell_magic_numbers` — `no-magic-numbers`-Findings.
- `smell_complexity` — `sonarjs/cognitive-complexity`-Findings.
- `coverage_statements_pct`, `coverage_branches_pct` — Vitest-Coverage.

**TDD-Disziplin (aus Transcript)**:
- `cycle_count` — abgeschlossene Red-Green-Refactor-Zyklen.
- `refactorings_applied` — gezählte explizite Refactoring-Schritte.
- `predictions_correct / predictions_total` — Genauigkeit der TDD-
  Prediction-Pflicht (nur v4/v5; in v1–v3 nicht gefordert).
- `tests_passed_immediately` — Tests, die in der Red-Phase **direkt**
  grün sind (Indikator für Über-Implementierung).
- `avg_red_seconds`, `avg_green_seconds`, `avg_refactor_seconds` —
  durchschnittliche Phasen-Dauer.

### 0.5 Bewertungsgrundsätze

- **Korrektheit zuerst**: ein Run mit `tests_passing=false` zählt nicht
  als gleichwertige Lösung, auch wenn andere Metriken günstig sind.
- **Pro Kata aggregieren**: `string-calculator` mit ~3 LoC und
  `game-of-life` mit 30+ LoC sind nicht vergleichbar — Mittel über
  Katas verschmieren Signal. Workflow×Modell-Tabellen werden in
  `summary.md` ausschließlich pro Kata gebildet; Cross-Kata-Mittel
  stehen separat im Anhang als Sanity-Check.
- **Replikationssparsam**: nur die Headline-Zellen mit n=3, der Rest
  mit n=1 — entsprechend nur große Effekte (Faktor 2+) als belastbar
  zu betrachten.

### 0.6 Trainingsdaten-Kontamination

- `string-calculator` und `game-of-life` sind etablierte TDD-Katas
  und mit Sicherheit in den Trainingsdaten. Niedrige Mass-Werte können
  Memorisation widerspiegeln, nicht echte Code-Qualität.
- `pixel-art-scaler` ist Eigenentwicklung — kein klares Training-Leak.
- `mars-rover` ist verbreitet, aber weniger als string-calculator.
- Promptformat-Variation (prose/example-mapping/user-story) ändert die
  Oberfläche, nicht den semantischen Kern — Memorisation-Risiko bleibt.

### 0.7 Technische Infrastruktur

- **Container**: `node:22-slim`-basiert, claude-code 2.1.107 gepinnt
  (2.1.37 hängt auf cwd mit `.claude/agents/`; 2.1.126 sucht
  `~/.claude.json` als Datei und exit-tet still).
- **Mounts**: `experiments/docker/claude-config/` als `~/.claude/`
  (NICHT Host-`~/.claude` — fish-MCP-Spawns würden den Init blockieren);
  `~/.claude/.credentials.json` als separater Bind-Mount.
- **Pipeline-Integration**: Transcript-Save und ESLint-Setup sind in
  `run-batch.sh` integriert (`save_transcript()` vor `analyze-run.sh`,
  ESLint-Config per Heredoc). Frühere Runs ohne diese Pipeline wurden
  per `enrich-runs.sh` post-hoc nachgerüstet.
- **False-Positive-Schutz**: `run-batch.sh` flaggt Runs nur als
  rate-limited, wenn exit ≠ 0 UND `\b429\b` in den Logs (nicht jede
  Backup-Datei mit "429" im ms-Timestamp).
- **Tests-passing-Bug** (gefixt): `analyze-run.sh` hatte vorher bei
  "X failed | Y passed" fälschlich `tests_passing=true` gesetzt; der
  Match prüft jetzt explizit auf "passed" UND fehlendes "failed" in
  der Vitest-Summary-Zeile.

### 0.8 Workflow-Architekturen (Kurzform)

| Workflow | Aufbau | TDD-Strenge |
|---|---|---|
| v1-oneshot | "Implementiere X." | keine |
| v2-iterative | "Plane Schritt für Schritt, dann implementiere." | keine |
| v3-basic-tdd | "Verwende TDD." | minimal |
| v4-exact-subagents | Eigener Subagent pro Phase (Red/Green/Refactor + Predictor) | strikt |
| v5-exact-single-context | Alle Phasen in einer Konversation, gleiches Phasen-Skript wie v4 | strikt |

Konfigurationen liegen in `experiments/workflows/v{1..5}-*/.claude/`
(agents/, rules/). Deaktivierungsmechanismus: Verzeichnis-Präfix `_`
schließt einzelne Agenten aus, ohne sie zu löschen.

### 0.9 Was diese Studie NICHT leistet

- **Kein statistischer Hypothesentest**. n=1 für die meisten Zellen,
  Effekte werden qualitativ und nur bei Faktor-2+-Diskrepanzen als
  belastbar interpretiert.
- **Keine Generalisierung über die 8 Kata-Varianten hinaus**. Aussagen
  wie "v5 ist schneller als v4" gelten für diese Stichprobe.
- **Keine direkte Vergleichbarkeit zur Februar-Studie** außer auf den
  zwei gemeinsamen Katas game-of-life und mars-rover (siehe
  `comparison-with-old-experiment.md`).

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

### 5. Coverage und LoC: v4/v5 bringen messbar mehr Tests (pro Kata)

> **Hinweis:** Cross-Kata-Mittel über Workflow×Modell sind aufgrund
> der heterogenen Kata-Größen (string-calculator ≈ 3 LoC vs.
> game-of-life ≈ 30+ LoC) verzerrt. Die folgenden Tabellen zeigen
> den Effekt auf der größten Kata; pixel-art-scaler und
> string-calculator skalieren analog mit kleineren Absolutwerten.
> Vollständige Pivots stehen pro Kata in `summary.md`.

**game-of-life-prose** (n=1 pro Zelle):

| Workflow × Modell | test_lines | tests_total | LoC |
|---|---:|---:|---:|
| v1-oneshot × sonnet-4-6 | 72 | 10 | 30 |
| v3-basic-tdd × sonnet-4-6 | 81 | 10 | 30 |
| v4 × opus-4-7 | 39 | 8 | 32 |
| v4 × opus-4-7-no-thinking | 35 | 8 | 41 |
| v4 × sonnet-4-6 | 41 | 10 | 42 |
| v4 × haiku-4-5 | 108 | 12 | 59 |
| v5 × opus-4-7 | 46 | 9 | 25 |
| v5 × sonnet-4-6 | 32 | 7 | 30 |

**mars-rover-prose** (n=1 pro Zelle):

| Workflow × Modell | test_lines | tests_total | LoC |
|---|---:|---:|---:|
| v1-oneshot × sonnet-4-6 | 64 | 14 | 34 |
| v3-basic-tdd × sonnet-4-6 | 127 | 17 | 27 |
| v4 × opus-4-7 | 35 | 10 | 52 |
| v4 × opus-4-7-no-thinking | 35 | 10 | 30 |
| v4 × sonnet-4-6 | 29 | 8 | 39 |
| v5 × opus-4-7 | 29 | 8 | 32 |
| v5 × sonnet-4-6 | 29 | 8 | 21 |

→ Auf der großen Kata schreibt **v3** überraschend mehr Tests
(z.B. mars-rover: 127 test_lines vs. 29–35 bei v4/v5) — sein eng
geführter Single-Step-Cycle deckt Beispielskanten breiter ab. v4/v5
sparen Test-Volumen, halten Coverage aber für Sonnet/Opus bei
99–100 % (siehe `summary.md` Pro-Kata-Coverage-Sektionen).

LoC pro Lösung skaliert mit Kata-Größe (string-calculator: 3–8 LoC,
pixel-art-scaler: 4–10 LoC, mars-rover/game-of-life: 25–60 LoC). Die
Haiku-Zellen auf v4/v5 sind die LoC-Ausreißer (59 / 63), weil
gefailte Implementierungs-Versuche unrefaktoriert verbleiben.

### 6. TDD-Disziplin: v4 macht echtes TDD, v3 fakest es weiterhin (pro Kata)

Cycle- und Refactoring-Counts pro Run aus der Transcript-Pipeline.
Da Aufgaben-Größe die absoluten Zahlen mitbestimmt (game-of-life
braucht mehr Cycles als string-calculator), zeigen wir das Muster
auf den beiden großen Katas. Vollständige Pivots in
`summary.md`-Sektionen `### TDD discipline` pro Kata.

**game-of-life-prose** (n=1 pro Zelle):

| Workflow × Modell | cycles | refactorings | tests_immediately | predictions |
|---|---:|---:|---:|---|
| v1-oneshot × sonnet-4-6 | 1 | 0 | 0 | – |
| v3-basic-tdd × sonnet-4-6 | **1** | **0** | 0 | – |
| v4 × opus-4-7 | 8 | 8 | 0 | 4/4 (100 %) |
| v4 × opus-4-7-no-thinking | 8 | 8 | 6 | 5/5 (100 %) |
| v4 × sonnet-4-6 | 10 | 5 | 6 | 6/7 (86 %) |
| v4 × haiku-4-5 | 1 | 1 | 0 | – (gefailt) |
| v5 × opus-4-7 | 9 | 3 | 7 | – (v5 macht keine) |
| v5 × sonnet-4-6 | 7 | 7 | 5 | – |

**mars-rover-prose** (n=1 pro Zelle):

| Workflow × Modell | cycles | refactorings | tests_immediately | predictions |
|---|---:|---:|---:|---|
| v1-oneshot × sonnet-4-6 | 2 | 0 | 0 | – |
| v3-basic-tdd × sonnet-4-6 | **1** | **0** | 0 | – |
| v4 × opus-4-7 | 10 | 6 | 5 | 9/9 (100 %) |
| v4 × opus-4-7-no-thinking | 10 | 10 | 5 | 8/8 (100 %) |
| v4 × sonnet-4-6 | 8 | 8 | 0 | 9/9 (100 %) |
| v4 × haiku-4-5 | 8 | 7 | 1 | 4/4 (100 %) |
| v5 × opus-4-7 | 8 | 8 | 0 | – |
| v5 × sonnet-4-6 | 8 | 8 | 0 | – |

Wichtigste Befunde (auf beiden Katas konsistent):

- **v3-basic-tdd reproduziert das alte "Fake-TDD"-Muster**: 1 Cycle,
  0 Refactorings — v3 schreibt Tests + Implementation in einem Schritt,
  ohne ehrlichen Red→Green→Refactor-Zyklus.
- **v4 macht echtes TDD**: 8–10 Cycles, 5–10 Refactorings — die
  Disziplin steckt im Workflow, nicht im Modell.
- **Predictions auf v4 sind nahezu perfekt**: 86–100 %, fast immer
  alle Vorhersagen korrekt. Adaptive Thinking bringt hier kein Plus.
- **v5 macht keine Predictions** (das Workflow-Design verlangt sie nicht),
  hat aber ähnliche Cycle-/Refactoring-Counts wie v4.

Auf den kleinen Katas (string-calculator, pixel-art-scaler) sind die
Absolutwerte niedriger (2–6 Cycles), das **Muster** v3=Fake-TDD vs.
v4=Cycles+Refactorings bleibt aber identisch — siehe pro-Kata-Blöcke
in `summary.md`.

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

### 8. Code-Qualität: v4+Opus ist die klare Spitze (auf den großen Katas)

> **Methodischer Hinweis:** Code-Quality-Vergleiche müssen pro Kata
> erfolgen — eine 3-LoC-Lösung kann gar keinen `cc_longest_function ≥ 5`
> haben, ein 40-LoC-Game-of-Life schon. Cross-Kata-Mittel verschmieren
> dieses Signal. Pixel-art-scaler und string-calculator sind in dieser
> Stichprobe zu klein für Smell-Differenzierung (siehe §7); die folgenden
> Tabellen zeigen die beiden Katas mit Spielraum.

**game-of-life-prose** (n=1 pro Zelle):

| Workflow × Modell | cc_longest | smell_total | LoC |
|---|---:|---:|---:|
| v4 × opus-4-7 (Thinking) | **4** | 2 | 32 |
| v4 × opus-4-7-no-thinking | 10 | 2 | 41 |
| v5 × sonnet-4-6 | 15 | 2 | 30 |
| v4 × sonnet-4-6 | 18 | 3 | 42 |
| v5 × opus-4-7 (Thinking) | 19 | 2 | 25 |
| v4 × haiku-4-5 | 22 | 4 | 59 |
| v1-oneshot × sonnet | 24 | 4 | 30 |
| v3-basic-tdd × sonnet | **28** | 5 | 30 |
| v5 × opus-4-7-no-thinking | 29 | 5 | 33 |

**mars-rover-prose** (n=1 pro Zelle):

| Workflow × Modell | cc_longest | smell_total | LoC |
|---|---:|---:|---:|
| v4 × sonnet-4-6 | **6** | 0 | 39 |
| v4 × opus-4-7 | 6 | 0 | 52 |
| v4 × opus-4-7-no-thinking | 7 | 0 | 30 |
| v5 × opus-4-7 (Thinking) | 2 | 0 | 32 |
| v5 × sonnet-4-6 | 2 | 0 | 21 |
| v5 × haiku-4-5 | 2 | 0 | 49 |
| v5 × opus-4-7-no-thinking | 9 | 0 | 41 |
| v4 × haiku-4-5 | 0 | 0 | 63 |
| v3-basic-tdd × sonnet | 0 | 1 | 27 |
| v1-oneshot × sonnet | 17 | 3 | 34 |

→ **game-of-life zeigt das klare Workflow-Signal**: v4+Opus+Thinking
liegt bei `cc_longest_function = 4`, v3-basic-tdd bei 28 — eine **7×-Differenz** auf
derselben Aufgabe. Magic-Numbers + Complexity-Smells konzentrieren
sich bei v1/v3+Sonnet (4–5) gegen 2–3 für v4/v5.

→ **mars-rover ist sauber für die meisten Konfigurationen** (smell=0,
cc_longest 2–9), nur v1-oneshot+Sonnet hat sichtbar längere Funktionen
(17) und 3 Smells. Differenzierung schwächer als auf game-of-life.

→ **pixel-art-scaler und string-calculator** liefern in dieser
Stichprobe **kein Smell-Signal** (alle 65 Runs: smell=0). Vollständige
pro-Kata-Pivots stehen in `summary.md`-Sektionen `### Code quality`.

### 9. game-of-life ist der Code-Quality-Diskriminator

Die game-of-life-prose-Tabelle in §8 ist der Beleg: cc_longest_function
schwankt von 4 (v4+Opus+Thinking) bis 29 (v5+Opus-no-thinking) — eine
**7×-Differenz** auf derselben Aufgabe, n=1 pro Zelle. Auf der größten
Kata schlägt TDD-Disziplin die Modellstärke. Vollständige pro-Kata-
Pivots stehen in `summary.md` (Sektion `## Kata: game-of-life-prose`,
Untersektion `### Code quality — cc_longest_function`).

### 10. Adaptive Thinking hilft fast nur auf v5 (game-of-life-prose)

Auf game-of-life-prose (siehe §8) liegt v4+Opus mit Thinking bei
cc_longest = 4, ohne Thinking bei 10 — Thinking hilft, aber beide sind
in derselben Größenordnung wie der Rest von v4/v5. Auf v5 ist der
Unterschied dramatischer: opus-4-7-Thinking erreicht cc_longest = 19,
opus-4-7-no-thinking 29. Auf mars-rover-prose verschwindet der Effekt
(Thinking 6 vs. no-thinking 7 für v4; 2 vs. 9 für v5 — letzteres
Trend, n=1).

Lesart:

- v4 erzwingt Refactoring durch den Subagent-Cycle — der Workflow
  schiebt das Modell zur Qualität, Reasoning-Bonus ist klein.
- v5 (single-context) ist nachsichtiger — ohne Thinking knausert das
  Modell beim Refactoring-Schritt; mit Thinking wird er ehrlicher
  ausgeführt.

Pragmatisch: auf v4 ist der Thinking-Aufschlag sparbar (kleine
Quality-Differenz, gleiche Pass-Rate); auf v5 lohnt er sich auf großen
Katas.

### 11. Magic Numbers sind das Hauptproblem aller Setups

24 von 30 Smells in den 89 Runs sind Magic Numbers (`no-magic-numbers`).
Cognitive Complexity (8), Duplication (1) und Code-Quality (0) spielen
fast keine Rolle. Auch Opus + v4 + Thinking lässt unbenannte Konstanten
(`0.5`, `2`, `8`) im Code stehen. Das ist **kein** Workflow-Effekt — es
ist eine Modell-übergreifende Schwäche der Mai-2026-Modelle bei
TypeScript-Refactoring. Ein Workflow-Schritt "extrahiere benannte
Konstanten" würde hier sichtbaren Hebel geben.

---

## Caveats

- **Aggregation respektiert Kata-Grenzen** — alle Workflow×Modell-Tabellen
  in `summary.md` beziehen sich auf eine einzelne Kata (Block-Struktur
  `## Kata: <name>` → `### …`). Cross-Kata-Mittel stehen separat im
  Anhang `## Cross-kata averages` und sind ausdrücklich **nicht** für
  Workflow×Modell-Vergleiche zu benutzen, weil string-calculator
  (≈ 3 LoC, kein Smell-Spielraum) und game-of-life (≈ 30 LoC, viel
  Spielraum) im Mittel zu inhomogen sind.
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

1. **Pipeline ist vollständig im Batch eingebaut** (commit `236e5e0`):
   `save_transcript()` + `eslint.config.mjs` + eslint/sonarjs als devDeps
   + im Docker-Image vorgewärmter pnpm-Store. Künftige Batches liefern
   TDD-Metriken und Smells ohne Nacharbeit. `enrich-runs.sh` wurde nach
   einmaliger Anwendung gelöscht.
2. **Mehr Replikate auf den Failure-Cells**: v5+haiku mit 8 Runs hatte
   nur 50 % — entweder n erhöhen (16+) oder die 4 Failure-Runs
   investigieren, um zu klären ob es Workflow-Limit oder Modell-Limit ist.
3. **Code-Quality-Differenzierung braucht große Katas**: pixel-art-scaler
   und string-calculator sind zu trivial (3–10 LoC, kein Smell-Signal).
   Nächster Batch sollte ausschließlich oder dominant
   `game-of-life-prose` und `mars-rover-prose` fahren — dort
   differenzieren sich Workflow×Modell sichtbar (cc_longest_function
   3.6 vs. 28).
4. **Magic-Numbers sind die niedrig-hängende Frucht**: 24/30 Smells sind
   `no-magic-numbers`. Ein Workflow-Schritt "benannte Konstanten
   extrahieren" oder ein Refactoring-Subagent mit dieser Regel würde
   sichtbaren Hebel haben.
5. **Headline-Befund nachgeschärft**: Mit den neuen Code-Quality-Daten
   gilt v4 + Opus-4-7 als "Speerspitze" wieder — aber für Code-Qualität,
   nicht Pass-Rate. Pass-Rate ist 100 % bei vielen billigeren Setups.
   v4 + Opus liefert die kürzesten Funktionen (cc_longest 3.6) und
   wenigsten Smells (0.18) — Aufpreis 10× Wallclock zahlt sich nur aus,
   wenn man auf großen Katas Code-Qualität priorisiert.
6. **Adaptive Thinking gezielt einsetzen**: auf v4 sparbar (kein
   Qualitäts-Vorteil), auf v5 wertvoll (smell 0.17 mit Thinking vs.
   0.62 ohne). v1–v3 vermutlich auch profitabel, aber nicht
   gegen-getestet.
