## Agent Configuration

This repository distributes **two parallel EXACT Coding lines**. Neither
supersedes the other:

- **Opus / Hybrid EXACT Coding** — shared Red/Green context with isolated
  refactor subagents and an end-refactor pass.
- **SOL / Predictive TDD** — one shared context, falsifiable predictions before
  deterministic checks, and inline refactoring under the Four Rules of Simple
  Design.

Each branch carries exactly one line and one agent configuration. This branch is
part of the **SOL / Predictive TDD** line, version **{{DATE}}**.

| Agent | Opus / Hybrid branch | SOL / Predictive TDD branch | Config | Start SOL TDD with |
|---|---|---|---|---|
| Claude Code | `main` | `sol/main` | `.claude/` | Ask for TDD or Predictive TDD |
| GitHub Copilot (TypeScript) | `harness/copilot` | `sol/harness/copilot` | `.github/` | `/tdd`, or ask for Predictive TDD |
| Cursor | `harness/cursor` | `sol/harness/cursor` | `.cursor/` | Ask for Predictive TDD |
| OpenCode | `harness/opencode` | `sol/harness/opencode` | `.opencode/` | `/tdd` |
| pi | `harness/pi` | `sol/harness/pi` | `.pi/` | `/skill:tdd`, or ask for Predictive TDD |

```bash
git checkout sol/main                 # Claude Code
git checkout sol/harness/copilot      # GitHub Copilot
git checkout sol/harness/cursor       # Cursor
git checkout sol/harness/opencode     # OpenCode
git checkout sol/harness/pi           # pi
```

Keeping line and harness combinations on separate branches prevents agents that
scan several vendors' directories from loading duplicate workflows.

### SOL / Predictive TDD workflow

The workflow first creates a complete ordered test list with all future
behaviors inactive. It then handles exactly one behavior per cycle:

1. **Red** — activate one behavior, state a falsifiable prediction, and verify
   the behavior fails for the predicted reason.
2. **Green** — make the smallest production change that satisfies it.
3. **Refactor** — review and, where useful, refactor inline under the Four Rules
   of Simple Design.
4. **Close** — predict and run the complete suite and applicable stack gates.

A test already satisfied by an earlier generalization is valid evidence. The
workflow confirms it instead of manufacturing a failure.

Unlike the Opus / Hybrid line, SOL / Predictive TDD deliberately has **no APP
mass objective, no refactor subagent, and no metric-driven end-refactor pass**.
Those are methodological differences, not missing port features.

### Stack profiles

Workflow methodology and language/tooling are separate. TypeScript and Vitest
syntax, inactive-test conventions, commands, compiler behavior, and lint advice
live only in:

```text
<agent-config>/skills/predictive-tdd/stacks/typescript-vitest.md
```

The TDD orchestration selects and reads the matching profile before changing
code. This makes another language a new stack profile rather than a duplicated
workflow.

### Human-in-the-loop

The default Autonomy Level is `full-hitl`: stop after Test List, Red, and
Refactor, and whenever a prediction is wrong. Green has no default stop. Change
the single setting in the `human-in-the-loop` file beside the TDD workflow (or
under the harness's rules directory for Cursor/OpenCode).

### Invocation and provenance

The workflow is opt-in. Ordinary coding sessions do not load Predictive TDD
unless you ask for it. Provider credentials, routing, model selection, and
permission policy are intentionally not shipped.

This distribution is generated from
`{{SOURCE_WORKFLOW}}` in the `agentic_coding_lab` repository. It was promoted
after `RQ-stack-profile-extraction-sol`: all 20 fresh validation runs on Game of
Life and Claim Office passed internal and external verification. That evidence
is for **GPT-5.6 SOL on pi**. The Claude Code, Copilot, Cursor, and OpenCode
branches are semantic ports of the same files; they are not presented as
additional cross-harness experiment results.

---

Built with EXACT Coding: **EX**ample-guided, **A**I-**C**ollaborative &
**T**est-driven Development.
