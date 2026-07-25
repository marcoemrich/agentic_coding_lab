---
id: RQ-model-novel-pi
question: "Wie unterscheiden sich die via pi-Harness (Requesty-Routing) erreichbaren Modelle in Korrektheit und TDD-Disziplin auf claim-office-example-mapping mit dem v6.2-with-why-cleaned-pi-Workflow?"
factors:
  # Reasoning ist KEIN eigener factors-Eintrag, sondern im Modell-Namen
  # kodiert: `<id>` = nativer Reasoning-Default, `<id>-no-thinking` =
  # derselbe Routing-Pfad mit `--thinking off`. Beide sind eigenstaendige
  # Lab-Varianten (Konvention wie opus-4-7-no-thinking in workflow-dev/).
  # Wo der Schalter nicht greift, existiert nur ein Arm — siehe
  # "Reasoning-Zustand" unten.
  model:
    # beide Arme: Schalter greift oder wird empirisch geprueft
    - opus-4-8                     # aktuelles Opus (vertex/claude-opus-4-8@eu)
    - opus-4-8-no-thinking         # einziges Modell mit belegt steuerbarem Reasoning
    - sonnet-5                     # aktuelles Sonnet (vertex/claude-sonnet-5@eu)
    - sonnet-5-no-thinking
    - kimi-k2-7                    # aktuelles Kimi (tensorx/kimi-k2.7-code)
    - kimi-k2-7-no-thinking
    - minimax-m3                   # MiniMax M3 (tensorx/minimax-m3)
    - minimax-m3-no-thinking
    - deepseek-v4-pro              # DeepSeek V4 Pro (tensorx/deepseek-v4-pro)
    - deepseek-v4-pro-no-thinking
    - qwen3-235b                   # aktuelles Qwen (nebius/qwen/qwen3-235b-a22b-instruct-2507)
    - qwen3-235b-no-thinking
    # nur ein Arm: Reasoning-Zustand nicht waehlbar
    - glm-5-2                      # GLM 5.2 (tensorx/glm-5.2) — reasoniert immer, kein -no-thinking-Arm
    - gpt-5-6-sol                  # GPT SOL (azure/gpt-5.6-sol@swedencentral) — erzwungen aus
    - gpt-5-6-terra                # GPT TERRA (azure/gpt-5.6-terra@swedencentral) — erzwungen aus
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

## Harness-Status

**Stand 2026-07-24**: Harness verifiziert, Routing für alle neun `factors.model`-Werte steht (`experiments/docker/run-batch.sh`, `harness = pi`-Branch; Routing-Tabelle auch in `../1.1-model-quality-pi/README.md`). Ein n=1-Smoke über alle Modelle ist gelaufen; die Zellen sind noch nicht auf `min_replicates` gefüllt.

Drei Harness-Defekte wurden dabei gefunden und behoben:

1. **Plan-Validierung kannte die pi-Modelle nicht.** Die `pi_model`-Cases mappten alle Modelle, aber `MODEL_CONFIGS` (Validierungs-Allowlist) enthielt sieben davon nicht — der erste Batch brach mit `unknown model: 'sonnet-5'` ab, bevor ein Container startete. Einträge ergänzt.
2. **`cli_built` war ein False-Positive.** Die Detection schloss aus „kein Szenario hat stdout erzeugt" auf ein fehlendes CLI; bei fehlender `src/cli.ts` schreibt `tsx` seinen Modul-Fehler aber nach stdout, sodass `cli_built = true` blieb. Jetzt wird der Entry-Point aus dem Runner-Command geparst und seine Existenz geprüft.
3. **GPT-5.6 routete gar nicht.** Siehe „Reasoning-Zustand" — mit `"reasoning": false` laufen sol und terra.

Zusätzlich ist der `cli.ts`-Nudge für pi verdrahtet.

## Vorhandene Daten

Frühere `v6.2-with-why-cleaned-pi` × claim-office-**prose**-Runs mit `opus-4-7-portkey-no-thinking` (verification 0.00–0.27) zählen nicht für die Zellen dieser RQ. Die damals offene Frage, ob die niedrige Verification am prose-Prompt, am v6.2-pi-Workflow oder am CLI-Vertrag lag, ist beantwortet: **H1 bestätigt** — auf `example-mapping` erreicht `opus-4-8` reproduzierbar `verification_pct = 1.00` bei gebautem CLI. Der Vorbefund war also ein Prompt-/Modell-Artefakt, kein Workflow-Defekt.

## Modell-Auswahl

