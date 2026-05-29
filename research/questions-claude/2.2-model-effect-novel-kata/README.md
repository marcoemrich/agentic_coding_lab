---
id: RQ-model-novel
question: "Wie unterscheiden sich Opus 4.8, Opus 4.7 und Opus 4.6 (jeweils no-thinking) in Korrektheit und Code-Qualität auf einer novel Kata mit Mehrdeutigkeiten, die stärker differenziert als die trainingsbekannte game-of-life?"
factors:
  model:
    - opus-4-8-no-thinking
    - opus-4-7-no-thinking
    - opus-4-6-portkey-no-thinking
controls:
  workflow: v4-exact-subagents
  kata_base: claim-office
  prompt: example-mapping
outcomes:
  # primär: Korrektheit-außen
  - verification_pct
  - verification_passed
  # sekundär: Code-Qualität
  - code_mass
  - cognitive_max
  - mccabe_max
  - cc_longest_function
  - lines_of_code
  - smell_total
  # Kontext
  - tests_passing
  - tests_total
  - completed_within_budget
  - duration_seconds
  - total_tokens
min_replicates: 5
status: aktiv
---

# RQ-model-novel: Model-Effekt auf novel Kata (claim-office)

## Motivation

RQ-model-quality vergleicht 6 Modelle auf `game-of-life-example-mapping` (trainingsbekannt). Ergebnis: alle Modelle erreichen 100 % `verification_pct` (außer sonnet-4-6-no-thinking mit 0.73). Die Kata differenziert auf Code-Qualität, aber nicht auf Korrektheit — alle "bestehen".

Auf `claim-office-example-mapping` (novel, 5 Mehrdeutigkeiten, CLI mit externer Verification-Suite) hat RQ-regression gezeigt, dass opus-4-6 systematisch schlechtere Spec-Vollständigkeit liefert als opus-4-7: ein opus-4-6-Run auf v6-hybrid hat die `claim`-Operation komplett ignoriert (nur `quote` implementiert), obwohl das JSON-Schema-Beispiel in der Spec beide klar spezifiziert.

RQ-model-novel fokussiert auf die drei stärksten Opus-Modelle (no-thinking, weil RQ-model-quality F-model-quality.2 zeigt, dass Thinking keinen konsistenten Vorteil bringt) und gibt ihnen die härtere Challenge.

## Vorhandene Daten

- **opus-4-7-no-thinking × v4 × claim-office-EM**: n=10 aus RQ-workflow-tradeoff-Pool (mean verification_pct 0.67, bimodal: 4 perfekt, 6 zwischen 0.20–0.87)
- **opus-4-6-portkey-no-thinking × v4 × claim-office-EM**: n=5 (4 innerhalb Budget, 1 Timeout), mean verification_pct 0.93
- **opus-4-8-no-thinking × v4 × claim-office-EM**: n=5 erhoben 2026-05-29 (native API — Opus 4.8 ist noch nicht auf Portkey/Vertex; Batch lief mit geleerten ANTHROPIC_*-Env-Vars), mean verification_pct 0.92

## Offene Hypothesen

- **H4 (opus-4-8 Workflow-Robustheit)**: opus-4-8 wurde bisher nur auf v4 erhoben. Teilt es die Workflow-Sensitivität von 4-6/4-7 (F-model-novel.2), oder ist es — wie seine durchweg hohe v4-Korrektheit nahelegt — robuster über Workflows? Re-Check bräuchte opus-4-8 × {v5, v6-hybrid} × claim-office-EM, n≥5.

## Hypothesen

- **H1 (Modell-Capability-Gap bei Spec-Vollständigkeit)**: opus-4-6 hat signifikant niedrigere `verification_pct` als opus-4-7 — bestätigt die RQ-regression-Beobachtung "implementiert nur die Hälfte der Spec" als modell-spezifisches Defizit.
- **H2 (Code-Qualitäts-Gap bleibt)**: opus-4-6 hat höhere Komplexitäts-Metriken (cognitive_max, mccabe_max), konsistent mit RQ-model-quality F-model-quality.3 (~2× auf GOL).
- **H3 (Korrektheit ist die härtere Achse)**: Auf claim-office differenziert `verification_pct` die Modelle stärker als jede Code-Qualitäts-Metrik — die "stärkere Challenge" exponiert Unterschiede, die auf GOL unsichtbar waren.
