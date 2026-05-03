# Prompt-Stil-Vergleich: prose vs. example-mapping vs. user-story

Datenbasis: `runs.csv` (45 Runs, alle game-of-life, opus-4-7-no-thinking, 5 Workflows × 3 Stile × 3 Replikate).

Generiert: 2026-05-03.

> **Update 2026-05-03 (Re-Analyse)**: Die hier diskutierten Smell-Trends
> (smell_total, smell_complexity, smell_magic_numbers) kommen aus ESLint
> und sind vom Metriken-Pipeline-Fix (`analyze-run.sh` POSIX-awk +
> v3-Phasen-Inferenz + v5-Predictions-Regex) **nicht** betroffen — die
> Aussagen dieses Dokuments bleiben unverändert. Geänderte TDD-Metriken
> (cycle_count v3, predictions v5) siehe `findings.md` §3.

---

## 0. Die drei Prompt-Stile

| Stil | Zeilen | Form |
|---|---:|---|
| **prose** | 20 | Kurzer Fließtext: "Implementiere Conway's Game of Life mit den B3/S23-Regeln…" |
| **example-mapping** | 107 | Strukturierte Spec: Story → Rules → Examples (analog Matt-Wynne-Format) |
| **user-story** | 28 | "As a … I want … so that …"-Format mit Akzeptanzkriterien |

prose ist **5× kürzer** als example-mapping, user-story liegt dazwischen.

---

## 1. Headline-Befund: Stil-Effekt verschwindet im TDD-Loop

| Workflow-Familie | LoC-Spread (max−min) | smell-Spread |
|---|---:|---:|
| **v1-oneshot (n=3)** | **+23 LoC** (41 → 64) | +1.3 |
| v2-iterative | +6.0 | +1.0 |
| v3-basic-tdd | +6.3 | +0.3 |
| v4-exact-subagents | +6.3 | +1.0 |
| v5-exact-single-context | +4.3 | +1.3 |

**Interpretation**:

- **Bei v1-oneshot ist der Stil-Effekt riesig**: user-story produziert
  64 LoC, prose nur 41 LoC — **57% mehr Code** für dieselbe Aufgabe.
- **Bei allen TDD-Workflows (v3-v5) schrumpft der Spread auf 4-6 LoC**.
  Der TDD-Loop nivelliert die Prompt-Vorgabe — egal wie der Input
  formuliert ist, das Modell landet bei ~38-44 LoC.

→ **Prompt-Stil ist primär ein One-Shot-Hebel.** Bei iterativem TDD
verliert er weitgehend die Wirkung.

---

## 2. Tests: user-story und example-mapping treiben Test-Anzahl

Aus den n=15-Aggregaten (über alle Workflows):

| Stil | tests_total μ±σ | test_lines μ±σ |
|---|---:|---:|
| prose | 10.4±1.6 | 77.8±32.5 |
| example-mapping | 10.9±2.2 | 86.6±33.3 |
| user-story | **11.3±2.5** | **92.1±47.4** |

Auf v1-oneshot besonders deutlich:

| Stil | tests_total μ (v1) |
|---|---:|
| prose | 11.7 |
| example-mapping | 13.3 |
| **user-story** | **14.3** |

**Interpretation**: user-story und example-mapping listen explizit
Akzeptanzkriterien/Examples auf — das Modell baut für jedes 1:1 einen Test.
prose lässt offen, welche Cases zu testen sind, und das Modell wählt eine
kompaktere Test-Suite.

Bei v4/v5 löst sich auch dieser Effekt auf: 8.7 / 8.8 / 8.7 Tests — der
Subagent-Workflow hat eine eigene Vorstellung von Testumfang, unabhängig
vom Prompt-Stil.

---

## 3. Code-Qualität: user-story am saubersten

Über alle Workflows (n=15 pro Stil):

| Stil | smell_total μ±σ | smell_complexity μ±σ |
|---|---:|---:|
| prose | 4.1±1.7 | 1.1±1.1 |
| example-mapping | 4.0±1.8 | 1.3±1.4 |
| **user-story** | **3.4±1.6** | **0.8±1.0** |

user-story hat ~17% weniger Smells gesamt und ~30% weniger Complexity-
Smells als prose und example-mapping. **σ ist aber überall ähnlich groß
wie der Mittelwerts-Spread** — Effekt ist marginal und mit n=15 nicht
signifikant.

Auf v4-exact-subagents (n=3 pro Stil) zeichnet sich das deutlicher ab:

| Stil | smell_complexity (v4) |
|---|---:|
| prose | 1.0 |
| example-mapping | 0.0 |
| user-story | 0.0 |

→ **strukturierte Inputs (example-mapping, user-story) helfen v4 zu
sauberem Code**, prose ist marginal schlechter.

---

## 4. Magic-Numbers-Smell ist universell

| Stil | smell_magic_numbers μ |
|---|---:|
| prose | 2.5 |
| example-mapping | 2.6 |
| user-story | 2.5 |

**Identisch über alle Stile**. Die magic numbers sind die Game-of-Life-
Konstanten (B3/S23 → "2" und "3" hardcoded). Kein Prompt-Stil triggert
ihre Extraktion in benannte Konstanten — auch user-story mit
Akzeptanzkriterien nicht. Ist ein Modell- und kein Prompt-Effekt.

