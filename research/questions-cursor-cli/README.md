# research/questions-cursor-cli/

Research questions that have the **cursor-cli harness** (`cursor-agent`) as their subject.

Convention:
- RQ dirs as `<chapter>-<slug>/` (e.g. `1.1-model-quality-cursor/`).
- The frontmatter `id:` is the stable identity (e.g. `RQ-model-quality-cursor`).
- Workflow values are cursor-cli workflows (suffix `-cursor`) — identifiable by the `.cursor/` directory in `experiments/workflows/<name>/`.
- Models: lab variant IDs for the models reachable via `cursor-agent -m/--model`. cursor-cli is a **routing path of its own** alongside Requesty (pi/OpenCode) and Claude-native (Claude Code): auth via `CURSOR_API_KEY` (Cursor subscription), model selection via Cursor's own model roster.

Cross-harness RQs (Claude vs OpenCode vs pi vs cursor-cli) live under `../questions-cross/`.

## Routing paths in the lab (as of 2026-07-26)

The lab has **three** routing paths, not one:

| Path | Harnesses | Auth / config | Provider |
|---|---|---|---|
| **Requesty** | pi, OpenCode | `REQUESTY_API_KEY` → `.env` (CC label), `opencode.json`, `models.json` | OpenAI-compatible, multi-backprovider |
| **Claude-native** | Claude Code | `~/.claude/.credentials.json` (OAuth) | Anthropic Direct API, list price |
| **cursor-cli** *(new)* | cursor-agent | `CURSOR_API_KEY` (Cursor subscription) | Cursor's own model roster |

cursor-cli joins as the **third path / fourth harness**. Costs run through the Cursor subscription, not through the Requesty tariff or the Anthropic list price — this has to be named explicitly in cost cross-checks (a tariff confound of its own).

## Harness status: walking skeleton

**As of 2026-07-26**: the cursor-cli harness is **fully wired into `experiments/docker/run-batch.sh` and verified end-to-end.** All five building blocks are built (marker detection, config copy, invocation branch, model mapping, `parse_cursor_transcript.py` + `analyze-run.sh` dispatch), Docker installs `cursor-agent`, and a smoke run on game-of-life × `opus-cursor` went through cleanly (cycle_count=9, refactorings=7, predictions 18/18, 9/9 tests green, `marker_source=text-markers`). The RQs are **open (n=0)** until the fill batches run — the harness itself is ready for use.

### Research status `cursor-agent` (2026-07-26, smoke run completed)

Installed: `cursor-agent` v2026.01.23-916f423 (host `~/.local/bin/cursor-agent`). `--help` plus a smoke run on a throwaway kata completed.

**Confirmed from `--help` — cursor-agent has the basic harness flags:**

- **Headless / non-interactive**: `-p, --print` (print mode, has access to all tools incl. write/bash). Force-allow via `-f, --force` (the analogue of pi `--approve` — **not** `--trust`, that was a docs artifact). Additionally `--approve-mcps` for MCP servers headless.
- **Machine-readable output**: `--output-format text|json|stream-json` (only with `--print`); `--stream-partial-output` for text deltas.
- **Model pinning**: `--model <model>` (examples in the help: `gpt-5`, `sonnet-4`, `sonnet-4-thinking`). Reasoning is **per model suffix** (`-thinking`), there is **no** `--thinking` flag → analogous to OC, not analogous to pi.
- **Workspace**: `--workspace <path>` sets cwd explicitly (useful for the run_dir).
- **Model roster**: `--list-models` / the `models` subcommand are **broken** (report "No models available" even with a valid key) — the real roster comes from the `--model ___nope___` error message + the `system/init` event (see below). Default model according to `about`: "Composer 1".

**✅ Headless auth solved (smoke run 2026-07-26).**

- Headless needs a **real dashboard `CURSOR_API_KEY`** (format `crsr_…`), NOT the interactive OAuth token from `~/.config/cursor/auth.json` (that one is rejected as `CURSOR_API_KEY` with `⚠ invalid`). With a valid key, `-p --force` runs through cleanly: writes files, exit 0.
- **Quirk**: `cursor-agent models` / `--list-models` reports "No models available for this account" even with a valid key — the roster subcommand is broken/authenticated differently. The real roster instead comes from the **error message on an invalid `--model`** (`cursor-agent -p --model ___nope___` → "Available models: …", 190 models) and from the `system/init` event of every run (echoes `.model` as the resolved name).
- **`cursor-agent status` is misleading** (reports "✓ Login successful" even without usable auth) — do not use it as proof of auth.

**✅ Output schema captured (`--output-format stream-json`):**

`json` returns only a **summary object** (`{type:"result", result, usage:{inputTokens,outputTokens,cacheReadTokens,cacheWriteTokens}, duration_ms, session_id}`) — no event stream, insufficient for the parser. **`stream-json`** is the parser input: NDJSON, one event per line. Observed event types:

