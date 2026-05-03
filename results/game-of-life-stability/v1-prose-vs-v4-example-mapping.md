# v1+prose vs. v4+example-mapping: head-to-head

Vergleich der zwei plausiblen "Default"-Setups:
- **v1-oneshot + prose**: minimaler Spec-Aufwand, kein TDD-Loop, schnelle Generierung.
- **v4-exact-subagents + example-mapping**: strukturierte Spec, TDD-Subagent-Pipeline.

Datenbasis: `runs.csv` aus dem game-of-life-stability-Batch, n=3 pro Zelle.

Generiert: 2026-05-03.

> **Update 2026-05-03 (Re-Analyse)**: Die hier verglichenen Zellen
> (v1+prose und v4+ex-mapping) sind vom Pipeline-Fix unverändert — v1 hat
> per Definition keine Predictions/Phasen, v4-Subagent-Predictions waren
> bereits vor dem Fix korrekt. Die Tabelle in §3 ist gegengeprüft (15/16 =
> 94%, cycles=8.7, refactorings=4.0). Eine alternative Vergleichsbasis ist
> jetzt **v5+ex-mapping**: pred=47/48 (98%), cycles=8.0, refactorings=6.7,
> Dauer 353s — siehe `findings.md` §3.1.

---

## 1. Code-Qualität — v4 gewinnt knapp

| Metrik | v1+prose μ±σ | v4+ex-mapping μ±σ | Δ % |
|---|---:|---:|---:|
| LoC (src+test) | 41.0±3.6 | 41.0±8.0 | **±0%** |
| cc_loc (cleaned src) | 33.7±3.1 | 32.0±7.0 | -5% |
| code_mass (chars) | 164±10 | 183±26 | +12% |
| **smell_total** | 4.0±2.0 | **2.7±0.6** | **-33%** |
| smell_magic_numbers | 2.3±0.6 | 2.7±0.6 | +14% |
| **smell_complexity** | 1.3±1.2 | **0.0±0.0** | **-100%** |

**Befunde**:

- **smell_complexity = 0 in 3/3 v4-Runs**, vs. 2/2/0 bei v1 → klarer v4-Vorteil.
- **smell_total -33%** bei v4.
- **Magic-Numbers identisch schlecht** (~2.5) — beide Workflows extrahieren
  die B3/S23-Konstanten nicht. Ist ein Modell-Issue, kein Workflow-Issue.
- **LoC und cc_loc praktisch gleichauf** — v4 ist nicht kompakter als v1+prose.
  v4 hat aber höhere code_mass (mehr Whitespace/Comments aus dem
  Refactor-Step).

---

## 2. Tests — v1 testet deutlich mehr, gleiche Coverage

| Metrik | v1+prose μ±σ | v4+ex-mapping μ±σ | Δ % |
|---|---:|---:|---:|
| **tests_total** | **11.7±1.5** | 8.7±0.6 | **-26%** |
| **test_lines** | **98.7±8.3** | 41.0±0.0 | **-58%** |
| coverage_statements % | 100±0 | 100±0 | ±0% |
| coverage_branches % | 100±0 | 100±0 | ±0% |

**Befunde**:

- **v1 schreibt 3 Tests mehr** (12 vs. 9) und **mehr als doppelt so viel
  Test-Code** (99 vs. 41 Zeilen).
- **Trotzdem identische 100/100 Coverage** — v4s Tests sind kompakter und
  decken denselben Code ab.
- v1 tendiert zu Edge-Cases/Boundary-Tests, v4 fokussiert auf die
  Example-Mapping-Cases (= die strukturierte Spec). Mehr v1-Tests sind
  wahrscheinlich teilweise redundant.

---

## 3. Effizienz — v1 dominiert massiv

| Metrik | v1+prose μ±σ | v4+ex-mapping μ±σ | Δ |
|---|---:|---:|---:|
| **duration_seconds** | **48.7±2.5** | 686.3±46.5 | **+1310%** (14×) |
| **total_tokens** | **0.52M±0.05M** | 2.49M±0.20M | **+376%** (4.8×) |
| cycle_count | — (n.a.) | 8.7±0.6 | nur v4 |
| refactorings_applied | 0 | 4.0±0.0 | nur v4 |
| predictions_correct/total | — | **15/16 = 94%** | nur v4 |

