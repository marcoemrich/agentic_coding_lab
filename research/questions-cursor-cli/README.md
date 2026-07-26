# research/questions-cursor-cli/

Forschungsfragen, die den **cursor-cli-Harness** (`cursor-agent`) als Subjekt haben.

Konvention:
- RQ-Dirs als `<chapter>-<slug>/` (z.B. `1.1-model-quality-cursor/`).
- Frontmatter-`id:` ist die stabile Identität (z.B. `RQ-model-quality-cursor`).
- Workflow-Werte sind cursor-cli-Workflows (Suffix `-cursor`) — erkennbar am `.cursor/`-Verzeichnis in `experiments/workflows/<name>/`.
- Modelle: Lab-Variant-IDs für die über `cursor-agent -m/--model` erreichbaren Modelle. cursor-cli ist ein **eigener Routing-Pfad** neben Requesty (pi/OpenCode) und Claude-native (Claude Code): Auth via `CURSOR_API_KEY` (Cursor-Abo), Modell-Auswahl über den Cursor-eigenen Model-Roster.

Harness-übergreifende RQs (Claude vs OpenCode vs pi vs cursor-cli) leben unter `../questions-cross/`.

## Routing-Pfade im Lab (Stand 2026-07-26)

Das Lab hat **drei** Routing-Pfade, nicht einen:

| Pfad | Harnesse | Auth / Config | Provider |
|---|---|---|---|
| **Requesty** | pi, OpenCode | `REQUESTY_API_KEY` → `.env` (CC-Label), `opencode.json`, `models.json` | OpenAI-kompatibel, Multi-Backprovider |
| **Claude-native** | Claude Code | `~/.claude/.credentials.json` (OAuth) | Anthropic Direct-API, Listenpreis |
| **cursor-cli** *(neu)* | cursor-agent | `CURSOR_API_KEY` (Cursor-Abo) | Cursor-eigener Model-Roster |

cursor-cli kommt als **dritter Pfad / viertes Harness** dazu. Kosten laufen über das Cursor-Abo, nicht über Requesty-Tarif oder Anthropic-Listenpreis — das ist bei Kosten-Cross-Checks explizit zu benennen (eigener Tarif-Confound).

## Harness-Status: Walking Skeleton

**Stand 2026-07-26**: Der cursor-cli-Harness ist **vollständig in `experiments/docker/run-batch.sh` verdrahtet und End-to-End verifiziert.** Alle fünf Bausteine sind gebaut (Marker-Detection, Config-Copy, Invocation-Branch, Modell-Mapping, `parse_cursor_transcript.py` + `analyze-run.sh`-Dispatch), Docker installiert `cursor-agent`, und ein Smoke-Run auf game-of-life × `opus-cursor` lief sauber durch (cycle_count=9, refactorings=7, predictions 18/18, 9/9 Tests grün, `marker_source=text-markers`). Die RQs sind **offen (n=0)**, bis die Fill-Batches laufen — Harness selbst ist einsatzbereit.

### Recherche-Stand `cursor-agent` (2026-07-26, Smoke-Run durchgeführt)

Installiert: `cursor-agent` v2026.01.23-916f423 (Host `~/.local/bin/cursor-agent`). `--help` + Smoke-Run auf einer Wegwerf-Kata durchgeführt.

**Aus `--help` bestätigt — cursor-agent hat die Harness-Grund-Flags:**

