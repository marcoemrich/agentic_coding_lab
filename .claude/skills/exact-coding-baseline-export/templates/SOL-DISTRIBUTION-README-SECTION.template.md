## Agent Configuration

This repository distributes **EXACT Coding Predictive TDD v1** as the universal
maintained workflow: one shared context, falsifiable predictions before
deterministic checks, and inline refactoring under the Four Rules of Simple
Design. The historical Opus/Hybrid branches remain available for reproduction,
but are superseded as the maintained product line.

Each PTDD branch carries exactly one agent configuration. This branch is part
of **Predictive TDD v1**, distribution version **{{DATE}}**.

| Agent | Predictive TDD v1 branch | Config | Start EXACT Coding with |
|---|---|---|---|
| Claude Code | `main` | `.claude/` | `/exact-coding`, or ask for EXACT Coding |
| GitHub Copilot (TypeScript) | `harness/copilot` | `.github/` | `/exact-coding`, or ask for EXACT Coding |
| Cursor | `harness/cursor` | `.cursor/` | `/exact-coding`, or ask for EXACT Coding |
| OpenCode | `harness/opencode` | `.opencode/` | `/exact-coding` |
| pi | `harness/pi` | `.pi/` | `/skill:exact-coding`, or ask for EXACT Coding |

```bash
git checkout main                 # Claude Code
git checkout harness/copilot      # GitHub Copilot
git checkout harness/cursor       # Cursor
git checkout harness/opencode     # OpenCode
git checkout harness/pi           # pi
```

Keeping line and harness combinations on separate branches prevents agents that
scan several vendors' directories from loading duplicate workflows.

### Predictive TDD v1 workflow

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

Predictive TDD v1 deliberately has **no APP mass objective, no refactor
subagent, and no metric-driven end-refactor pass**. Those are product-method
choices, not missing port features.

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
after `RQ-test-list-dimensions-replication` at n=10 per workflow and platform
cell on Claim Office. The canonical methodology is validated on **GPT-5.6 SOL
with pi** and **native Opus 5 with Claude Code**. Copilot, Cursor, and OpenCode
are semantic ports of the same method; they are not presented as independent
cross-harness experiment cells.

### Credits

The Guessing Game and Predictive TDD approach used here is inspired by
[Ted M. Young's Predictive TDD and TDD Game](https://tdd.cards/) and
[Jon Jagger's cyber-dojo](https://cyber-dojo.org/).

---

Built with EXACT Coding: **EX**ample-guided, **A**I-**C**ollaborative &
**T**est-driven Development.