Aktuelles Opus + Sonnet als Anthropic-Anker, GPT-5.6-SOL und -TERRA, GLM 5.2, aktuelles Kimi, MiniMax M3, DeepSeek V4 Pro, aktuelles Qwen (qwen3-235b). Verdrahtungs-Vorgehen und Drop-Kriterien wie bei `questions-opencode/` (Routing-Smoke → Aufnahme; Continuation-Drop / done.txt-mit-roten-Tests / fehlendes cli.ts → Ausschluss mit Begründung).

`glm-5-1` (Nebius) wurde entfernt: der geplante Intra-Familie-Vergleich mit `glm-5-2` (TensorX) war durch den Backprovider-Wechsel confoundet, sodass ein Versions-Effekt nicht sauber von einem Provider-Effekt trennbar gewesen wäre.

Für claim-office besonders relevant: **`minimax-m3`** — im `-oc`-Lauf der Paradefall "interne Tests grün, externe Verification 0/15" (genau der Mehrdeutigkeits-Effekt, für den claim-office gebaut wurde). **Gemma** ist nicht aufgenommen: in `pi-config/agent/models.json` nicht vorhanden / nicht via Requesty routbar (siehe RQ-model-quality-pi "Nicht aufgenommen").

## Reasoning-Zustand (Caveat)

Alle Modelle laufen mit ihrem **nativen Reasoning-Default (= an)**. Ein einheitliches Abschalten wäre der fairere Vergleich, ist über pi/Requesty aber nicht herstellbar — verifiziert am 2026-07-24:

Gemessen wurde pro Modell mit einem reasoning-fordernden Prompt (Seil-Rätsel), einmal mit `--thinking off` und einmal mit `--thinking high`; gezählt sind Thinking-Blöcke im pi-Event-Stream:

| Modell | `--thinking off` | `--thinking high` | Reasoning steuerbar? |
|---|---|---|---|
| `opus-4-8` | 0 | 91 | **ja** — einziges Modell, bei dem der Schalter greift |
| `sonnet-5` | 0 | 0 (auch bei `max`) | nein — reasoniert über diese Route nie |
| `deepseek-v4-pro` | 0 | 0 | nein — reasoniert nie |
| `qwen3-235b` | 0 | 0 | nein — reasoniert nie |
| `glm-5-2` | reasoniert | 299 | nein — reasoniert immer |
| `kimi-k2-7` | 217 | 137 | nein — reasoniert immer |
| `minimax-m3` | 615 | 396 | nein — reasoniert immer |
| `gpt-5-6-sol` | 0 | 0 | nein — erzwungen aus |
| `gpt-5-6-terra` | 0 | 0 | nein — erzwungen aus |

**Nur `opus-4-8` reagiert auf `--thinking`.** Bei allen anderen Modellen ist der Reasoning-Zustand eine Eigenschaft des Modells bzw. der Route, nicht des Aufrufs — `--thinking off`, das `:off`-Suffix am Modell-String und `models.json "reasoning": false` bleiben wirkungslos. Requesty-geroutete OpenAI-kompatible Modelle liefern Reasoning über den `reasoning_content`-Kanal (`thinkingSignature: "reasoning_content"`); es abzuschalten verlangt einen provider-spezifischen Body-Parameter, den pi weder sendet noch injizieren lässt (Modell-Einträge kennen nur `contextWindow, id, input, maxTokens, name, reasoning`; kein `--extra-body`).

**`gpt-5-6-sol` / `gpt-5-6-terra`: erzwungen aus.** Mit Reasoning an antwortet der Azure-Endpunkt `400: Function tools with reasoning_effort are not supported … use /v1/responses instead`; ein `openai-responses/gpt-5.6-*` existiert im Requesty-Katalog nicht (nur für 5.4 und 5.5). Beide laufen daher mit `"reasoning": false` in `pi-config/agent/models.json`.

**Konsequenz für das Design.** Reasoning wird als **Modell-Suffix** geführt, nicht als eigener `factors`-Eintrag: `<id>` (nativer Default) und `<id>-no-thinking` (`--thinking off`) sind zwei eigenständige Lab-Varianten mit identischem Routing. Das ist dieselbe Konvention wie `opus-4-7-no-thinking` in `research/workflow-dev/` und lässt die Zell-Auflösung der Aggregation unverändert.

Die Seil-Rätsel-Messung oben war ein **Ein-Prompt-Probe ohne Tool-Calls und ohne langen Kontext**. Ob der Schalter unter der echten Kata gleich reagiert, ist damit nicht belegt — deshalb bekommen alle Modelle, bei denen die Probe „nie" ergab (sonnet-5, deepseek-v4-pro, qwen3-235b) oder „immer" (kimi-k2-7, minimax-m3), trotzdem beide Arme. Der Vergleich ist dort ein **Test der Steuerbarkeit selbst**: fällt er auf null Differenz, werden die beiden Zellen in den Findings zusammengelegt und als „Schalter wirkungslos, empirisch geprüft" geführt — nicht als Reasoning-Effekt.

