---
id: RQ-5
question: "Wie stabil ist die Code-Qualitaet pro Workflow ueber Replikate, und unter welchen Bedingungen ist n=3 als Replikat-Anzahl ausreichend?"
factors:
  workflow_x_prompt:
    - {workflow: v1-oneshot,             prompt: prose}
    - {workflow: v2-iterative,           prompt: prose}
    - {workflow: v3-basic-tdd,           prompt: example-mapping}
    - {workflow: v4-exact-subagents,     prompt: example-mapping}
    - {workflow: v5-exact-single-context, prompt: example-mapping}
controls:
  model: opus-4-7-no-thinking
  kata_base: game-of-life
outcomes:
  # primaer: dieselben Code-Qualitaets-Metriken wie RQ-4,
  # ausgewertet auf Streuung und Stabilitaet
  - code_mass
  - smell_total
  - cc_longest_function
  - mccabe_max
  - cognitive_max
  # sekundaer: Korrektheit (Sanity, sollte bei 100 % bleiben)
  - tests_passing
  - verification_pct
  - completed_within_budget
  # Kontext
  - duration_seconds
  - total_tokens
min_replicates: 10
status: aktiv
---

# RQ-5: Run-Stabilitaet pro Workflow

Wie stabil produzieren die fuenf Workflows ihre Code-Qualitaet ueber Replikate, und unter welchen Bedingungen reicht ein n=3-Sample fuer belastbare Aussagen?

## Motivation

RQ-4 (Workflow-Effekt auf Code-Qualitaet) zeigt **dramatische Mittelwert-Unterschiede** zwischen den Workflows — insbesondere v4 vs alle anderen auf `cognitive_max` (Faktor 4–8x). Die Streuungen sind aber sehr ungleich verteilt:

| Workflow (RQ-4 Daten) | `cognitive_max` Mittel | σ | Range |
|---|---:|---:|---|
| v4-exact-subagents | 2.83 | **0.75** | 2–4 |
| v2-iterative | 16.67 | 2.31 | 14–18 |
| v1-oneshot | 20.67 | 2.52 | 18–23 |
| v3-basic-tdd | 23.33 | 4.51 | 19–28 |
| v5-exact-single-context | 18.33 | **6.66** | 11–24 |

Drei Beobachtungen:

1. **v4 ist auffaellig stabil** — σ=0.75 ist eine Groessenordnung kleiner als bei den anderen. Das ist konsistent mit der Hypothese, dass Phasen-Isolation Pfadabhaengigkeit reduziert.
2. **v5 hat σ=6.66 bei Mittel 18.33** — der Variationskoeffizient (σ/μ) ist 0.36. Bei n=3 ist die Wahrscheinlichkeit hoch, dass eine zukuenftige Wiederholung mit 3 anderen Runs einen substantiell anderen Mittelwert produziert.
3. **Bei v4 ist n=3 wahrscheinlich ausreichend** (σ klein, Distanz zu jeder anderen Zelle >> σ_v4). Bei v5 vermutlich nicht — der Mittelwert ist instabil.

Diese Beobachtungen sind aber selbst bei n=3 noch nicht belastbar — σ-Schätzungen mit n=3 haben breite Konfidenzintervalle. RQ-5 misst Stabilitaet bei **n=10** pro Zelle und beantwortet damit zwei Fragen:

- **(a) Welche Workflows produzieren stabilen Code, welche nicht?**
- **(b) Bei welchen Workflows ist n=3 belastbar, bei welchen braucht es mehr Replikate?**

## Design

```
Faktor:    workflow_x_prompt — 5 Stufen (v1+prose, v2+prose,
                                         v3/v4/v5+example-mapping)
Kontrolle: model             — opus-4-7-no-thinking
Kontrolle: kata_base         — game-of-life

Zellen:    5
Replikate: n = 10
Runs:      50 total (38 neu, 12 aus RQ-4 wiederverwendet:
           v1=3, v2=3, v3=3, v4=6 (RQ-3+RQ-4 gepoolt), v5=3)
```

Identisches Setup wie RQ-4, nur mit n=10 statt n=3 — Code-Qualitaets-Aussagen aus RQ-4 werden mit hoeherem n verifiziert und mit Stabilitaets-Aussagen ergaenzt.

## Methodologische Sub-Frage: Wann reicht n=3?

Ein zentrales Nebenergebnis: aus den n=10-Daten kann *post hoc* berechnet werden, wie haeufig ein zufaelliges n=3-Subsample dieselben Ranking-Schluesse stuetzt wie das volle n=10-Sample.

