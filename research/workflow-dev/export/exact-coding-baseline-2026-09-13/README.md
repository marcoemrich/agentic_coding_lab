# Exact Coding TDD Baseline — Version 2026-09-13

A ready-to-copy Test-Driven Development workflow for four coding agents, with
configurable human-in-the-loop checkpoints. Copy the one directory your agent
reads into your project root — the four subtrees are independent.

| Agent | Directory | Start a TDD session with |
|---|---|---|
| Claude Code | `.claude/` | `/tdd`, or ask for TDD in plain language |
| pi | `.pi/` | `/skill:tdd`, or ask for TDD in plain language |
| OpenCode | `.opencode/` | `/tdd` |
| cursor-agent | `.cursor/` | `/tdd`, or ask for TDD in plain language |

Source workflow: `exact-hybrid-v2-testlist-fix` (`-cc`, `-pi`, `-oc`, `-cursor`)
from `agentic_coding_lab_project/experiments/workflows/`. Validated on Claude
Opus 5 with Claude Code; the other three are ports of the same workflow.

## The workflow

Test-List once, then Red → Green → Refactor for every test, until the list is done.

| Phase | Runs in | Claude Code | pi | OpenCode | cursor-agent |
|---|---|---|---|---|---|
| Test List | main context | `test-list` command | `test-list` skill (read) | `test-list` skill | `test-list` skill (read) |
| Red | main context | `red` command | `red` skill (read) | `red` skill | `red` skill (read) |
| Green | main context | `green` command | `green` skill (read) | `green` skill | `green` skill (read) |
| Refactor | **isolated subagent** | Task → `agents/refactor.md` | `subagent` tool → `agents/refactor.md` | `task` tool → `agents/refactor.md` | Task → `agents/refactor.md` |

All four delegate Refactor to an isolated subagent; only the tool name differs.
The one genuinely harness-forced difference is pi, which has no native subagent
tool and gets one from the bundled extension in `.pi/extensions/subagent/`.

### Manual extra: `end-refactor` (not part of the workflow)

> **You have to start this yourself. The workflow never runs it.**

Every subtree ships `skills/end-refactor/SKILL.md`: a measured cleanup across
the whole `src/` (ESLint smells, cognitive complexity, McCabe, APP mass, one
change at a time). Ask for it by name when a piece of work is finished and you
want more than the per-cycle refactor. It is not in the loop because it costs
noticeably more time and tokens without making the average function smaller.

### Optional: Example Mapping before the loop

Every subtree also ships `skills/example-mapping/SKILL.md`, a conversation that
collects business rules and concrete examples before any test is written.
Concrete examples are the single biggest lever for getting a task right — see
the measurements in `.claude/README.md`.

## Invocation is opt-in on every agent

None of the four load the workflow automatically. A session where you never ask
for TDD gets no Red-Green-Refactor discipline.

| Agent | Gate |
|---|---|
| Claude Code | `skills/tdd/SKILL.md` frontmatter `description` (with a "do NOT invoke" clause) |
| pi | `skills/tdd/SKILL.md`, registered as `/skill:tdd` |
| OpenCode | `command.tdd` in `opencode.json` |
| cursor-agent | `skills/tdd/SKILL.md` frontmatter `description`, invoked as `/tdd` |

## Human-in-the-loop

Default Autonomy Level `full-hitl`: the agent stops after Test-List, after Red
and after Refactor, and immediately on a wrong prediction. It does not stop
after Green. Other levels: `refactor-only`, `red-only`, `every-n-tests N`,
`task-end`, `autonomous`. Change one line at the top of the HITL file:

| Agent | File |
|---|---|
| Claude Code | `.claude/skills/tdd/human-in-the-loop.md` |
| pi | `.pi/rules/human-in-the-loop.md` |
| OpenCode | `.opencode/rules/human-in-the-loop.md` |
| cursor-agent | `.cursor/rules/human-in-the-loop.mdc` |

## Installation

1. Copy the directory for your agent into your project root.
2. Make sure the project has TypeScript, Vitest and a package manager set up.
   The phase files call `pnpm test`; on npm, replace `pnpm test` with `npm test`
   and `pnpm exec` with `npx` when copying.
3. **pi only:** on first use pi asks whether you trust the project — **say
   yes.** The refactor step depends on the bundled subagent extension, and pi
   only loads project-local extensions in a trusted project. Declining leaves
   the workflow without its refactor step.
4. No permission configuration is shipped (no `settings.json`, no `permission`
   block in `opencode.json`). What the agent may do is your decision.

## Provenance: what the export changed

The lab workflows run unattended for measurement. This export applies three
transformations to each:

1. **Lab content removed:** autonomy mandate, done-marker, phase-continuation fix.
2. **Human checkpoints added:** HITL steps in Test-List, Red and Refactor; Green
   exempt by default; prediction failures are a hard stop.
3. **Invocation gated:** the workflow loads only when you ask for it.

The ports to OpenCode and cursor-agent were created on 2026-09-13 and have only
been smoke-run, not measured: OpenCode once on Claude Opus 4.8 (all phases,
predictions and the refactor subagent observed), cursor-agent once on cursor's
Auto router only, because named models were unavailable on the plan in use.
The measurements in `.claude/README.md` come from the Claude Code workflow.

Version **2026-09-13** — also recorded in `VERSION`. Earlier snapshots are kept
verbatim next to this one.