| `type`/`subtype` | Content for the parser |
|---|---|
| `system`/`init` | `.model` = resolved model name (e.g. "Opus 4.8 300K High") → model verification per run |
| `user`/`-` | initial prompt |
| `assistant`/`-` | text responses (`.message.content[]`) |
| `thinking`/`delta`+`completed` | reasoning tokens |
| `tool_call`/`started`+`completed` | **core for parsing**: `.tool_call.editToolCall.args.path`, `.result.success.{linesAdded,linesRemoved,diffString,afterFullFileContent}`; bash tools analogous. From this: file writes, LoC deltas, test runs → TDD markers. |
| `result`/`success` | completion + `usage` (token counts for `cost_usd`/`total_tokens`) |

Termination: clean exit 0 under the `timeout` wrapper, no hangs observed.

**✅ Reasoning control**: effort is encoded **in the model name** (`-low/-medium/-high/-xhigh/-max`, optionally `-thinking`, optionally `-fast`), no `--thinking` flag → like OC. Bare `claude-opus-4-8` → "Opus 4.8 300K High" (thinking on); `claude-opus-4-8-medium` → "…Medium No Thinking".

### Real model roster for the three RQ families (smoke run 2026-07-26)

Out of 190 models, the ones relevant for Opus/Composer/Grok, all verified with `--model` (resolved via `system/init`):

| RQ model | verified `--model` IDs (selection) | reasoning suffixes |
|---|---|---|
| **Opus** | `claude-opus-4-8` (→ "Opus 4.8 300K High"), `claude-opus-4-8-medium` (→ "…Medium No Thinking"), also `claude-opus-5-*`, `claude-opus-4-7-*` | `-low/-medium/-high/-xhigh/-max`, optionally `-thinking`, optionally `-fast` |
| **Composer** | `composer-2.5` (→ "Composer 2.5"), `composer-2.5-fast` | no effort suffixes (only `/-fast`) |
| **Grok** | `cursor-grok-4.5-medium` (→ "Cursor Grok 4.5 Medium"), `-low`, `-high`, each with `-fast` | `-low/-medium/-high`, optionally `-fast`. Bare `grok*` is **rejected** — the prefix `cursor-grok-` is mandatory. |

Others in the roster: `gpt-5.x-codex-*`, `gpt-5.6-sol-*`, `claude-fable-5-*`, `claude-4.6-opus-*`, `auto`. Full roster at any time via `cursor-agent -p --force --model ___nope___ "hi" 2>&1 | grep -oiE "Available models:.*"`.

**Fair baseline comparison**: Opus + Grok on `-medium` (no-thinking, comparable effort level), Composer on `composer-2.5`. Composer has no effort axis — note as a caveat that the three are not at an identical effort level.

### The five harness building blocks (analogous to pi)

What has to be built before fill runs are possible:

1. **Marker dir** `.cursor/` → new `elif` branch in `run-batch.sh` (harness detection, ~line 438).
2. **Config copy** `.cursor/` → `run_dir` (~line 462).
3. **Invocation branch** `harness = cursor`: `cursor-agent -p --force --output-format json --model "$cursor_model" --workspace "$run_dir" …` inside the `timeout` wrapper (analogous to the pi branch ~line 649). **Requires `CURSOR_API_KEY` in the container env** (real dashboard key, see blocker above) — via `.env`/docker-compose, analogous to `REQUESTY_API_KEY`.
4. **Model mapping** lab variant → cursor `--model` string (`case "$model_name"`, analogous to pi ~line 682). Registration of the lab variants in `MODEL_CONFIGS` with a `cursor-only` placeholder (analogous to `pi-only`/`oc-only`).
5. **Transcript parser** `experiments/parse_cursor_transcript.py` — translates the cursor JSON event stream into the lab metrics (four TDD markers from `MARKERS.md`, `cc_*`/`mccabe_*`/`cognitive_*`, tool calls). Dispatch in `analyze-run.sh` by harness.

Additionally on the RQ documentation side: at least one cursor-cli workflow in `experiments/workflows/` (suffix `-cursor`, with a `.cursor/` marker) that emits the four TDD markers from `experiments/workflows/MARKERS.md` cleanly.

## Smoke-test rule (before the first batch)

As with pi (CLAUDE.md): before the first batch, verify that a cursor-cli run delivers the TDD discipline metrics `!= null`:

```bash
jq '.summary_metrics | {cycle_count, refactorings_applied, predictions_correct, predictions_total, tests_passing}' \
  experiments/runs/<latest-cursor-run>/metrics.json
```

If `cycle_count`/`predictions_*` are null, the parser (building block 5) is not picking up the markers — do not batch, fix the parser first.
