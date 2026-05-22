---
id: RQ-18.1
question: "Hält der RQ-18-Befund 'APP-Refactor-Agent schadet als End-Refactor' auf der novel Kata claim-office mit Example-Mapping-Prompt? Oder war F-18.2 ein trainingsdaten-spezifisches Artefakt von game-of-life?"
factors:
  workflow_x_prompt:
    - {workflow: v6-hybrid,                    prompt: example-mapping}
    - {workflow: v8a-delayed-refactor-agent,  prompt: example-mapping}
    - {workflow: v8b-delayed-refactor-native, prompt: example-mapping}
controls:
  model: opus-4-7-no-thinking
  kata_base: claim-office
outcomes:
  # primär: Korrektheit-außen (verification suite)
  - verification_pct
  - verification_passed
  - tests_passing
  # sekundär: Code-Qualität (wie RQ-18)
  - cognitive_max
  - mccabe_max
  - cc_longest_function
  - code_mass
  - lines_of_code
  # Kosten
  - duration_seconds
  - total_tokens
  # Korrektheit-innen
  - completed_within_budget
  # Test-Charakteristik
  - tests_total
  - test_lines
min_replicates: 10
status: geplant
---

# RQ-18.1: Delayed-Refactor auf claim-office-example-mapping

## Motivation

RQ-18 (auf `game-of-life-example-mapping`) hat F-18.2 produziert: der APP-Refactor-Agent als End-Refactor erzeugt schlechteren und instabileren Code als ein nativer Inline-Refactor (cognitive_max 7.8 ± 4.89 vs 4.4 ± 0.97). Der Confound: game-of-life ist breit in den Trainingsdaten präsent — das Modell startet mit einer guten memorierten Lösung, und jeder Refactor-Eingriff verschlechtert sie. F-18.2 könnte also Trainingsdaten-spezifisch sein, nicht eine generelle Eigenschaft des Agents.

RQ-18.1 wiederholt den Vergleich auf `claim-office-example-mapping` — einer von uns selbst gebauten Kata, die nicht in den Trainingsdaten ist. Falls F-18.2 hier reproduziert wird, ist es ein generelles Muster (Agent außerhalb periodischer Loops dysfunktional). Falls nicht, war es ein GOL-spezifisches Artefakt.

## Vergleichs-Logik bewusst akzeptiert

v8a/v8b auf example-mapping ist **kein echtes Vibe-Coding** — die Beispiel-Liste im Prompt ist faktisch eine Test-Spec, die das Modell implizit in Tests konvertieren kann. Das verfälscht zwar die "Vibe-Coding vs TDD"-Achse, ist aber für die **Refactor-Zeitpunkt-Achse** akzeptabel: alle drei Arme bekommen identische Spec-Strukturierung, die einzige Variable ist *wann* refactored wird (periodisch nach jedem Cycle vs einmal am Ende).

Ein Versuch mit prose-Prompt (Erstversion von RQ-18.1) zeigte: ohne Example-Mapping kollabiert die Korrektheit aller Arme auf ~17–25 % verification_pct, der Workflow-Vergleich verschwindet im Floor. Diese Runs wurden verworfen.

## Hypothesen

- **H1 (Periodizität trägt auch auf novel Code)**: v6.5.4 hat höhere oder gleiche `verification_pct` wie v8a/v8b — periodisches Refactor schadet der Korrektheit nicht, selbst wenn alle drei Arme die Spec-Struktur kennen.
- **H2 (F-18.2 reproduziert sich auf novel Code)**: v8a hat höheres `cognitive_max` oder `mccabe_max` als v8b mit ähnlicher Streuung wie auf GOL. → bestätigt F-18.2 als generelles Muster.
- **H2-Alternative (F-18.2 war GOL-Artefakt)**: v8a und v8b sind statistisch gleich oder v8a sogar besser. → F-18.2 trainingsdaten-spezifisch; Refactor-Agent-Verbesserung anders priorisieren.
- **H3 (TDD-LoC-Vorteil hält)**: v6.5.4 produziert weniger `lines_of_code` als v8a/v8b — Replikation des GOL-Befunds 32 vs 38–46.

## Workflow-Definition

- **v6-hybrid** (TDD-Baseline, n=10) — periodisches Refactor pro Cycle via Subagent. Konservativ gewählt: v6 hat auf claim-office-EM perfekte verification_pct (1.0, n=5), anders als v6.5.4 (0.40, n=10 — Korrektheits-Regression aus RQ-19).
- **v8a-delayed-refactor-agent** (n=10) — Oneshot + nachträgliche Tests + Refactor-Subagent als finaler Pass.
- **v8b-delayed-refactor-native** (n=10) — Oneshot + nachträgliche Tests + nativer Inline-Refactor.

Kata: `claim-office-example-mapping` (HPSMV-Versicherungs-Spec mit Question/Rule/Example-Strukturierung, 15 Verifikations-Szenarien).

## Was diese RQ nicht beantwortet

Nicht "TDD-Disziplin schlägt Vibe-Coding auf novel Code" — dafür müsste das Prompt-Strukturierungs-Werkzeug vom Workflow getrennt sein, was hier nicht der Fall ist. Das ist gegen RQ-1 abgegrenzt.

Diese RQ beantwortet ausschließlich: **wirkt sich Refactor-Zeitpunkt (periodisch vs am Ende) auf Outcomes aus, wenn beide Arme die gleiche Spec-Strukturierung bekommen**.
