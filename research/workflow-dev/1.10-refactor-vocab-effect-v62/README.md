---
id: RQ-refactor-vocab-v62
question: "Verbessert ein additiver Vokabular-Block im refactor-Agent (Cyclomatic + Cognitive Complexity, Single Responsibility, Smell→Move-Tabelle) die Code-Qualitaet auf v6.2-with-why-cleaned-Basis, ohne Korrektheit oder Kosten signifikant zu beeintraechtigen?"
factors:
  workflow_x_prompt:
    - {workflow: v6.2-with-why-cleaned, prompt: example-mapping}  # Baseline (aktuelle Default-Basis aus RQ-1.6 / RQ-1.7)
    - {workflow: v6.2-refactor-vocab,   prompt: example-mapping}  # + Vokabular-Block (Complexity Awareness, SRP, Smell-Tabelle)
  kata_base: [game-of-life, claim-office]
controls:
  model: opus-4-7-portkey-no-thinking
outcomes:
  # primaer: Code-Qualitaet (Vokabular-Block zielt direkt auf Complexity-Erkennung)
  - cognitive_max
  - cognitive_avg
  - mccabe_max
  - mccabe_avg
  - cc_longest_function
  - cc_avg_loc_per_function
  - smell_total
  - smell_complexity
  - code_mass
  # TDD-Disziplin (Sanity: additiver Block darf Refactor-Verhalten nicht stoeren)
  - refactorings_applied
  - cycle_count
  - predictions_correct_rate
  # Korrektheit (Sanity)
  - tests_passing
  - verification_pct
  - completed_within_budget
  # Kosten (additiver Text → leichter Aufschlag erwartet)
  - duration_seconds
  - total_tokens
min_replicates: 5
status: aktiv
---

# RQ-1.10: v6.2-refactor-vocab vs v6.2-with-why-cleaned (GoL + claim-office)

Verbessert ein additiver Vokabular-Block im `refactor`-Agent — Cyclomatic-/Cognitive-Complexity-Definitionen, Single-Responsibility-Operationalisierung, eine Smell→Move-Tabelle — die produzierte Code-Qualitaet, ohne Korrektheit oder Kosten zu beeintraechtigen?

## Motivation

Der `refactor`-Agent in v6.2 hat als zentrale Refactor-Vokabel nur **Naming Evaluation** + **Simple Design Rules** + **APP-Mass**. Komplexitaet (McCabe, Cognitive), Single Responsibility und das klassische Smell→Move-Mapping (Fowler-Vokabular) sind nicht benannt. Damit fehlt dem Agent ein Teil der Vokabel, in dem sich strukturelle Probleme begrifflich fassen lassen — und das Lab misst diese Probleme spaeter explizit (`cognitive_*`, `mccabe_*`, `cc_longest_function`, `smell_complexity`).

Ein frueherer Versuch (archivierte RQ-19-refactor-vocab-extended) war invalide, weil er auf einer in der Zwischenzeit als korrektheits-defekt erkannten v6.x-Linie aufsetzte (siehe Memory `v6-rebuild-new-base`, `v6.5-correctness-setback`). Die jetzt-stabile Default-Basis ist `v6.2-with-why-cleaned` (RQ-1.6 / RQ-1.7). Das macht den Re-Versuch auf gleichem, gesundem Substrat ueberhaupt erst aussagefaehig.

Der Block ist bewusst:
- **rein additiv** (Naming Evaluation, APP, Process-Steps, Beispiele, Red-Flags, Remember-Floor byte-identisch),
- **ohne numerische Schwellwerte** (keine "cognitive_max < 15", keine "LoC < 50") — qualitative Sprache, konform zur Workflow-Convention "Keine Schwellwerte in Workflow-Prompts" (siehe `CLAUDE.md`),
- **bewusst Goodhart-resistent** ("No thresholds. These lenses are vocabulary for seeing and naming — not a quota for how many smells must be addressed per refactor pass.").

## Workflow-Definition

