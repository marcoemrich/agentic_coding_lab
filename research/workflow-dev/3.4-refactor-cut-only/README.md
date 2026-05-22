---
id: RQ-17
question: "Ist der Pred-Rate-Drop in v6.5.3 (95.8 %) durch den red/SKILL.md-DO/DON'T-Cut verursacht? Liefert v6.5.4 (nur refactor.md DO/DON'T gestrichen) einen sauberen Pareto-Optimum mit v6.5.3-Quality + v6.5.1-Pred-Hygiene + Floor?"
factors:
  workflow_x_prompt:
    - {workflow: v6.5.1-orchestration-audited, prompt: example-mapping}
    - {workflow: v6.5.3-targeted-cuts,         prompt: example-mapping}
    - {workflow: v6.5.4-refactor-cut-only,     prompt: example-mapping}
controls:
  model: opus-4-7-no-thinking
  kata_base: game-of-life
outcomes:
  # primär: Code-Qualität
  - code_mass
  - smell_total
  - cc_longest_function
  - cognitive_max
  - mccabe_max
  # TDD-Disziplin
  - refactorings_applied
  - cycle_count
  - predictions_correct_rate
  - tests_passed_immediately
  # Kosten
  - duration_seconds
  - total_tokens
  # Korrektheit (Sanity)
  - tests_passing
  - verification_pct
  - completed_within_budget
min_replicates: 10
status: aktiv
---

# RQ-17: v6.5.4-refactor-cut-only — Pred-Rate-Drop isolieren