---

## 5. Stabilität: prose ist am ruhigsten

σ über alle Workflows pro Stil (n=15):

| Stil | LoC σ | smell σ |
|---|---:|---:|
| **prose** | **5.0** | 1.7 |
| example-mapping | 11.1 | 1.8 |
| user-story | 11.5 | 1.6 |

**prose hat die niedrigste LoC-Varianz** — beide LoC-σ-Werte der anderen
Stile sind 2× größer. Erklärung: prose lässt dem Modell den geringsten
Interpretations-Raum (es gibt keine Akzeptanzkriterien, deren Anzahl
schwanken kann).

Auf v1-oneshot besonders sichtbar:

| Stil | LoC σ (v1) |
|---|---:|
| prose | 3.6 |
| example-mapping | 8.5 |
| user-story | 4.0 |

example-mapping ist bei v1 am volatilsten — das Modell springt zwischen
"alle Examples implementieren" und "Examples nur als Hinweise nehmen".

---

## 6. Wallclock und Token-Verbrauch

| Stil | duration μ (s) | tokens μ (Mio) |
|---|---:|---:|
| prose | 240 | 2.30 |
| example-mapping | 233 | 2.20 |
| **user-story** | **249** | **2.56** |

user-story ist am teuersten (~7% mehr Tokens, ~6% länger), aber alle
Differenzen liegen weit innerhalb σ (σ_dur ≈ 250-290s wegen v4-Dominanz).
**Praktisch irrelevant.**

---

## 7. Cross-Tabelle: Workflow × Stil

### LoC (μ±σ pro Zelle, n=3)

| Workflow | prose | example-mapping | user-story |
|---|---:|---:|---:|
| v1-oneshot              | 41.0±3.6 | 59.7±8.5 | **64.3±4.0** |
| v2-iterative            | 42.7±2.5 | 47.3±11.2 | 48.7±7.6 |
| v3-basic-tdd            | 44.0±8.2 | 40.3±11.0 | 37.7±2.1 |
| v4-exact-subagents      | 42.0±5.6 | 41.0±8.0 | 35.7±4.2 |
| v5-exact-single-context | 36.3±2.9 | 38.3±5.9 | 40.7±3.1 |

**Muster**: nur v1 zeigt einen klaren prose < example-mapping ≈ user-story
Trend. v3+v4 drehen den Trend sogar um (user-story am kompaktesten).
v5 hat keinen erkennbaren Trend.

### smell_complexity (μ±σ)

| Workflow | prose | example-mapping | user-story |
|---|---:|---:|---:|
| v1-oneshot              | 1.3±1.2 | **2.0±2.0** | 0.7±0.6 |
| v2-iterative            | 1.3±0.6 | 1.3±0.6 | 1.3±1.2 |
| v3-basic-tdd            | 1.0±1.0 | 1.3±1.2 | 1.0±1.0 |
| **v4-exact-subagents**  | 1.0±1.7 | **0.0±0.0** | **0.0±0.0** |
| v5-exact-single-context | 1.0±1.7 | 2.0±1.7 | 1.0±1.7 |

**Muster**: v4 profitiert deutlich von strukturierten Inputs
(example-mapping/user-story → smell_complexity 0). prose verhindert
das. Bei anderen Workflows kein klarer Vorteil.

---

## 8. Praktische Empfehlungen

| Use Case | Empfehlung | Begründung |
|---|---|---|
| **One-shot-Generierung (v1)** | **prose** | 36% kompakter als user-story, niedrigster σ |
| **TDD mit v4/v5** | **example-mapping** oder **user-story** | v4 erreicht smell_complexity=0 statt 1.0 |
| **Schnelle Iteration (v3)** | **prose** | minimaler Spec-Aufwand, Output gleich |
| **Stabilität priorisieren** | **prose** | LoC-σ ~2× kleiner als bei den anderen Stilen |
| **Maximale Test-Coverage-Dichte** | **user-story** | +20% mehr Tests als prose (auf v1) |

**Default-Empfehlung**: **prose** — billigster Spec-Aufwand (5× kürzer),
beste Stabilität, kein messbarer Qualitätsverlust bei TDD-Workflows.
Nur bei v4 lohnt der Wechsel zu example-mapping/user-story für die
zusätzliche Smell-Reduktion.

---

## 9. Limitierungen

- n=3 pro (workflow, stil)-Zelle → individuelle Workflow×Stil-Effekte
  sind tendenziell, nicht statistisch belastbar.
- Nur eine Kata-Familie (game-of-life). Auf string-calculator (3 LoC)
  oder mars-rover (Stateful) könnten andere Stil-Effekte greifen.
- Nur ein Modell (Opus 4.7 no-thinking). Sonnet/Haiku könnten
  prompt-stil-empfindlicher sein.
- example-mapping- und user-story-Specs sind 4-5× länger als prose —
  Token-Input-Kosten sind nicht gemessen, nur Output-tokens
  (`total_tokens` mischt Input + Output).

---

## 10. Files

- Quelle: `runs.csv`
- Aggregat: `summary.md`
- Prompt-Files: `experiments/katas/game-of-life-{prose,example-mapping,user-story}/prompt.md`