- **v6.2-with-why-cleaned (Baseline)** — aktuelle Default-Basis aus RQ-1.6. Naming Evaluation als einzige strukturierte Refactor-Vokabel oberhalb von APP.
- **v6.2-refactor-vocab (neu)** — v6.2 + Block "Complexity Awareness (Second Refactoring Priority)" + "Single Responsibility (Naming + Cognitive together)" + "Common Smells and Typical Refactoring Moves" (10-Eintrag-Tabelle), eingefuegt zwischen Naming Evaluation und Rule 3.

Voller Diff: `diff -r experiments/workflows/v6.2-with-why-cleaned experiments/workflows/v6.2-refactor-vocab` (41 Zeilen Insert nach Z.45 von `refactor.md`, sonst byte-identisch).

## Hypothesen

- **H1 (Code-Qualitaet)** — Auf game-of-life sinkt mindestens eine der primaeren Komplexitaets-Metriken (`cognitive_max`, `cognitive_avg`, `mccabe_max`) gegenueber Baseline messbar, ohne dass eine andere primaere Metrik gleichzeitig deutlich steigt. SRP-Vokabel und Smell-Tabelle bewirken zusaetzlich, dass `cc_longest_function` und `cc_avg_loc_per_function` tendenziell sinken (mehr extrahierte Helper).
- **H2 (Korrektheit)** — `tests_passing ≥ 95 %` auf game-of-life; `verification_pct` auf claim-office innerhalb 1 σ der v6.2-Baseline. Additiver Vokabel-Block darf Korrektheit nicht regredieren — Smoke gegen Bundle-Risiko wie bei RQ-1.8/1.9 (siehe Memory `audit-bundle-kata-asymmetry`).
- **H3 (TDD-Disziplin neutral)** — `refactorings_applied`, `cycle_count`, `predictions_correct_rate` je innerhalb 1 σ der Baseline. Block ergaenzt Vokabel, aendert Prozess nicht.
- **H4 (Kosten)** — Additiver Text (~41 Zeilen) → +5–10 % `total_tokens`, Wallclock weitgehend unveraendert (kein zusaetzlicher Tool-Call).
- **H5 (Kata-Asymmetrie)** — Effekt-Groesse darf zwischen game-of-life und claim-office unterschiedlich sein. Falls auf claim-office *staerker* (komplexere Domain, mehr Helper-Extraktionsbedarf): erwartet. Falls auf claim-office *negativ* (vergleichbar mit RQ-1.9-Befund fuer audit-bundle): Befund, der Re-Promotion blockiert.
- **H0 (Falsifizierer)** — Keine der primaeren Komplexitaets-Metriken bewegt sich auf beiden Katas messbar, oder Korrektheit regrediert auf claim-office: Vokabel-Erweiterung empirisch redundant zur bestehenden Naming-/APP-Vokabel, v6.2 bleibt Default. Vokabel-Erweiterung kann dann als Effekt-loses Sprach-Update verbucht und nicht promotet werden.

## Design

```
Faktor:    workflow_x_prompt — 2 Stufen (v6.2-with-why-cleaned, v6.2-refactor-vocab), beide example-mapping
Faktor:    kata_base         — 2 Stufen (game-of-life, claim-office)
Kontrolle: model             — opus-4-7-portkey-no-thinking

Zellen:    4 (2 Workflows × 2 Katas)
Replikate: n = 5 je Zelle
Runs:      20 total
```

n=5 default (Memory `replicates-n-reliability`: n=5 fuer Sanity / mittlere Aussage; n≥7 erst fuer enge σ-Vergleiche). Bei klarem Bundle-Signal oder σ-Reduktions-Bedarf kann auf n=10 nachgezogen werden.

Portkey-Routing, Shards moeglich (GoL kurze Sessions, claim-office mittelfristig; kein nennenswertes Cut-Risiko bei n=5, vgl. Memory `portkey-shards-external-cut-risk`).

## Caveats

