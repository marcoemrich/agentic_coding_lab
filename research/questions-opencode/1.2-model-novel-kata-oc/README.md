---
id: RQ-model-novel-oc
question: "Wie unterscheiden sich fünf via OpenCode-Harness erreichbare Modelle in Korrektheit auf claim-office-prose mit dem v1-oneshot-oc-Workflow?"
factors:
  model:
    - opus-4-7-portkey
    - kimi-k2-6
    - minimax-m2-7
    - gemini-2-5-pro
    - gemini-3-5-flash
controls:
  workflow: v1-oneshot-oc
  kata_base: claim-office
  prompt: prose
outcomes:
  # primär: Korrektheit außen (claim-office hat externe Verification-Suite)
  - verification_pct
  - verification_passed
  - verification_total
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

# RQ-model-novel-oc: Modell-Effekt auf novel Kata (OpenCode-Harness)

## Motivation

Parallel zu RQ-model-quality-oc (game-of-life, Code-Qualität), aber auf der härteren Achse: **Spec-Verstehen und Vollständigkeit der Implementierung**. `claim-office-prose` ist eine novel Kata mit fünf bewusst konstruierten Mehrdeutigkeiten und einer externen Verification-Suite (15 Szenarien) — keine reine Training-Recall-Übung wie game-of-life.

RQ-model-novel (CC-Seite) hat gezeigt, dass `verification_pct` auf claim-office Modelle stärker differenziert als jede Code-Qualitäts-Metrik auf game-of-life. Diese RQ überträgt den Test auf die OpenCode-Seite mit fünf neuen Modellen.

## Vorhandene Daten

- **opus-4-7-portkey × v1-oneshot-oc × claim-office-prose**: n=2 aus Skeleton-Smokes 2026-05-25, beide mit `verification_pct ≈ 0.20` (3/15 bzw. 4/15 — ähnliche Größenordnung). Counten für `min_replicates`.
- Alle anderen Zellen offen.

## Hypothesen

- **H1 (Opus-Anker via OC reicht an CC-Niveau heran)**: opus-4-7-portkey × v1-oneshot-oc × claim-office erreicht `verification_pct` in derselben Größenordnung wie RQ-model-novel (CC, opus-4-7-no-thinking × v4 × claim-office-EM, n=10, mean 0.67) — wenn die OC-Variante deutlich darunter bleibt, ist ein systematischer Harness- oder Workflow-Effekt am Werk (v1 vs v4, prose vs example-mapping). Beide ist methodisch zu trennen, daher Hypothese mit Caveat: gleiche Größenordnung = OC fit-for-purpose, deutlich darunter = Workflow-Defizit (kein TDD, kein Subagent), nicht Harness-Defizit.
- **H2 (Modell-Spreizung sichtbar)**: Die fünf Modelle zeigen über `verification_pct` eine größere Spreizung als ihre Code-Qualitäts-Spreizung auf game-of-life — claim-office exponiert Spec-Verstehen, das auf trainings-vertrauten Katas verdeckt bleibt.
- **H3 (Flash schwach auf Korrektheit)**: gemini-3-5-flash hat deutlich niedrigere `verification_pct` als gemini-2-5-pro — Spec-Vollständigkeit ist der erste Trade-off, den schnellere/kleinere Modelle einbüßen.

## Methodologische Anmerkungen

- Die zwei vorhandenen Skeleton-Runs zählen als Datenpunkte (selbe Triple, gleiche Pipeline-Version). Drei weitere Replikate auf der opus-Zelle reichen, um auf n=5 zu kommen.
- Für die vier Nicht-Anthropic-Zellen ist die `cli.ts`-Erstellung möglicherweise instabiler als bei Opus — der OC-Nudge ist im aktuellen run-batch.sh nicht verdrahtet. Falls Modelle systematisch ohne `src/cli.ts` enden, `verification_pct=0`, dann brauchts entweder einen OC-Nudge oder eine Prompt-Härtung in AGENTS.md.
- v1-oneshot-oc ist ein "kein-TDD"-Workflow — Korrektheits-Befunde gelten *für diesen Workflow*. Wenn der OC-TDD-Zweig (v5-single-context-oc o.ä.) später entsteht, neue RQ aufmachen, nicht diese erweitern.