**Subsampling-Analyse** (auf je n=10 pro Zelle): aus jeder Zelle alle `C(10, 3) = 120` moeglichen Dreier-Subsamples ziehen und pro Outcome berechnen, wie oft die Subsample-basierte Rangordnung mit der n=10-Wahrheits-Rangordnung uebereinstimmt. Eine Zelle, die hier eine niedrige Uebereinstimmung produziert (z.B. < 80 %), ist mit n=3 nicht zuverlaessig charakterisierbar.

Daraus laesst sich die praktische Regel ableiten:
- **Klein-σ-Workflows** (geschaetzt: v4) → n=3 reicht.
- **Hoch-σ-Workflows** (geschaetzt: v3, v5) → n ≥ 7 noetig fuer belastbare Mittelwert-Aussagen.

Die Subsampling-Analyse wird im Findings-File numerisch dokumentiert.

## Hypothesen

- **H1 (Workflow-Stabilitaets-Ranking)**: σ_cognitive_max waechst in der Reihenfolge v4 < v2 ≈ v1 < v3 < v5. Phasen-Isolation (v4) liefert das stabilste Signal; v5 mit Shared-Context ist am volatilsten, weil pfadabhaengige Kontext-Akkumulation die Loesungs-Form streuen laesst.
- **H2 (n=3 reicht fuer v4)**: Subsampling-Analyse auf v4 zeigt fuer alle Komplexitaets-Outcomes ≥ 95 % Uebereinstimmung des n=3-Rankings mit dem n=10-Ranking.
- **H3 (n=3 reicht NICHT fuer v5)**: Subsampling-Analyse auf v5 zeigt fuer `cognitive_max` und `cc_longest_function` < 80 % Uebereinstimmung.
- **H4 (RQ-4-Hauptbefund haelt unter n=10)**: F-4.1 ("strikt-TDD v4 deutlich besser") und F-4.2 ("v3 schlechter als non-TDD") replizieren bei n=10 mit gleichem Vorzeichen und gleicher Groessenordnung.

**Falsifikation H4** waere besonders wichtig: wenn bei n=10 das Ranking kippt (z.B. v3 nicht mehr Schlusslicht), waeren F-4.1/F-4.2 nur bei n=3 ein Befund — was die ganze RQ-4 unterminieren wuerde.

## Operationalisierung der Stabilitaets-Outcomes

Pro Zelle werden zusaetzlich zu den ueblichen Mittelwert/min/max/σ folgende Stabilitaets-Kennzahlen ausgewiesen:

- **CV** (Coefficient of Variation = σ/μ): dimensionslose Relativ-Streuung. CV < 0.1 = sehr stabil; 0.1–0.3 = moderat; > 0.3 = instabil.
- **IQR** (Interquartile Range): robust gegenueber Einzel-Ausreissern.
- **Outlier-Rate**: Anteil der Runs, deren Outcome > Mittel ± 2σ ist.
- **Reproduzierbarkeits-Score** (aus Subsampling-Analyse): Anteil der Dreier-Subsamples, deren Mittelwert innerhalb ±20 % des n=10-Mittels liegt.

## Caveats

- **(a) Single model**: nur `opus-4-7-no-thinking`. Stabilitaet bei anderen Modellen offen.
- **(b) Single kata**: nur Game of Life. Stabilitaet bei mars-rover oder claim-office koennte anders aussehen.
- **(c) Prompt-Asymmetrie** (v1/v2 prose, v3/v4/v5 EM): Methodologie-Constraint; in RQ-4 Caveats schon dokumentiert. F-4.4 zeigt: Korrektheit ist unter API-Vertrag von der Prompt-Asymmetrie nicht beeinflusst.
- **(d) Wiederverwendung von 12 RQ-4-Runs**: ist methodologisch sauber, weil Workflow/Modell/Kata/Prompt identisch sind — aber neue 38 Runs koennten z.B. durch Kalender-Drift (anderer Server-Snapshot, andere Tools-Version) systematisch leicht abweichen. Wir pruefen Mittelwert-Konsistenz zwischen alten 12 und neuen 38 als Sanity-Check.
- **(e) Stabilitaets-Praezision**: Selbst n=10 gibt nur grobe σ-Schaetzungen. Ein robusteres σ-Mass haette n=30. Bei 50 Runs Budget ist das nicht praktikabel; die Bootstrap-Konfidenzintervalle auf den σ-Schaetzungen werden in den Findings ausgewiesen.

## Findings

Siehe [findings.md](findings.md).

## Datenquelle

Alle Runs in `experiments/runs/` mit
`workflow ∈ {v1-oneshot, v2-iterative, v3-basic-tdd, v4-exact-subagents, v5-exact-single-context}`,
`kata ∈ {game-of-life-prose, game-of-life-example-mapping}` (workflow-konstrainiert),
`model = opus-4-7-no-thinking`.