- **Bundle, drei Teil-Bloecke gleichzeitig** — Complexity-Awareness + SRP + Smell-Tabelle werden in einem Schritt addiert. Bei positivem Befund bleibt offen, welcher Teil-Block traegt. Folge-RQs (Complexity-only, SRP-only, Smell-Tabelle-only) sind moeglich, falls Bundle-Effekt eintritt und Disambiguierung wichtig wird.
- **Goodhart-Risiko (Trainings-Bias)** — die Komplexitaets-Definitionen ("Each `if`, `else if`, ...") nennen Konstrukte, die in den Mess-Metriken vorkommen. Modell koennte Konstrukte mechanisch vermeiden ohne Strukturgewinn (z.B. `if`-Chain durch breitere Lookup-Tabelle ersetzen, die `cc_loc` aufblaeht). Daher Cross-Check: wenn `cognitive_max` sinkt, `cc_loc` aber proportional steigt, ist der Befund Goodhart-gefaerbt. Block ist absichtlich so formuliert, dass "Cognitive vs. McCabe"-Trade-off explizit benannt ist — aber das eliminiert das Risiko nicht.
- **Kata-Asymmetrie** — game-of-life ist Code-Qualitaets-primaer, claim-office Korrektheits-primaer. Vokabel-Block ist Code-Qualitaets-Intervention; claim-office bekommt diese RQ als **Sanity** mit. Wenn auf claim-office Code-Qualitaets-Gewinn ohne Korrektheits-Verlust eintritt: stark; wenn nur GoL profitiert: erwartet (Kata-Fit); wenn auf claim-office Korrektheit faellt: Stopp.
- **Mass vs. Cognitive-Konflikt** — APP-Mass und Cognitive-Complexity koennen in unterschiedliche Richtungen weisen (z.B. Helper-Extraktion senkt Cognitive, addiert aber `invocation`-Mass). Der Block ergaenzt Cognitive als zweite Linse, ohne APP zu deklassieren. Effekt auf `code_mass` daher offen — kann steigen oder fallen.
- **Single Model** — `opus-4-7-portkey-no-thinking`. Memory `opus-46-vs-47-not-equivalent` warnt vor Modellwechsel innerhalb einer Workflow-Kette; eine Cross-Model-Validierung auf Sonnet oder Haiku bleibt einer Folge-RQ vorbehalten, falls Bundle-Effekt eintritt.

## Findings

Siehe [findings.md](findings.md) (folgt nach Batch-Lauf).

## Datenquelle

Alle Runs in `experiments/runs/` mit
`workflow ∈ {v6.2-with-why-cleaned, v6.2-refactor-vocab}`,
`kata ∈ {game-of-life-example-mapping, claim-office-example-mapping}`,
`model = opus-4-7-portkey-no-thinking`.

v6.2-Baseline-Runs koennen ggf. aus RQ-1.6 (GoL) und RQ-1.9 (claim-office) wiederverwendet werden, sofern Modell und Prompt-Stil exakt matchen. Sonst Refill bis n=5 pro Zelle.

## Quellen

- v6.2-Workflow: `experiments/workflows/v6.2-with-why-cleaned/.claude/agents/refactor.md`.
- v6.2-refactor-vocab-Diff: `diff -r experiments/workflows/v6.2-with-why-cleaned experiments/workflows/v6.2-refactor-vocab`.
- Baseline-RQs: [RQ-1.6](../1.6-v62-cleanup-validation-v61-with-why/findings.md), [RQ-1.7](../1.7-v62-cleanup-validation-gol/findings.md), [RQ-1.9](../1.9-audit-bundle-validation-claim-office/findings.md).
- Kata-Asymmetrie-Praezedenz: [RQ-1.8](../1.8-audit-bundle-effect-v62/findings.md) (GoL-positiv) vs [RQ-1.9](../1.9-audit-bundle-validation-claim-office/findings.md) (claim-office-negativ).
- Workflow-Convention: `CLAUDE.md` Sektion "Editing workflows" ("Keine numerischen Schwellwerte in Workflow-/Agent-Prompts").
