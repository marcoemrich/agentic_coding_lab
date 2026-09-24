# EXACT Coding — Predictive TDD v1 — 2026-09-21

Consumer-ready export of `exact-ptdd-v1-pi`, the universal maintained EXACT Coding
Predictive-TDD line.

| Harness | Directory | Invocation |
|---|---|---|
| Claude Code | `.claude/` | `/exact-coding` or ask for EXACT Coding |
| pi | `.pi/` | `/skill:exact-coding` or ask for EXACT Coding |
| OpenCode | `.opencode/` | `/exact-coding` |
| Cursor | `.cursor/` | `/exact-coding` or ask for EXACT Coding |
| GitHub Copilot | `.github/` | `/exact-coding` or ask for EXACT Coding |

The workflow creates a complete test list, then runs one-test Predictive
Red-Green-Refactor cycles in one shared context. Before every deterministic
check it states a falsifiable prediction and compares it with reality.
Refactoring is inline and follows the Four Rules of Simple Design. It treats domain language as the semantic anchor, tests independently changing policies with a concrete boundary trial, and keeps or narrowly undoes the result based on semantic and behavioral evidence.
The loop itself has no APP mass objective, no metric-driven end pass, and no
refactor subagent.

### The other profile: `exact-coding-isolated-refactor`

Every subtree ships a second entry point alongside `exact-coding`. It is the
same Predictive TDD contract — same test list, same predictions, same Four
Rules and boundary trial — with one difference: the per-cycle refactor runs in
an **isolated subagent** instead of in the shared context. The refactor step
then sees the code as it stands, not the red/green history that produced it.

Invoke it by name (`/exact-coding-isolated-refactor`, or ask for it) in place
of `exact-coding`. Do not run both on the same task.

**Which to pick.** On the measured kata the two land in the same place on
quality and differ on price:

| | `exact-coding` | `exact-coding-isolated-refactor` |
|---|---|---|
| Correctness | equal within noise | equal within noise |
| Mutation score, unit size | equal within noise | equal within noise |
| Wall-clock | baseline | roughly 3–4x |
| Tokens | baseline | roughly 1.6–2.3x |
| List-price cost | baseline | roughly 1.3–2x |

So the shared-context profile is the default, and the isolated one is worth its
price when a fresh-eyes refactor is what you are actually after — a long
session where the cycle history has grown noisy, or a codebase where you want
the refactor judgement made without the memory of how the code got there. It is
not a correctness upgrade; on the runs behind this export it did not buy one.

The figures come from Claim Office on TypeScript with the Opus models, n=5 per
cell. They are a direction, not a guarantee for your codebase or your model.

### Manual extra: `end-refactor` (not part of the workflow)

> **You have to start this yourself. The workflow never runs it.**

Every subtree ships `skills/end-refactor/SKILL.md`: a measured cleanup across
the whole `src/` (ESLint smells, cognitive complexity, McCabe, APP mass, one
change at a time). Ask for it by name when a piece of work is finished and you
want more than the inline per-cycle refactor. It is deliberately outside the
loop — it costs noticeably more time and tokens, and Predictive TDD does not
depend on it.

### Manual phase control: `red`, `green`, `refactor`

Invoking `exact-coding` runs the whole loop, stopping only where the Autonomy
Level says to. When you want to drive the cycle yourself, one phase per turn,
invoke the phases by name instead:

| Skill | Runs | Stops |
|---|---|---|
| `red` | Activate one behavior, predict, reach behavioral Red | Before any production change |
| `green` | Smallest production change that satisfies the active test | Before refactoring |
| `refactor` | Four Rules review, domain-responsibility review, boundary trial | Before the next behavior |

These carry no method of their own. Each one points at its section of
`skills/predictive-tdd/SKILL.md` and at the shared human-in-the-loop file, so
the rules you get are the same rules the full loop applies — predictions,
mismatch handling, and the boundary trial included. The one thing they add is
that your invocation *is* the checkpoint: a phase never runs on into the next
one, even at an Autonomy Level that would not have stopped there. Mix freely with
`exact-coding` — the phases read and leave the ordinary working tree, with no
phase commits.

### Optional: Example Mapping before the loop

Every subtree also ships `skills/example-mapping/SKILL.md`, a conversation that
collects business rules and concrete examples before any test is written. It
feeds the test list; it is not a phase of the cycle and is never invoked
automatically.

Language and tool details live exclusively in the profiles under
`skills/predictive-tdd/stacks/`; orchestration and method files are stack-neutral.
The export currently includes TypeScript/Vitest, Java/JUnit 5/Maven and
Python/pytest profiles.
It removes experiment-specific autonomy,
completion, and measurement content, restores configurable human checkpoints, and gates
the workflow behind explicit invocation.

Validated on `gpt-5-6-sol-codex` with pi and native Opus 5 with Claude Code on all three stacks: TypeScript/Vitest in `RQ-test-list-dimensions-replication` (n=10 per workflow and platform cell on Claim Office), Java/JUnit 5/Maven in `RQ-exact-coding-java` and Python/pytest in `RQ-exact-coding-python` (n=5 per cell on Claim Office and Game of Life, each including the isolated-refactor variant). Other harness directories are semantic distribution ports and
have not yet been validated as independent cross-harness experiment cells.

## Credits

The Guessing Game and Predictive TDD approach used here is inspired by
[Ted M. Young's Predictive TDD and TDD Game](https://tdd.cards/) and
[Jon Jagger's cyber-dojo](https://cyber-dojo.org/).