→ v4 kostet **14× mehr Wallclock** und **5× mehr Tokens** für 33% weniger
smells.

---

## 4. Per-Run-Detail (Konsistenz)

**v1+prose** (alle 3 Runs in ~50s):

| Run | LoC | cc_loc | smell_total | smell_complex | tests |
|---|---:|---:|---:|---:|---:|
| 1 | 40 | 33 | **6** | **2** | 12 |
| 2 | 38 | 31 | **4** | **2** | 10 |
| 3 | 45 | 37 | 2 | 0 | 13 |

**v4+example-mapping** (alle 3 Runs in ~700s):

| Run | LoC | cc_loc | smell_total | smell_complex | tests |
|---|---:|---:|---:|---:|---:|
| 1 | 33 | 25 | 3 | 0 | 9 |
| 2 | 49 | 39 | 3 | 0 | 9 |
| 3 | 41 | 32 | 2 | 0 | 8 |

**Kernbeobachtung**:

- **v4 ist konsistent**: alle 3 Runs landen bei 2-3 smells, smell_complexity
  immer 0.
- **v1 hat hohe Varianz**: ein Run sehr gut (smell_total=2, complex=0),
  zwei schlechter (4-6 smells, complex=2). σ_smell ist 3× höher.

---

## 5. Trade-off-Matrix

| Dimension | Sieger | Vorsprung |
|---|---|---|
| Code-Qualität (smells) | **v4+ex-mapping** | -33% smell_total, -100% complexity |
| Code-Kompaktheit (LoC) | unentschieden | innerhalb σ |
| Test-Anzahl | **v1+prose** | +26% mehr Tests |
| Test-Coverage | unentschieden | beide 100/100 |
| Wallclock | **v1+prose** | 14× schneller |
| Token-Kosten | **v1+prose** | 4.8× billiger |
| Run-zu-Run-Konsistenz | **v4+ex-mapping** | smell-σ 0.6 vs. 2.0 |
| Spec-Aufwand | **v1+prose** | 20 vs. 107 Spec-Zeilen |

---

## 6. Praktische Empfehlung

**v4+example-mapping ist die teure "Sauberkeits-Versicherung"**:

- Konsistent niedrige Komplexität (smell_complexity=0 garantiert)
- Aber 14× Wallclock und 5× Token-Kosten
- Test-Tiefe geringer (8.7 vs. 11.7 Tests, 100% Coverage trotzdem)

**Wann v1+prose**:
- Throwaway-Code oder Prototyp
- Geschwindigkeit/Kosten priorisiert
- Mehr explizite Tests gewünscht (Coverage ist bei beiden identisch,
  aber v1 schreibt mehr Boundary-Cases)
- Spec-Aufwand minimieren (20 statt 107 Zeilen)

**Wann v4+example-mapping**:
- Production-Code, der refaktoriert/erweitert wird
- Konsistente Qualität wichtiger als Geschwindigkeit
- Bereit, 5× mehr zu zahlen für garantiert saubere Komplexität

**Bei game-of-life-Komplexität (~40 LoC) ist der v4-Aufpreis schwer zu
rechtfertigen**, wenn die einzige messbare Qualitäts-Differenz 1-2 Smells
und 0 vs. 1.3 Complexity-Verstöße sind. Bei größeren Codebases könnte
sich das Verhältnis ändern.

---

## 7. Limitierungen

- n=3 pro Zelle → Mittelwerte mit ±σ angegeben, aber statistisch nicht
  belastbar.
- Nur eine Kata (game-of-life). Andere Aufgaben mit höherer struktureller
  Komplexität könnten v4 deutlicher bevorteilen.
- Nur Opus-4.7-no-thinking. Schwächere Modelle (Sonnet, Haiku) profitieren
  laut Smart-subset stärker von v4 — der Vergleich könnte dort anders
  ausfallen.
- Coverage ist auf game-of-life ein 100/100-Plateau — feinere
  Coverage-Differenzen wären auf komplexeren Katas sichtbar.

---

## 8. Files

- Quelle: `runs.csv` (Zellen v1-oneshot×prose und v4-exact-subagents×example-mapping)
- Aggregat: `summary.md`
