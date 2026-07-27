# Harness Mechanisms — Auto-Load vs. Explicit Invocation

Reference for the export skill's **invocation transformation**. Researched
2026-07-27 against the versions pinned in `experiments/docker/Dockerfile`:
Claude Code `2.1.170`, `opencode-ai@1.15.10`,
`@earendil-works/pi-coding-agent@0.81.1`, `cursor-agent` (dashboard key).

## Why this transformation exists

**Lab runs and consumer projects want opposite defaults.**

In the lab, every run *is* a TDD run. The workflow must load unconditionally
— there is no user to ask, and a run where the model "forgot" to do TDD is a
lost data point. So lab workflows use each harness's always-on mechanism.

In a consumer project, TDD is one activity among many. A developer fixing a
typo does not want Red-Green-Refactor discipline, prediction blocks, and
subagent delegation occupying their context. They want to *ask* for the
workflow: "let's TDD this feature."

So the exported baseline must convert **auto-loading configuration** into an
**explicitly-invoked skill**. This is a third transformation axis, alongside
HITL re-enablement and lab-content removal, and it applies to every harness.

## Per-harness mechanisms

### Claude Code

| | Mechanism |
|---|---|
| Auto-load (lab) | Every `*.md` in `.claude/rules/` enters context at session start. No reference needed — discovery is by directory convention. |
| Explicit (export) | `.claude/skills/<name>/SKILL.md` with YAML frontmatter. The `description` field decides when the model loads it. |

Export target: `.claude/skills/tdd/SKILL.md`. The frontmatter must state both
the trigger *and* the non-trigger — a description that only says what the
skill does will fire on general coding tasks:

```yaml
---
name: tdd
description: Strict Test-Driven Development workflow (Red-Green-Refactor) with configurable human-in-the-loop checkpoints. Invoke when the user explicitly asks to use TDD, do a TDD kata, or follow the Red-Green-Refactor discipline. Do NOT invoke for general coding tasks where the user has not asked for TDD.
---
```

Phase commands (`commands/red.md` etc.) and subagents (`agents/refactor.md`)
keep their own locations — those are invoked *by the workflow*, not by the
user, so they need no gating.

### pi

| | Mechanism |
|---|---|
| Auto-load (lab) | `.pi/AGENTS.md`, read via cwd walk-up. |
| Explicit (export) | `.pi/skills/<name>/SKILL.md`, registered as `/skill:<name>`. |