RQ-16 hat v6.5.3 als neuen Quality-Champion etabliert (`cognitive_max` 3.5 ± 1.43 vs v6.5.1's 5.6 ± 3.17) — aber `predictions_correct_rate` ist auf 95.8 % gefallen (vs v6.5.1's 98.9 %, v6.5.2's 99.4 %). F-16.4 hat vorgeschlagen, dass der `red/SKILL.md`-DO/DON'T-Cut (10c) die Ursache ist und v6.5.2's intakte Pred-Rate ein Confounder durch kürzere Cycles war.

RQ-17 testet das isoliert: v6.5.4 = v6.5.1 minus **nur** dem refactor.md-DO/DON'T-Cut (10b), `red/SKILL.md` unverändert.

## Motivation

Wenn die F-16.4-Hypothese stimmt, kombiniert v6.5.4:

- **v6.5.3's Quality-Wins** (`cognitive_max` ≤ 4) — getrieben vom 10b-Cut
- **v6.5.1's Pred-Hygiene** (≥ 98.9 %) — getrieben vom erhaltenen `red/SKILL.md`
- **v6.5.1/v6.5.3's Floor** — getrieben von der erhaltenen `Remember`-Sektion

Das wäre ein **sauberer Pareto-Improvement** über v6.5.1 ohne Trade-offs:

| Metrik | v6.5.1 | v6.5.3 | v6.5.4 (erwartet) |
|---|---:|---:|---:|
| `cognitive_max` | 5.6 ± 3.17 | **3.5 ± 1.43** | ~3.5 |
| `cc_longest_function` | 13.1 ± 6.30 | **12.0 ± 3.40** | ~12 |
| `tests_passed_immediately` | 0/10 | 0/10 | 0/10 |
| `refactorings_applied` σ | 0.42 | 0.67 | 0.42–0.67 |
| `predictions_correct_rate` | 98.9 % | 95.8 % | **≥ 98 %** ← Schlüsselmetrik |

## Bisherige Befunde im Kontext

Über RQ-14, RQ-15, RQ-16 haben wir vier Cut-Patterns getestet:

| Workflow | 10a "Remember" | 10b refactor DO/DON'T | 10c red DO/DON'T |
|---|:---:|:---:|:---:|
| v6.5.1 | ✓ | ✓ | ✓ |
| v6.5.2 | ✗ | ✗ | ✗ |
| v6.5.3 | ✓ | ✗ | ✗ |
| **v6.5.4** | **✓** | **✗** | **✓** |

v6.5.4 isoliert 10b — die einzige Variante, in der nur dieser eine Cut wirkt.

## Workflow-Definition

- **v6.5.1-orchestration-audited (Baseline, n=10 aus RQ-14-Pool)**: Disziplin- und Pred-Hygiene-Champion, alle Bullets erhalten.
- **v6.5.3-targeted-cuts (Baseline, n=10 aus RQ-16-Pool)**: Quality-Champion, alle DO/DON'T-Blöcke gestrichen, "Remember" erhalten.
- **v6.5.4-refactor-cut-only (neu, n=10)**: nur refactor.md-DO/DON'T gestrichen.

## Hypothesen

- **H1 (Quality-Wins transferieren)**: `cognitive_max` und `cc_longest_function` innerhalb 1 σ der v6.5.3-Werte (3.5 / 12.0). Der quality-relevante Cut (10b) ist intakt.
- **H2 (Floor hält)**: `tests_passed_immediately = 0/10`, `refactorings_applied ≥ 7`, σ `refactorings_applied` innerhalb 1.5× von v6.5.1's 0.42. "Remember"-Sektion ist erhalten.
- **H3 (Pred-Hygiene kehrt zurück)**: `predictions_correct_rate ≥ 98 %`. **Falsifikations-Test für F-16.4**: wenn ja, dann war 10c die Ursache des Pred-Rate-Drops in v6.5.3. Wenn nein, hatte der Drop einen anderen Mechanismus.
- **H4 (Kosten zwischen v6.5.1 und v6.5.3)**: `total_tokens` 7.8–8.6 M, `duration_seconds` 700–770 s. Kein großer Token-Win erwartet — der treibt v6.5.2's Vorteil und ist hier nicht reproduzierbar (siehe F-16.3).
- **H5 (Korrektheit)**: 100 % `tests_passing`, 100 % `verification_pct`.

## Drei mögliche Ausgänge

| Ergebnis | Interpretation | Promotion |
|---|---|---|
| Alle H1–H4 halten | v6.5.4 = sauberer Pareto-Optimum. Quality + Floor + Pred-Hygiene alle gewonnen, keine Regression | **v6.5.4 promoten** als neuer Champion |
| H1 hält, H3 nicht | Pred-Rate-Drop in v6.5.3 hatte andere Ursache als 10c. Floor + Quality lassen sich nicht von Pred-Hygiene trennen | v6.5.3 bleibt Quality-Champion mit dokumentiertem Pred-Trade-off |
| H1 hält nicht | Quality-Wins benötigen Interaction-Effekt (10b + 10c zusammen). Cut von 10b allein reicht nicht | v6.5.3 bleibt Champion; 10b und 10c sind nicht unabhängig |

Der erste Ausgang ist der erwünschte und der konsistenteste mit dem RQ-16-Bild. Der dritte wäre die größte Überraschung — und würde nahelegen, dass der Quality-Effekt eine emergente Interaktion zwischen zwei DO/DON'T-Blöcken ist, nicht eine additive Summe einzelner Cuts.

## Design

```
Faktor:    workflow_x_prompt — 3 Stufen, alle example-mapping
Kontrolle: model            — opus-4-7-no-thinking
Kontrolle: kata_base        — game-of-life

Zellen:    3 (3 Workflows × 1 Kata)
Replikate: n = 10 je Zelle
Runs:      30 total (10 v6.5.1 + 10 v6.5.3 aus Pools + 10 neue v6.5.4)
```

## Caveats

- **Single Kata, single Modell**: opus-4-7-no-thinking auf game-of-life. Falls v6.5.4 promotet wird, Cross-Model/Cross-Kata als Folge-RQs.
- **Pool-Wiederverwendung**: nutzt v6.5.1 aus RQ-14-Pool und v6.5.3 aus RQ-16-Pool; nur v6.5.4 muss neu laufen.
- **n=10 mit Pred-Rate-Sensitivität**: über 10 Runs mit je ~16 Predictions sind das ~160 Datenpunkte. Schwankungen zwischen 95 % und 99 % unterscheiden sich um ~6 absolute Wrong-Predictions — das ist innerhalb n=10 stabil messbar.
- **v6.5.2 nicht in der Analyse**: bewusst weggelassen, weil RQ-15 sie schon mit v6.5.1 verglichen hat und der Confounder-Effekt (kürzere Cycles) ihr Pred-Rate-Signal nicht direkt vergleichbar macht.

## Findings

Siehe [findings.md](findings.md) nach Abschluss des Runs.

## Datenquelle

Alle Runs in `experiments/runs/` mit
`workflow ∈ {v6.5.1-orchestration-audited, v6.5.3-targeted-cuts, v6.5.4-refactor-cut-only}`,
`kata = game-of-life-example-mapping`,
`model = opus-4-7-no-thinking`.

## Quellen

- Externes Audit-Framework: https://github.com/chdalski/claude_orchestration
- Workflow-Definition: `experiments/workflows/v6.5.4-refactor-cut-only/CHANGES.md`
- Vorgänger-RQs: `research/workflow-dev/3.1-orchestration-audit/`, `research/workflow-dev/3.2-bullets-cut/`, `research/workflow-dev/3.3-targeted-cuts/`
