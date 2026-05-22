---
id: RQ-16
question: "Sind die Quality/Cost-Gewinne aus v6.5.2 ohne σ-Verlust erreichbar, wenn nur die mid-file DO/DON'T-Blöcke gestrichen werden und die `Remember`-End-Sektion in refactor.md erhalten bleibt?"
factors:
  workflow_x_prompt:
    - {workflow: v6.5.1-orchestration-audited, prompt: example-mapping}
    - {workflow: v6.5.2-bullets-cut,           prompt: example-mapping}
    - {workflow: v6.5.3-targeted-cuts,         prompt: example-mapping}
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

# RQ-16: v6.5.3-targeted-cuts — Floor-Anker isolieren

RQ-15 hat ein gemischtes Bild gezeigt: v6.5.2-bullets-cut (alle drei Finding-10-Cuts) gewinnt auf Code-Qualität (`cognitive_max` −29 %, `mccabe_max` −16 %) und Kosten (−15 % Tokens, −4 % Wallclock), verliert aber massiv auf TDD-Disziplin-Determinismus (σ `refactorings_applied` 0.42 → 1.26, σ `cycle_count` 0.42 → 1.06, `tests_passed_immediately` Floor 0 → 1). Diese RQ isoliert, *welcher* der drei Cuts den σ-Verlust verursacht hat.

## Motivation

In v6.5.2 wurden drei Bullet-Blöcke gestrichen:

1. `refactor.md` "Remember"-Section am **Datei-Ende** (8 Zeilen)
2. `refactor.md` "Important Guidelines" DO/DON'T **mid-file** (16 Zeilen)
3. `red/SKILL.md` "Important Guidelines" DO/DON'T **mid-file** (14 Zeilen)

Hypothese: Cuts 2 und 3 sind echte Verbatim-Duplikate von vorher genannten Sections und tragen den Quality/Cost-Gewinn. Cut 1 hingegen ist zwar inhaltlich auch redundant, sitzt aber **am Datei-Ende** — als letzte Lese-Position vor dem Modell-Output. Diese Position kann als Floor-Anker dienen: ein finaler Pass durch die Kern-Invarianten, bevor der Subagent agiert.

v6.5.3-targeted-cuts wendet **nur** Cuts 2 und 3 an, behält "Remember". Wenn die Hypothese stimmt, vereint v6.5.3 das Beste aus v6.5.1 (Disziplin-Determinismus) und v6.5.2 (Quality/Cost).

## Workflow-Definition

- **v6.5.1-orchestration-audited (Baseline, n=10 aus RQ-14-Pool)**: Disziplin-Champion mit allen Bullets.
- **v6.5.2-bullets-cut (Baseline, n=10 aus RQ-15-Pool)**: Quality/Cost-Champion ohne alle Bullets.
- **v6.5.3-targeted-cuts (neu, n=10)**: Mittelweg — Mid-file-DO/DON'T weg, End-File-"Remember" bleibt.

## Hypothesen

- **H1 (Quality wie v6.5.2)**: `cognitive_max` und `mccabe_max` liegen innerhalb 1 σ der v6.5.2-Werte (4.0 / 4.1) — der Quality-Gewinn überträgt sich.
- **H2 (Cost wie v6.5.2)**: `total_tokens` und `duration_seconds` innerhalb 1 σ der v6.5.2-Werte (7.21 M / 694.8 s) — der Cost-Gewinn überträgt sich.
- **H3 (Disziplin-σ wie v6.5.1)**: σ `refactorings_applied`, σ `cycle_count`, `tests_passed_immediately` innerhalb 1.5 σ der v6.5.1-Bänder (0.42 / 0.42 / 0). Die `Remember`-Sektion ist Floor-Anker genug, um die Determinismus-Eigenschaft zu erhalten.
- **H4 (Korrektheit)**: 100 % `tests_passing`, 100 % `verification_pct`.
- **H5 (Falsifikations-Kriterium)**: wenn v6.5.3 entweder Quality/Cost verliert *oder* σ regrediert wie v6.5.2, ist die Floor-Anker-Hypothese widerlegt — entweder waren alle drei Bullets gleichwertig dekorativ (dann ist v6.5.2 der korrekte Champion und die σ-Zunahme hat andere Ursachen), oder der Anker-Effekt verteilt sich über mehrere Bullets gleichzeitig.