Pi implements the [Agent Skills standard](https://agentskills.io/specification).
Frontmatter `name` (max 64 chars, lowercase/digits/hyphens) and `description`
(max 1024 chars) are required.

**Subagents on pi require a bundled extension.** pi ships no native
subagent tool. The `subagent` tool used by the refactor phase is provided
by a project-local extension at `.pi/extensions/subagent/` — three files
(`index.ts`, `agents.ts`, `README.md`) that must travel with any pi export.
Omitting them does not error: the model simply has no `subagent` tool, so
refactoring silently collapses into the main context and the
isolated-context architecture is lost (in the lab this shows up as
`refactorings_applied` dropping to 0).

Two further constraints:

- **Trust gating.** pi loads project-local extensions only after the
  project is trusted. The lab passes `--approve` because non-interactive
  `-p` mode offers no prompt; an interactive consumer is prompted on first
  use and must accept. Document this in the exported README — a declined
  prompt yields a workflow with no refactor step.
- **`agentScope: "both"`.** The refactor agent lives in project-local
  `.pi/agents/`. Without this flag the subagent extension sees only
  user-level agents and the call fails with `Unknown agent: refactor`.

Two pi-specific options worth knowing:

- **`disable-model-invocation: true`** hides the skill from the system prompt
  entirely; only `/skill:tdd` loads it. This is the strictest possible
  "explicit" setting — appropriate when the consumer wants zero TDD context
  unless they type the command.
- **`enableSkillCommands`** (settings) toggles whether `/skill:name` commands
  register at all. Default behavior assumes they do.

> **Correction to a long-standing lab assumption.** The lab pi workflow's
> `AGENTS.md` states skills are "auto-loaded documents, not tool calls" and
> that "the model reads each SKILL.md once and then follows its
> instructions." Per pi's own docs this is **not accurate**: at startup pi
> extracts only *names and descriptions* into the system prompt; the agent
> must then use `read` to load the full SKILL.md on demand — and the docs
> explicitly warn "models don't always do this; use prompting or
> `/skill:name` to force it."
>
> This is a plausible alternative explanation for the v6.2.1
> continuation-drop (models settling at the Test-List → Red boundary): the
> model may never have loaded `red/SKILL.md` at all, rather than having read
> a prose announcement as a turn terminus. Not investigated — recorded here
> because it affects how the pi lab workflow should be read, and because a
> future RQ may want to test `/skill:` forcing as a fix.

### OpenCode

| | Mechanism |
|---|---|
| Auto-load (lab) | `opencode.json(c)` → `"instructions": ["AGENTS.md"]`, plus root `AGENTS.md`. |
| Explicit (export) | A `command` entry in `opencode.json`, invoked by name. |

OpenCode commands are declared inline in config with a `description` and a
`prompt`, e.g. the `tdd-auto` / `example-mapping` / `code-review` commands in
the exercises repo. Subagents live in `.opencode/agents/*.md` with
`mode: subagent` frontmatter and are launched by the command's prompt.

Export approach: keep the phase agents, move the orchestration prose out of
the always-loaded `AGENTS.md` into a `command.tdd` entry. Removing
`AGENTS.md` from `instructions` is what makes it non-automatic.

### cursor-agent

| | Mechanism |
|---|---|
| Auto-load (lab) | `.cursor/rules/*.mdc` with `alwaysApply: true`. |
| Explicit (export) | Same files with `alwaysApply: false` + a specific `description` ("Agent Requested"). |

Cursor has no separate skills directory — `.cursor/rules/` is the only
mechanism, and the gate is frontmatter. Three modes:

| Frontmatter | Behavior |
|---|---|
| `alwaysApply: true` | Always in context (lab default) |
| `alwaysApply: false` + `description` | Model pulls it in when the description matches (export target) |
| `alwaysApply: false` + `globs` | Auto-attached for matching files |

#### Subagents — cursor has them natively

Cursor has supported subagents since **v2.4** (docs:
https://cursor.com/docs/subagents). This matters for the refactor phases:
cursor is a full peer of cc here, not a degraded variant.

| | |
|---|---|
| Tool | native `Task` tool (`taskToolCall` in stream-json) |
| Custom agents | `.cursor/agents/*.md` — also reads `.claude/agents/` and `.codex/agents/`, with `.cursor/` winning name conflicts |
| Frontmatter | `name`, `description`, `model` (default `inherit`), `readonly`, `is_background` |
| Invocation | automatic delegation, `/agent-name …`, or plain language |
| Built-ins | Explore, Bash, Browser (no configuration needed) |
| Headless | works in `-p --force`; verified against `cursor-agent 2026.07.23-e383d2b` |

Verified event shape:

```
tool_call / subtype=completed
  tool_call.taskToolCall.args.subagentType.custom.name = "refactor"
  tool_call.taskToolCall.result.success.conversationSteps[…]
```

Built-in subagents arrive as `taskToolCall` too but carry no
`subagentType.custom.name`, so a parser keying on that field ignores them.

> **A prior version of this file claimed cursor had no subagent mechanism and
> that refactor must run inline.** That was wrong, and it shaped both cursor
> lab workflows plus the 2026-07-27 export before being caught. When a harness
> appears to lack a capability, check its docs and probe the CLI before
> designing around the gap.

Note the exercises repo already uses the glob form for
`tdd-with-ts-and-vitest.mdc` — TS/Vitest conventions *should* attach when
editing test files, independent of whether a TDD session was requested.
Only `tdd.mdc` and `human-in-the-loop.mdc` need flipping to the
description-gated form.

## Summary table

| Harness | Lab (auto) | Export (explicit) | Gate |
|---|---|---|---|
| Claude Code | `.claude/rules/*.md` | `.claude/skills/tdd/SKILL.md` | frontmatter `description` |
| pi | `.pi/AGENTS.md` | `.pi/skills/tdd/SKILL.md` | `description`, optional `disable-model-invocation` |
| OpenCode | `AGENTS.md` via `instructions` | `command.tdd` in `opencode.json` | command name |
| cursor | `.cursor/rules/*.mdc` `alwaysApply: true` | same file, `alwaysApply: false` | `description` |

## Strip environment-specific configuration

**The exported baseline must be usable by anyone.** It is a general-purpose
workflow, not a copy of one lab's setup. Anything that only works in the
environment it was exported *from* has to be removed — not documented, not
carried along with a warning.

Concretely, an export must never contain:

- **Provider / routing configuration** — gateway `baseURL`s, model rosters,
  region pins. A consumer routes through their own provider.
- **Credential references** — `{env:SOME_KEY}`, API-key placeholders,
  auth-token names. Even a reference (not the secret itself) encodes
  someone else's setup and breaks on a machine where that variable is
  unset.
- **Absolute paths, machine names, container assumptions.**
- **Harness-version pins** that exist for lab reproducibility rather than
  because the workflow needs them.

What legitimately stays: the workflow itself, and permissions the workflow
genuinely needs (e.g. running the test command).

The failure mode is silent — a consumer copies the directory, the config
references an environment variable they have never heard of, and the
harness fails with an error that points nowhere near the real cause.

### Where this bites: `opencode.json`

`opencode.json` is the one harness config that mixes both concerns. In the
lab it carries the provider block — gateway `baseURL`s, `{env:...}` key
references, the full model roster — alongside the command definitions.

Do not copy it. Rewrite it. A consumer `opencode.json` needs exactly three
keys:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "command": { "tdd": { "description": "...", "prompt": "<orchestration>" } },
  "permission": { "...": "..." }
}
```

No `provider` block, no `instructions` array. Verify after writing:

```bash
python3 -c "
import json;c=json.load(open('\$TARGET/.opencode/opencode.json'))
assert 'provider' not in c, 'FAIL: lab routing config leaked'
assert not c.get('instructions'), 'FAIL: AGENTS.md still auto-loaded'"
```

The same caution applies to any harness config that mixes workflow and
infrastructure. `settings.json` (cc) is safe — it only carries a
permissions allowlist. `.pi/` has no config file in the workflow at all
(routing lives in the container's `models.json`, outside the workflow).

## Keep the harness variants feature-equal

**Goal: all v6.6 variants are identical, as far as the harness allows.**
Differences should come from what a harness *can* do, never from a port
that lagged behind.

Harness variants are ports, and ports drift. The v6.6 line was assembled
from different generations — cc from v6.5, the rest from v6.2.x — which
initially left the **end-refactor** phase in cc only. That was a defect,
not a design choice, and was closed on 2026-07-27: all four variants now
run the final metric-driven pass.

When a variant is missing a phase the others have, **port it** rather than
documenting the gap. Translate the mechanism, keep the content:

| Harness | End-refactor is realised as |
|---|---|
| cc | `agents/end-refactor.md`, `Task({subagent_type: "end-refactor"})` |
| pi | `agents/end-refactor.md`, `subagent` tool + `agentScope: "both"` |
| oc | `agents/end-refactor.md`, `mode: subagent`, `task` tool |
| cursor | `.cursor/agents/end-refactor.md`, native `Task` tool |

All four delegate to an isolated subagent. The only genuine harness-forced
difference in this area is **pi**, which needs a bundled extension and a trust
prompt to get a `subagent` tool at all; cc, oc and cursor have one natively.

Porting a phase means four things, not one — a new agent file alone is
inert:

1. The agent/skill file itself, with harness-native frontmatter.
2. A step in the orchestration file that actually invokes it.
3. An entry in the Workflow Sequence summary.
4. On lab variants: the done-marker condition, and the phase-continuation
   chain, both of which must know the run does not end at the last cycle.

### Text-marker harnesses: check the regex before choosing a marker

On pi and cursor the red/green/test-list phases are auto-loaded documents with
no tool call of their own, so the parser reads headings — and its patterns are
narrow. (The refactor phases are exempt: they are delegated, so
`parse_cursor_transcript.py` counts the `taskToolCall` instead of a heading.)

The legacy refactor regex is still worth knowing, since text-marker runs
predate the delegated contract: `##\s*Refactor\b` does **not** match
`## End-Refactor` (the word is not at the start after `##`), which silently
hid the final pass in the 2026-07 cursor workflows.

Verify a new marker against the live regex before adopting it:

```python
import re
r = re.compile(r"##\s*Refactor\b", re.IGNORECASE)
r.search("## End-Refactor")           # False — would be invisible
r.search("## Refactor (final pass)")  # True  — use this
```

Prefer a marker that fits the existing parser over changing the parser.
Changing a parser re-scopes every historical run that used the old form.

## What stays auto-loaded even in the export

Not everything should be gated. Language/test conventions
(`tdd-with-ts-and-vitest.md`) are useful whenever someone touches a
`*.spec.ts`, whether or not they invoked the TDD workflow. Prefer the
glob-attached form there (cursor) or leave it as an ordinary rule (CC).

The gate belongs on the **workflow** — the Red-Green-Refactor discipline,
the phase sequence, the HITL checkpoints — not on the ambient conventions.
