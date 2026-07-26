---
id: RQ-model-quality-cc-vs-pi
question: "Unterscheidet sich das Code-Qualitäts-Profil von Opus (opus-4-8) zwischen dem Claude-Code- und dem pi-Harness, je mit und ohne Thinking, bei konstanter Workflow-Generation (v6.2)?"
factors:
  # model (inkl. thinking-Suffix) + Harness (im workflow kodiert) als gekoppelte
  # Bundles. 4 Zellen: {CC, pi} × {thinking, no-thinking}. thinking steckt im
  # Modell-Suffix (-no-thinking); jede Zelle kollabiert per {any:[...]} äquivalente
  # Schreibweisen (v6.2 ≡ v6.2.1, opus-4-8 ≡ opus-4-8-requesty).
  model_x_workflow:
    # Claude Code, thinking
    - model: {any: [opus-4-8-requesty, opus-4-8]}
      workflow: {any: [v6.2-with-why-cleaned, v6.2.1-phase-continuation]}
    # Claude Code, no-thinking
    - model: opus-4-8-no-thinking
      workflow: {any: [v6.2-with-why-cleaned, v6.2.1-phase-continuation]}
    # pi, thinking
    - model: opus-4-8
      workflow: {any: [v6.2.1-phase-continuation-pi, v6.2-phase-continuation-pi]}
    # pi, no-thinking
    - model: opus-4-8-no-thinking
      workflow: {any: [v6.2.1-phase-continuation-pi, v6.2-phase-continuation-pi]}
controls:
  kata_base: game-of-life
  prompt: example-mapping
outcomes:
  # primär: Code-Qualität / Komplexität (der cognitive_max-Befund treibt diese RQ)
  - cognitive_max
  - cognitive_avg
  - mccabe_max
  - mccabe_avg
  - cc_longest_function
  - cc_avg_loc_per_function
  - lines_of_code
  - code_mass
  - smell_total
  # sekundär: Korrektheit
  - tests_passing
  - tests_total
  - verification_pct
  # tertiär: TDD-Disziplin
  - cycle_count
  - refactorings_applied
  - predictions_correct
  - predictions_total
  # Kontext
  - completed_within_budget
  - duration_seconds
  - total_tokens
  - cost_usd
min_replicates: 5
status: aktiv
---

# RQ-model-quality-cc-vs-pi: Opus über den Claude-Code- vs. pi-Pfad

## Motivation

Der Harness-Effekt auf Opus soll bei **konstant gehaltenem Modell, Thinking und Workflow-Generation** isoliert werden: Claude Code (CC) vs. pi, beide mit `opus-4-8` und `thinking=true`, beide auf der v6.2-Workflow-Generation, Kata game-of-life-example-mapping. Bleibt bei dieser Konstanthaltung ein Code-Qualitäts-Unterschied (`cognitive_max`, `cognitive_avg`), ist er dem Harness-/Routing-Pfad zuzuschreiben — nicht Modell, Effort oder Workflow-Generation.

Diese RQ ist der thinking-konstante Kern eines ursprünglich breiteren Harness-Vergleichs. cursor und OpenCode sind bewusst ausgeklammert: cursor kann roster-bedingt kein `thinking` (nur `medium`), OpenCode wird hier nicht weiterverfolgt.

Nur game-of-life-example-mapping: die RQ zielt auf das Code-Qualitäts-/Komplexitäts-Signal, das game-of-life trägt. claim-office (Korrektheit) läge auf einer anderen Achse.

## Konstanthaltung und verbleibende Confounds

- **Modell + Effort konstant**: beide Zellen `opus-4-8` mit `thinking=true`. Die 5 CC-Bestandsruns fahren `opus-4-8-requesty`, die pi-Zelle `opus-4-8` — beide realroutet über Requesty/Vertex-EU (Container-global), gleiche Route, unterschiedlich im `cli_model`-Feld protokolliert. Kein Routing-Confound im Modell.
- **Workflow-Generation konstant, Workflow-Linie NICHT**: CC läuft auf `v6.2-with-why-cleaned`, pi auf `v6.2.1-phase-continuation-pi`. Beide gehören zur v6.2-Generation und werden hier — als explizite Setzung — **workflowmässig identisch behandelt** (inkl. `v6.2.1` ≡ `v6.2` und ihrer Harness-Varianten wie `-pi`). Strukturell sind es zwei Linien derselben Generation (with-why-cleaned nutzt `commands`/`rules`, phase-continuation nutzt `skills`/`extensions`/`AGENTS.md`). Ein verbleibender Unterschied kann daher Harness ODER Workflow-Linie sein — beim Finding als Caveat benennen.

`model` ist deshalb nicht als `controls.model` gepinnt, sondern über den `model_x_workflow`-Paar-Faktor je Zelle an die passende Harness-Workflow-/Modell-Schreibweise gebunden. Jede Zelle nutzt `{any:[...]}`, um äquivalente Schreibweisen (v6.2 ≡ v6.2.1; `opus-4-8` ≡ `opus-4-8-requesty`) zu kollabieren.

## Vorhandene Daten (Stand 2026-07-26)

- **CC-Zelle** (`v6.2-with-why-cleaned`, `opus-4-8-requesty`, thinking=true): **5** Runs — alle DONE, Tests grün. Kein Nachziehen nötig.
- **pi-Zelle** (`v6.2.1-phase-continuation-pi`, `opus-4-8`, thinking=true): **5** Runs (inkl. eines `-2`-Rerun). Kein Nachziehen nötig.

Beide Zellen aus Bestandsdaten füllbar → kein Fill-Batch. Sollte künftig eine Zelle unter n=5 fallen, deckt der `{any:[...]}`-Match auch die jeweils andere Schreibweise ab.

## Hypothesen

- **H1 (Harness-Isolierung)**: Bei konstantem Modell/Thinking/Workflow-Generation ist der `cognitive_max`/`cognitive_avg`-Unterschied zwischen CC und pi klein (< 1σ) → Harness-neutral. Ein großer Unterschied ist dem Harness-Pfad (oder der Workflow-Linie, s. Caveat) zuzuschreiben.
- **H2 (Parsimonie)**: Falls sich die Harnesse in `lines_of_code` unterscheiden, zeigt sich ggf. derselbe Parsimonie/Komplexitäts-Tradeoff wie in [RQ-model-quality-cursor](../../questions-cursor-cli/1.1-model-quality-cursor/findings.md) (wenig LoC bei hoher Dichte).

## Methodologische Anmerkungen

- **Harness im Workflow kodiert**: analog [RQ-harness](../1.1-harness-effect/README.md) trägt der Workflow den Harness. Eine 1:1-identische Workflow-Datei über Harnesse ist unmöglich (verschiedene Marker-Dirs: `.claude/` vs `.pi/`).
- **Tarif-Confound**: `cost_usd` ist für die CC-requesty-Zelle vorhanden, ebenso pi (beide Requesty). Vergleichbar, solange beide über Requesty laufen.
- `n=5` per Zelle folgt Memory [[replicates-n-reliability]].
- `verification_pct` spiegelt auf game-of-life `tests_passing` (keine externe Suite); Korrektheits-Anker ist `tests_passing`.
