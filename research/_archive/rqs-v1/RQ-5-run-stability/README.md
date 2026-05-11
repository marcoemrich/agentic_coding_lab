---
id: RQ-5
question: "Wie groß ist die Run-zu-Run-Varianz innerhalb identischer Zellen?"
factors:
  workflow_x_prompt:
    - {workflow: v1-oneshot,              prompt: prose}
    - {workflow: v2-iterative,            prompt: prose}
    - {workflow: v3-basic-tdd,            prompt: prose}
    - {workflow: v3-basic-tdd,            prompt: example-mapping}
    - {workflow: v3-basic-tdd,            prompt: user-story}
    - {workflow: v4-exact-subagents,      prompt: prose}
    - {workflow: v4-exact-subagents,      prompt: example-mapping}
    - {workflow: v4-exact-subagents,      prompt: user-story}
    - {workflow: v5-exact-single-context, prompt: prose}
    - {workflow: v5-exact-single-context, prompt: example-mapping}
    - {workflow: v5-exact-single-context, prompt: user-story}
  kata_base: [game-of-life, claim-office]
controls:
  model: opus-4-7-no-thinking
outcomes:
  - tests_passing            # σ ≈ 0 erwartet (binär, meist 100%)
  - verification_pct         # Akzeptanz-Suite-Stabilität (claim-office); null bei Vitest-Katas
  - verification_passed
  - verification_total
  - code_mass                # primäres σ-Signal
  - smell_total
  - cc_longest_function
  - mccabe_max          # zusätzliches σ-Signal: Streut Komplexität über Replikate?
  - cognitive_max
  - duration_seconds
min_replicates: 3
status: aktiv
---

# RQ-5: Run-zu-Run-Stabilität

Wie groß ist die Streuung des Outputs zwischen identischen Runs (gleiche
Konfiguration, anderer Random-Seed/Sampling-Pfad)? Diese RQ liefert die
**methodische Basis** für alle anderen RQs:

- Welches `min_replicates` ist nötig, um echte Effekte von Rauschen zu
  trennen?
- Welche Outcomes sind hochstabil (σ niedrig → n=1 reicht), welche
  rauschig (σ hoch → n≥3 oder mehr nötig)?
- Gibt es Workflow×Prompt-Zellen mit auffallend hoher Varianz (= mehr
  Replikate dort sinnvoll)?

## Design

11 Zellen × n=3 = 33 Runs. Single-Model (opus-4-7-no-thinking),
single-Kata (game-of-life). Pairing folgt der Methoden-Constraint:

- v1/v2: nur prose
- v3/v4/v5: alle drei Stile (3 × 3 = 9 Zellen)

Das ist **bewusst breiter** als RQ-1 (die nur 5 Zellen mit
fairem-Pairing nutzt) und **schmaler** als ein Voll-Design — Ziel ist
Varianz-Schätzung pro Zelle, nicht Workflow-Effekt-Schätzung.

## Design-Begründung

**Single-Model, single-Kata**: Eliminiert Confound-Effekte. Stabilität
unterschiedlicher Modelle/Katas ist eigene Frage; falls Bedarf ergänzbar
als RQ-5b.

**Alle erlaubten Workflow×Prompt-Kombis**: Damit kann pro Zelle σ
geschätzt werden, und Zellen-spezifische Stabilitäts-Probleme
sichtbar werden.

## Untersuchte Hypothesen

- H1: σ(`tests_passing`) ≈ 0 (Tests sind meist deterministisch grün
  oder konsistent rot).
- H2: σ(`code_mass`) ist das größte Rauschen — Modelle wählen
  unterschiedliche Implementierungs-Stile.
- H3: σ(`smell_total`) korreliert mit μ(`smell_total`) (mehr Smells →
  mehr Streuung, klassische Heteroskedastizität).
- H4: σ ist auf v4 (multi-context) höher als auf v5 (single-context),
  weil mehr Subagent-Übergänge mehr Variabilität einführen.

## Findings

Siehe [findings.md](findings.md).

## Datenquelle

Alle Runs mit
`model=opus-4-7-no-thinking`, `kata=game-of-life-{prompt}` und
`(workflow, prompt)` aus dem Faktor-Pairing.

Aktuelle Datenbasis: 33 Runs aus dem ehemaligen
`game-of-life-stability`-Batch.