## Design

```
Faktor:    workflow_x_prompt — 3 Stufen, alle example-mapping
Kontrolle: model            — opus-4-7-no-thinking
Kontrolle: kata_base        — game-of-life

Zellen:    3 (3 Workflows × 1 Kata)
Replikate: n = 10 je Zelle
Runs:      30 total (10 v6.5.1 + 10 v6.5.2 + 10 neue v6.5.3)
```

## Drei mögliche Ausgänge

| Ergebnis | Interpretation | Promotion |
|---|---|---|
| v6.5.3 ≈ v6.5.2 (Quality/Cost) UND ≈ v6.5.1 (σ) | "Remember" ist Floor-Anker → **neuer Pareto-Optimum** | v6.5.3 promoten |
| v6.5.3 ≈ v6.5.2 in allem (Quality+Cost+σ) | "Remember" war dekorativ; σ-Regression hat anderen Mechanismus (z. B. kürzere Cycles ⇒ mehr Pro-Cycle-Varianz) | v6.5.2 als Champion bestätigen |
| v6.5.3 ≈ v6.5.1 in allem (Quality+Cost+σ) | DO/DON'T waren der Anker, nicht "Remember" → Quality/Cost-Gewinn nur möglich mit σ-Verlust | v6.5.1 als Champion bestätigen, Pareto-Frontier unverbessert |

Der dritte Ausgang wäre der informativste — er würde nahelegen, dass *jede* Streichung duplizierter Bullet-Struktur den Workflow destabilisiert, unabhängig von der konkreten Position. Das wäre ein Befund über die `behavior-preserving-cuts`-Regel hinaus: die strukturelle Wiederholung selbst ist der Anker, nicht nur ihr Inhalt.

## Caveats

- **Single Kata, single Modell**: opus-4-7-no-thinking auf game-of-life. Falls v6.5.3 promotet wird, Cross-Model/Cross-Kata als Folge-RQs.
- **Position vs. Inhalt verwechselt**: v6.5.3 lässt "Remember" *als End-File-Block* stehen. Falls v6.5.3 σ behält, ist offen, ob das an Position (Datei-Ende) oder Form ("Remember"-Wording) liegt. Saubere Disambiguierung wäre eine v6.5.4-Variante, die "Remember" entfernt und stattdessen einen anderen Bullet-Block ans Datei-Ende verschiebt — falls nötig.
- **n=10**: gut für Mittelwert, sensitiv für σ-Vergleich. RQ-15 hatte die σ-Verdoppelung schon bei n=10 klar sichtbar; das sollte hier auch ausreichen.
- **Vergleichs-Pool**: nutzt vorhandene RQ-14- und RQ-15-Runs für v6.5.1 und v6.5.2. Nur v6.5.3 muss neu laufen.

## Findings

Siehe [findings.md](findings.md) nach Abschluss des Runs.

## Datenquelle

Alle Runs in `experiments/runs/` mit
`workflow ∈ {v6.5.1-orchestration-audited, v6.5.2-bullets-cut, v6.5.3-targeted-cuts}`,
`kata = game-of-life-example-mapping`,
`model = opus-4-7-no-thinking`.

## Quellen

- Externes Audit-Framework: https://github.com/chdalski/claude_orchestration
- Workflow-Definition: `experiments/workflows/v6.5.3-targeted-cuts/CHANGES.md`
- Vorgänger-RQs: `research/workflow-dev/3.1-orchestration-audit/`, `research/workflow-dev/3.2-bullets-cut/`
