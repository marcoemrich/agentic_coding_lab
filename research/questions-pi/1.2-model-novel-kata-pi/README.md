---
id: RQ-model-novel-pi
question: "Wie unterscheiden sich die via pi-Harness (Requesty-Routing) erreichbaren Modelle in Korrektheit und TDD-Disziplin auf claim-office-example-mapping mit dem v6.2-with-why-cleaned-pi-Workflow?"
factors:
  model:
    - opus-4-8            # aktuelles Opus (vertex/bedrock claude-opus-4-8@eu)
    - sonnet-5            # aktuelles Sonnet (vertex/claude-sonnet-5@eu)
    - gpt-5-6-sol         # GPT SOL (azure/gpt-5.6-sol@swedencentral)
    - gpt-5-6-terra       # GPT TERRA (azure/gpt-5.6-terra@swedencentral)
    - glm-5-1             # GLM 5.1 (nebius/zai-org/glm-5.1)
    - glm-5-2             # GLM 5.2 (tensorx/glm-5.2)
    - kimi-k2-7           # aktuelles Kimi (tensorx/kimi-k2.7-code)
    - minimax-m3          # MiniMax M3 (tensorx/minimax-m3)
    - deepseek-v4-pro     # DeepSeek V4 Pro (tensorx/deepseek-v4-pro)
    - qwen3-235b          # aktuelles Qwen (nebius/qwen/qwen3-235b-a22b-instruct-2507)
controls:
  workflow: v6.2-with-why-cleaned-pi
  kata_base: claim-office
  prompt: example-mapping
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
  # tertiär: TDD-Disziplin
  - cycle_count
  - refactorings_applied
  - predictions_correct
  - predictions_total
  # Kontext
  - tests_passing
  - tests_total
  - completed_within_budget
  - duration_seconds
  - total_tokens
min_replicates: 5
status: aktiv
---

# RQ-model-novel-pi: Modell-Effekt auf novel Kata (pi-Harness)

## Motivation

Parallel zu RQ-model-quality-pi (game-of-life, Code-Qualität), aber auf der härteren Achse: **Spec-Verstehen und Vollständigkeit der Implementierung**. `claim-office-example-mapping` ist eine novel Kata mit fünf bewusst konstruierten Mehrdeutigkeiten und einer externen Verification-Suite — keine reine Training-Recall-Übung wie game-of-life.

RQ-model-novel (CC-Seite) und RQ-model-novel-oc (OpenCode-Seite) haben gezeigt, dass `verification_pct` auf claim-office Modelle stärker differenziert als jede Code-Qualitäts-Metrik auf game-of-life. Diese RQ überträgt den Test auf die pi-Seite mit `v6.2-with-why-cleaned-pi`.

## Harness-Status: Walking Skeleton

**Stand 2026-07-24**: Die Lab-Variant→pi-Modell-Mappings für alle `factors.model`-Werte dieser RQ sind in `experiments/docker/run-batch.sh` (`harness = pi`-Branch) verdrahtet. Die Routing-Tabelle (identisch zu RQ-model-quality-pi) steht dort und in `../1.1-model-quality-pi/README.md`.

Diese RQ ist zunächst **offen (n=0)**: Mapping steht, aber pro Modell fehlt noch der Routing-Smoke (n=1) und der erste example-mapping-Batch.

## Vorhandene Daten (Stand 2026-07-24)

Auf `v6.2-with-why-cleaned-pi` × claim-office existieren erste Runs, aber auf dem **prose**-Prompt (nicht example-mapping) und mit `opus-4-7-portkey-no-thinking` (nicht den RQ-Modellen) — sie zählen daher **nicht** für die Zellen dieser RQ, dokumentieren aber den Harness-Zustand:

| Prompt | Modell | verification_pct | tests_passing | exit |
|---|---|---|---|---|
| claim-office-prose | opus-4-7-portkey-no-thinking | 0.00 | false | ok |
| claim-office-prose | opus-4-7-portkey-no-thinking | 0.00 | false | ok |
| claim-office-prose | opus-4-7-portkey-no-thinking | 0.27 | true | ok |
| claim-office-prose | opus-4-7-portkey-no-thinking | 0.20 | true | ok |

