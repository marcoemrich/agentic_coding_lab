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
| Explicit (export) | A `command` entry in `opencode.jsonc`, invoked by name. |

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
| OpenCode | `AGENTS.md` via `instructions` | `command.tdd` in `opencode.jsonc` | command name |
| cursor | `.cursor/rules/*.mdc` `alwaysApply: true` | same file, `alwaysApply: false` | `description` |

## Config files carry lab routing — rewrite, don't copy

`opencode.json` is **not** a pure workflow file. In the lab it also holds
the provider configuration: Requesty and Portkey `baseURL`s, `{env:...}`
API-key references, and the model roster used by batch runs. Copying it
into a snapshot ships routing config that is useless to a consumer,
references environment variables they do not have, and advertises internal
infrastructure.

Rewrite it instead. A consumer `opencode.json` needs exactly three keys:

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

## Not every harness variant is at the same generation

The lab's harness variants are ports, and ports lag. As of 2026-07 only the
cc variant carries the **end-refactor** phase (added in v6.5); the pi, oc
and cursor variants descend from v6.2.x predecessors that never got it.

Consequence for an export: the harness subtrees are **not** feature-equal.
`.claude/` ships `agents/end-refactor.md` and a step 6 in the workflow;
the other three stop after the last per-cycle refactor. That is a real
difference in what the consumer gets, not a packaging detail.

Check before reporting an export as complete:

```bash
for h in claude pi opencode cursor; do
  printf '%-9s ' "$h"
  find "$TARGET/.$h" -name '*end-refactor*' | grep -q . && echo "has end-refactor" || echo "no end-refactor"
done
```

Say so in the report. Do not silently imply the four subtrees are
equivalent — and do not invent an end-refactor phase for a harness whose
lab variant has never been measured with one.

## What stays auto-loaded even in the export

Not everything should be gated. Language/test conventions
(`tdd-with-ts-and-vitest.md`) are useful whenever someone touches a
`*.spec.ts`, whether or not they invoked the TDD workflow. Prefer the
glob-attached form there (cursor) or leave it as an ordinary rule (CC).

The gate belongs on the **workflow** — the Red-Green-Refactor discipline,
the phase sequence, the HITL checkpoints — not on the ambient conventions.