Nur wo der Schalter nachweislich nicht existiert, gibt es einen Arm: `glm-5-2` reasoniert auch mit `--thinking off` (im abgebrochenen 08:46-Run mit vollen `reasoning_content`-Blöcken bestätigt), `gpt-5-6-sol`/`-terra` laufen technisch erzwungen mit `"reasoning": false`. Bei diesen dreien ist der Reasoning-Zustand mit dem Modell konfundiert und beim Interpretieren mitzulesen.

Prüf-Query, ob Reasoning in einem Run tatsächlich aus war:

```bash
grep -oE '"reasoning":[0-9]+' run.log | grep -v ':0' | wc -l   # nonzero reasoning events
grep -c '"thinking":"' run.log                                  # thinking blocks
```

## Hypothesen

- **H2 (Modell-Spreizung dichotom)**: claim-office wirkt als Pass/Fail-Filter für Spec-Verstehen — Modelle clustern nahe 1.0 (verstanden) oder nahe 0.0 (Mehrdeutigkeit falsch aufgelöst / CLI-Vertrag verletzt), statt gradueller Verteilung. (Konsistent mit dem `-oc`-Befund: Opus/Kimi/Flash 1.00 vs MiniMax 0.00.)
- **H4 (TDD-Disziplin und Korrektheit korrelieren NICHT linear)**: `predictions_total`-Compliance ist nicht notwendig für Korrektheit — der TDD-Inhalt (Test-First-Disziplin) wirkt unabhängig von der Marker-Format-Compliance. (Konsistent mit `-oc`: Kimi 0/0 predictions + 15/15 verification.)

## Methodologische Anmerkungen

- Skeleton-/Erst-Befunde sind einzelne Datenpunkte — Replikate zeigen, ob Muster stabil sind. Memory [[replicates-n-reliability]]: n=3 bimodal-erkennend, n=5 für mittlere Sicherheit.
- Alle Modelle via Requesty, gemischte Backprovider — siehe RQ-model-quality-pi für Routing-Details.
- v6.2 erzwingt die Why-Block-/Skill-TDD-Mechanik; Agent-Drift in inline-Mode nach einigen Cycles möglich. `cycle_count` ist damit konservativ.
- `cli.ts`-Nudge ist für pi **verdrahtet** (`run-batch.sh`, pi-Branch): fehlt `src/cli.ts` bei vorhandenem `src/claim-office.ts`, wird der Agent einmal nachgefasst. Modelle, die ohne Domänen-Code abbrechen, werden bewusst nicht genudgt.
- `cli_built` spiegelt die tatsächliche Existenz von `src/cli.ts` (aus dem Runner-Command geparster Entry-Point), nicht mehr das Invocation-Verhalten. Ein `verification_pct = 0` mit `cli_built = false` heißt „kein CLI-Vertrag", nicht „Spec falsch aufgelöst".
- **Subagent-Modell-Kontamination (behoben 2026-07-24).** Die Subagent-Extension gab `--model` nur weiter, wenn die Agent-Datei selbst eines pinnte; `refactor.md` pinnt keines, also fielen alle Subagent-Spawns auf `defaultModel` (`bedrock/claude-opus-4-7@eu-west-1`) aus `pi-config/agent/settings.json` zurück. Die komplette Refactor-Phase lief damit auf Opus 4.7 statt auf dem Run-Modell — gemessen im 08:46-Batch: `gpt-5-6-sol` 77, `gpt-5-6-terra` 45, `opus-4-8` 12 Fremd-Calls. Fix: `PI_INHERIT_MODEL` in `run-batch.sh`, ausgewertet in `.pi/extensions/subagent/index.ts` (Reihenfolge: Agent-Frontmatter → geerbtes Parent-Modell → pi-Default). **Alle Runs vor diesem Fix (Smokes 01:44–08:12) sind für refactor-abgeleitete Metriken unbrauchbar** — `verification_pct` ist wahrscheinlich unbelastet, `refactorings_applied` und die Code-Qualitäts-Metriken sind es nicht. Fill-Runs starten neu.
- TDD-Disziplin-Metriken hängen davon ab, dass der pi-Transcript-Parser die v6.2-Marker erfasst (Smoke-Test-Regel aus CLAUDE.md). Verifiziert: opus-4-8 liefert `cycle_count`/`predictions` non-null. Die Werte stehen in `metrics.json` unter `.summary_metrics.*`, nicht unter `.final_metrics.*`.