Niedrige Verification bei Opus auf prose ist auffällig und sollte vor dem example-mapping-Batch geklärt werden: liegt es am prose-Prompt, am v6.2-pi-Workflow, oder am CLI-Vertrag (`src/cli.ts` geschrieben und aufgerufen?)? `cli.ts`-Nudge ist für pi wie für OC nicht automatisch verdrahtet — beim ersten example-mapping-Batch beobachten, ob Modelle systematisch `src/cli.ts` vergessen (→ `verification_pct=null`).

## Modell-Auswahl

Identisch zu RQ-model-quality-pi: aktuelles Opus + Sonnet als Anthropic-Anker, GPT-5.6-SOL, GLM 5.1 **und** 5.2 (Intra-Familie-Versionsvergleich), aktuelles Kimi, MiniMax M3, DeepSeek V4 Pro, aktuelles Qwen (qwen3-235b). Verdrahtungs-Vorgehen und Drop-Kriterien wie bei `questions-opencode/` (Routing-Smoke → Aufnahme; Continuation-Drop / done.txt-mit-roten-Tests / fehlendes cli.ts → Ausschluss mit Begründung).

Für claim-office besonders relevant: **`minimax-m3`** — im `-oc`-Lauf der Paradefall "interne Tests grün, externe Verification 0/15" (genau der Mehrdeutigkeits-Effekt, für den claim-office gebaut wurde). **Gemma** ist nicht aufgenommen: in `pi-config/agent/models.json` nicht vorhanden / nicht via Requesty routbar (siehe RQ-model-quality-pi "Nicht aufgenommen").

## Hypothesen

- **H1 (v6.2 hebt pi-Niveau)**: opus-4-8 × v6.2-pi × claim-office-EM erreicht `verification_pct` deutlich über dem prose-Vorbefund (0.0–0.27). Ist das nicht der Fall, ist die niedrige Verification kein prose-Artefakt, sondern ein v6.2-pi-Workflow- oder CLI-Vertrags-Problem — dann zuerst den Harness fixen, nicht Modelle vergleichen.
- **H2 (Modell-Spreizung dichotom)**: claim-office wirkt als Pass/Fail-Filter für Spec-Verstehen — Modelle clustern nahe 1.0 (verstanden) oder nahe 0.0 (Mehrdeutigkeit falsch aufgelöst / CLI-Vertrag verletzt), statt gradueller Verteilung. (Konsistent mit dem `-oc`-Befund: Opus/Kimi/Flash 1.00 vs MiniMax 0.00.)
- **H3 (GLM-Versionssprung)**: glm-5-2 löst die claim-office-Mehrdeutigkeiten zuverlässiger als glm-5-1 — Versionssprung sichtbar in `verification_pct`. Backprovider-Confound (5.1 Nebius, 5.2 TensorX) als Caveat.
- **H4 (TDD-Disziplin und Korrektheit korrelieren NICHT linear)**: `predictions_total`-Compliance ist nicht notwendig für Korrektheit — der TDD-Inhalt (Test-First-Disziplin) wirkt unabhängig von der Marker-Format-Compliance. (Konsistent mit `-oc`: Kimi 0/0 predictions + 15/15 verification.)

## Methodologische Anmerkungen

- Skeleton-/Erst-Befunde sind einzelne Datenpunkte — Replikate zeigen, ob Muster stabil sind. Memory [[replicates-n-reliability]]: n=3 bimodal-erkennend, n=5 für mittlere Sicherheit.
- Alle Modelle via Requesty, gemischte Backprovider — siehe RQ-model-quality-pi für Routing-Details.
- v6.2 erzwingt die Why-Block-/Skill-TDD-Mechanik; Agent-Drift in inline-Mode nach einigen Cycles möglich. `cycle_count` ist damit konservativ.
- `cli.ts`-Nudge ist für pi NICHT verdrahtet. Falls Nicht-Anthropic-Modelle systematisch `src/cli.ts` vergessen → `verification_pct=null`. AGENTS.md des Workflows verlangt cli.ts; beim ersten Batch verifizieren.
- TDD-Disziplin-Metriken hängen davon ab, dass der pi-Transcript-Parser die v6.2-Marker erfasst (Smoke-Test-Regel aus CLAUDE.md: ein Opus-Run muss cycle_count/predictions != null liefern, bevor der Batch startet).