- **Headless / non-interactive**: `-p, --print` (print mode, hat Zugriff auf alle Tools inkl. write/bash). Force-allow via `-f, --force` (das Analog zu pi `--approve` — **nicht** `--trust`, das war ein Docs-Artefakt). Zusätzlich `--approve-mcps` für MCP-Server headless.
- **Maschinenlesbarer Output**: `--output-format text|json|stream-json` (nur mit `--print`); `--stream-partial-output` für Text-Deltas.
- **Modell-Pinning**: `--model <model>` (Beispiele im Help: `gpt-5`, `sonnet-4`, `sonnet-4-thinking`). Reasoning ist **per Modell-Suffix** (`-thinking`), es gibt **kein** `--thinking`-Flag → analog OC, nicht analog pi.
- **Workspace**: `--workspace <path>` setzt cwd explizit (nützlich fürs run_dir).
- **Modell-Roster**: `--list-models` / `models`-Subcommand sind **kaputt** (liefern „No models available" auch mit gültigem Key) — realer Roster kommt aus der `--model ___nope___`-Fehlermeldung + `system/init`-Event (siehe unten). Default-Modell laut `about`: "Composer 1".

**✅ Headless-Auth gelöst (Smoke-Run 2026-07-26).**

- Headless braucht einen **echten Dashboard-`CURSOR_API_KEY`** (Format `crsr_…`), NICHT den interaktiven OAuth-Token aus `~/.config/cursor/auth.json` (der wird als `CURSOR_API_KEY` mit `⚠ invalid` abgelehnt). Mit gültigem Key läuft `-p --force` sauber durch: schreibt Dateien, exit 0.
- **Quirk**: `cursor-agent models` / `--list-models` meldet auch mit gültigem Key „No models available for this account" — der Roster-Subcommand ist kaputt/anders auth'd. Der reale Roster kommt stattdessen aus der **Fehlermeldung bei ungültigem `--model`** (`Cursor-agent -p --model ___nope___` → „Available models: …", 190 Modelle) und aus dem `system/init`-Event jedes Runs (echoed `.model` als resolved name).
- **`cursor-agent status` ist irreführend** (meldet „✓ Login successful" auch ohne nutzbare Auth) — nicht als Auth-Beleg verwenden.

**✅ Output-Schema erfasst (`--output-format stream-json`):**

`json` gibt nur ein **Summary-Objekt** (`{type:"result", result, usage:{inputTokens,outputTokens,cacheReadTokens,cacheWriteTokens}, duration_ms, session_id}`) — kein Event-Stream, für den Parser unzureichend. **`stream-json`** ist der Parser-Input: NDJSON, ein Event pro Zeile. Beobachtete Event-Typen:

| `type`/`subtype` | Inhalt für den Parser |
|---|---|
| `system`/`init` | `.model` = resolved model name (z.B. "Opus 4.8 300K High") → Modell-Verifikation pro Run |
| `user`/`-` | initialer Prompt |
| `assistant`/`-` | Text-Antworten (`.message.content[]`) |
| `thinking`/`delta`+`completed` | Reasoning-Tokens |
| `tool_call`/`started`+`completed` | **Kern fürs Parsing**: `.tool_call.editToolCall.args.path`, `.result.success.{linesAdded,linesRemoved,diffString,afterFullFileContent}`; Bash-Tools analog. Daraus Datei-Writes, LoC-Deltas, Test-Runs → TDD-Marker. |
| `result`/`success` | Abschluss + `usage` (Token-Counts für `cost_usd`/`total_tokens`) |

Terminierung: sauberer exit 0 unter `timeout`-Wrapper, kein Hängen beobachtet.

**✅ Reasoning-Steuerung**: Effort ist **im Modell-Namen** kodiert (`-low/-medium/-high/-xhigh/-max`, optional `-thinking`, optional `-fast`), kein `--thinking`-Flag → wie OC. Bare `claude-opus-4-8` → "Opus 4.8 300K High" (thinking an); `claude-opus-4-8-medium` → "…Medium No Thinking".

### Realer Modell-Roster für die drei RQ-Familien (Smoke-Run 2026-07-26)

Aus 190 Modellen die für Opus/Composer/Grok relevanten, alle mit `--model` verifiziert (resolved via `system/init`):

| RQ-Modell | verifizierte `--model`-IDs (Auswahl) | Reasoning-Suffixe |
|---|---|---|
| **Opus** | `claude-opus-4-8` (→ "Opus 4.8 300K High"), `claude-opus-4-8-medium` (→ "…Medium No Thinking"), auch `claude-opus-5-*`, `claude-opus-4-7-*` | `-low/-medium/-high/-xhigh/-max`, optional `-thinking`, optional `-fast` |
| **Composer** | `composer-2.5` (→ "Composer 2.5"), `composer-2.5-fast` | keine Effort-Suffixe (nur `/-fast`) |
| **Grok** | `cursor-grok-4.5-medium` (→ "Cursor Grok 4.5 Medium"), `-low`, `-high`, je `-fast` | `-low/-medium/-high`, optional `-fast`. Bares `grok*` wird **abgelehnt** — Präfix `cursor-grok-` ist Pflicht. |

Weitere im Roster: `gpt-5.x-codex-*`, `gpt-5.6-sol-*`, `claude-fable-5-*`, `claude-4.6-opus-*`, `auto`. Voller Roster jederzeit via `cursor-agent -p --force --model ___nope___ "hi" 2>&1 | grep -oiE "Available models:.*"`.

**Fairer Baseline-Vergleich**: Opus + Grok auf `-medium` (no-thinking, vergleichbares Effort-Level), Composer auf `composer-2.5`. Composer hat keine Effort-Achse — als Caveat notieren, dass die drei nicht auf identischem Effort-Level stehen.

### Die fünf Harness-Bausteine (analog pi)

Was gebaut werden muss, bevor Fill-Runs möglich sind:

1. **Marker-Dir** `.cursor/` → neuer `elif`-Zweig in `run-batch.sh` (Harness-Detection, ~Zeile 438).
2. **Config-Copy** `.cursor/` → `run_dir` (~Zeile 462).
3. **Invocation-Branch** `harness = cursor`: `cursor-agent -p --force --output-format json --model "$cursor_model" --workspace "$run_dir" …` im `timeout`-Wrapper (analog pi-Branch ~Zeile 649). **Setzt `CURSOR_API_KEY` im Container-Env voraus** (echter Dashboard-Key, siehe Blocker oben) — via `.env`/docker-compose, analog `REQUESTY_API_KEY`.
4. **Modell-Mapping** Lab-Variant → cursor-`--model`-String (`case "$model_name"`, analog pi ~Zeile 682). Registrierung der Lab-Variants in `MODEL_CONFIGS` mit `cursor-only`-Platzhalter (analog `pi-only`/`oc-only`).
5. **Transcript-Parser** `experiments/parse_cursor_transcript.py` — übersetzt den cursor JSON-Event-Stream in die Lab-Metriken (vier TDD-Marker aus `MARKERS.md`, `cc_*`/`mccabe_*`/`cognitive_*`, Tool-Calls). Dispatch in `analyze-run.sh` nach Harness.

Zusätzlich RQ-Doku-seitig: mindestens ein cursor-cli-Workflow in `experiments/workflows/` (Suffix `-cursor`, mit `.cursor/`-Marker), der die vier TDD-Marker aus `experiments/workflows/MARKERS.md` sauber emittiert.

## Smoke-Test-Regel (vor dem ersten Batch)

Wie bei pi (CLAUDE.md): Vor dem Erstbatch verifizieren, dass ein cursor-cli-Run die TDD-Disziplin-Metriken `!= null` liefert:

```bash
jq '.summary_metrics | {cycle_count, refactorings_applied, predictions_correct, predictions_total, tests_passing}' \
  experiments/runs/<latest-cursor-run>/metrics.json
```

Wenn `cycle_count`/`predictions_*` null sind, greift der Parser (Baustein 5) die Marker nicht — nicht batchen, erst Parser fixen.
