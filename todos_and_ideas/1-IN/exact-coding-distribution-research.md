# EXACT Coding distribution: current state and cross-harness options

Research from 2026-11-01. Builds on the earlier options note
`~/sync/workspace/misc/exact-coding-distribution-optionen.md` (2026-08-12,
German), which compared options A–D and did not decide anything. This file
records what has changed since, and the research into cross-harness package
formats (Microsoft APM, rulesync, Vercel `skills`, pi packages, and others).

No decision yet. Next steps are at the end.

---

## 1. What exists today

The distribution format is defined in the export skill:
`.claude/skills/exact-coding-baseline-export/SKILL.md` (about lines 29–110 and
1293–1296). It was introduced in commit `65ffd3d75` (2026-09-13, "promote and
distribute SOL workflow line").

- **One consumer repo:** `EXACT-Coding` on GitHub, renamed from
  `EXACT-Coding-Exercises` on 2026-10-26, checked out locally as
  `exact-coding-exercises`. It is deliberately the only sync target.
- **One branch per harness:** Claude Code is on `main`. Copilot, Cursor,
  OpenCode and pi each have a `harness/*` branch holding only that harness's
  tree. Users install with `git checkout harness/<x>`.
- **Two lines:** `opus` (Hybrid, native to Claude Code) and `sol` (Predictive
  TDD, native to pi).
- **Snapshots in the lab:** dated directories under
  `research/workflow-dev/export/`. `export-sol.py --sync-distribution` updates
  the branches, commits locally and never pushes.
- **Two entry points per tree:** `exact-coding` (inline refactoring) and
  `exact-coding-isolated-refactor`, sharing `skills/exact-coding-shared/`.
- **All harnesses are tested.** Pi and Claude Code are the lab's main
  harnesses for batch experiments. The other trees have been tested manually
  and in workshops (e.g. Copilot). The export skill and the distribution README
  still call the non-pi trees "semantic distribution ports, not cross-harness
  validation claims", which undersells that.

### Status of the open questions from the 2026-08-12 note

| Open question then | Today |
|---|---|
| Own repo or part of the lab? | Resolved: own repo (`EXACT-Coding`) |
| License | Resolved: MIT (Ferdi Ade & Marco Emrich) |
| Snapshot only had `.claude/` | Resolved: 5 harnesses (cc, pi, oc, cursor, copilot) |
| Inconsistency in the 2026-08-12 snapshot | Probably moot (SOL/PTDD line replaced it), not checked |
| Decide between A / B / C | De facto A; B (npx) and C (plugin) never started |

### Gap: the book cannot cite a fixed version

The 2026-08-12 note recommended option A *because* of the book: a URL that
still delivers the same version in three years. The current setup works
against that:

- The harness branches are overwritten on every release.
- `EXACT-Coding` has no version tags on GitHub. Locally there are only
  `local-sync-2026-09-19-main` and `pre-ptdd-sync-2026-09-19`.
- The only release tag, `export/2026-10-29-ptdd-v1.2`, is in the lab repo.

Cheapest fix: have `--sync-distribution` also create a tag per release and
harness (e.g. `ptdd-v1.2/claude`, `ptdd-v1.2/pi`) and push it with the
release. The branches then act as the `latest` pointer, and the tags make each
version citable.

---

## 2. Microsoft APM (Agent Package Manager)

[github.com/microsoft/apm](https://github.com/microsoft/apm): "package.json
for agent configuration". An `apm.yml` manifest lists skills, prompts,
instructions, agents, hooks and MCP servers. `apm install` reproduces them
with a lockfile, and `apm compile --target …` writes the files each harness
expects ([manifest schema](https://microsoft.github.io/apm/reference/manifest-schema/)).

- **Targets:** Copilot, Claude, Grok Build, Cursor, OpenCode, Codex, Gemini,
  Windsurf, Kiro, plus explicit-only Antigravity, Hermes, Grok Bot and
  `agent-skills` ([docs](https://microsoft.github.io/apm/llms-full.txt)).
  Targets are hard-coded (`KNOWN_TARGETS`). Unknown slugs are rejected, and
  there is no plugin mechanism for new harnesses.
- **Repo:** about 4,200 stars, 255 open issues, latest release v0.35.0
  (2026-10-22). Still pre-1.0.

### Pi support

- **Not native, and explicitly deferred.**
  - PR [#2907](https://github.com/microsoft/apm/pull/2907) adds a finished pi
    target (skills and prompt templates). It has been open since 2026-09-08,
    has merge conflicts, and is labelled `status/deferred`.
  - In [#2908](https://github.com/microsoft/apm/issues/2908) the maintainer
    (danielmeppiel) said on 2026-09-14 that the team is stabilising existing
    integrations and has no capacity for new native ones.
  - The same decision was recorded on 2026-10-01 in
    [#1969](https://github.com/microsoft/apm/issues/1969) ("pi.dev support")
    and [#3047](https://github.com/microsoft/apm/issues/3047) (more harnesses):
    "not permanent rejection", but nothing planned.
  - A suggestion in #3047 to make harness support pluggable has no response.
- **Skills work anyway.** The `agent-skills` target writes to `.agents/skills/`,
  which pi reads natively. A user in #1969 says it "does most of what I want
  with Pi". The maintainers want to keep that route, but explicitly not as
  "full native parity".
- **Prompt templates (`.pi/prompts/`):** only in the unmerged PR.
- **Subagents:** not covered. The PR leaves them out on purpose ("sub-agents
  are an extension capability"), and APM has no primitive for pi extensions.

### What that means for the `harness/pi` tree

| Contents | Via APM? |
|---|---|
| `.pi/skills/*` (exact-coding, predictive-tdd + stacks, red/green/refactor, test-list, example-mapping, end-refactor, shared) | yes, via `agent-skills` → `.agents/skills/` |
| `.pi/agents/refactor.md` | no |
| `.pi/extensions/subagent/` (`index.ts`, `agents.ts`, `README.md`) | no |

Without the subagent extension pi has no refactor step, so at least
`exact-coding-isolated-refactor` would break. Pi, one of the lab's two main
harnesses, would still need a second install route.

### User reports

There aren't many. There is no Reddit discussion, and the only
[HN post](https://news.ycombinator.com/item?id=47244983) has 2 points.

- **Positive:** guides on
  [dev.to](https://dev.to/pwd9000/agent-package-manager-apm-a-devops-guide-to-reproducible-ai-agents-4c25),
  [Medium](https://momosuke-san.medium.com/apm-a-hands-on-tour-of-microsofts-new-tool-that-makes-harness-engineering-easy-1513b30bd019)
  and [explainx](https://explainx.ai/blog/microsoft-apm-agent-package-manager)
  praise the lockfile with content hashes, `apm audit` with SARIF output, and
  scanning for hidden Unicode.
- **Critical:**
  - A [Codex guide](https://codex.danielvaughan.com/2026/05/07/microsoft-apm-agent-package-manager-codex-cli-reproducible-agent-configuration/)
    calls it "young software" and notes it needs a Python runtime.
  - The [Renovate discussion](https://github.com/renovatebot/renovate/discussions/42507)
    points out there are no version ranges.
  - A hands-on write-up notes that by default `install` and `audit` only warn
    and continue when the policy file can't be fetched.
  - [apm-action](https://github.com/microsoft/apm-action/issues) has open bugs,
    e.g. release mode not finding skill packages.
  - Mixed setups have hit bugs, e.g.
    [#2485](https://github.com/microsoft/apm/issues/2485): `agent-skills`
    combined with MCP caused errors (since fixed).

**Verdict:** APM could replace the Copilot, Cursor, OpenCode and Claude
branches and give the workshop a single `apm install`. For pi it delivers only
half the workflow, and the stalled PR suggests that won't change soon. It fits
as an extra front end, not as a replacement.

---

## 3. Other cross-harness tools

None of them ships the full workflow to pi either. They all stop at skills,
because pi has no native subagent mechanism.

| Tool | Reach / activity (2026-11-01) | Pi | Agents/subagents | Fit for EXACT Coding |
|---|---|---|---|---|
| [Vercel `npx skills`](https://github.com/vercel-labs/skills) | 37k stars, active | yes, via `.agents/skills/` ([agent list](https://github.com/vercel-labs/skills/blob/main/docs/agents.md)) | no, skills only | workshop one-liner `npx skills add <repo>`, but no refactor subagent anywhere |
| [rulesync](https://github.com/dyoshikawa/rulesync) | 1.6k stars, v43.4.1 released 2026-10-31 | rules, commands, skills, hooks; **no subagents**; MCP for pi still open ([#3316](https://github.com/dyoshikawa/rulesync/issues/3316)) | yes for Claude Code (including plugin output), Copilot, Cursor, OpenCode | broadest conversion; one `.rulesync/` source generates all formats |
| [ruler](https://github.com/intellectronica/ruler) | 3k stars, active | `AGENTS.md` + `.pi/skills/`, no subagents | yes for Claude Code, Copilot, Codex | like rulesync, narrower |
| [ai-rules-sync](https://github.com/lbb00/ai-rules-sync) | 40 stars, no commits since August | skills + a few others | partly | too small, too quiet |
| [agent_sync](https://github.com/suparikoli/agent_sync), [crossby](https://pypi.org/project/crossby/0.37.2/), [agentsync (Go)](https://pkg.go.dev/github.com/spxrogers/agentsync), agentsync (Rust) | small, early | no or unclear | varies | not worth it |
| Microsoft APM (section 2) | 4k stars, pre-1.0 | skills only, native support deferred | yes for the others | extra front end at best |

rulesync stands out because it does what `export-sol.py` does today: one source
in, harness formats out. It could replace the in-house porting logic for Claude
Code, Copilot, Cursor and OpenCode. It is a build tool on the author's side,
though, not a one-command installer for users, and its release pace (already
v43) means a lot of churn.

Earlier landscape overview (2026-04-17, no pi coverage):
`~/sync/workspace/misc/skill-tools-vergleich.md` (Vercel `skills`, skillfish,
agentdeps, skilled, vibe-rules, @tanstack/intent, …).

---

## 4. Pi's own package system

Source: [pi-mono `docs/packages.md`](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/packages.md).

- A pi package bundles **extensions, skills, prompt templates and themes** as
  one unit, so it would include `extensions/subagent/`.
- It installs from npm, git, a URL or a local path:
  `pi install git:github.com/<user>/EXACT-Coding@<tag>`.
  - `--local` writes the declaration to the project's `.pi/settings.json`.
    This needs project trust.
  - `pi -e <source>` loads a package for one session without installing it.
    That suits the workshop.
- **Pinning:** npm versions, git tags and commits are pinned, so this is
  citable for the book.
- **Layout:** conventional directories (`extensions/`, `skills/`, `prompts/`,
  `themes/`), or a `pi` key in `package.json`. The `pi-package` keyword lists
  the package in the [pi package gallery](https://pi.dev/packages).
- A package that loads an extension shows `CHANGELOG.md` entries after an
  update, which could serve as the "What's new" channel.

**Snag:** the subagent extension looks for agent definitions only in
`~/.pi/agent/agents/` and the project's `.pi/agents/`
(`harness/pi:.pi/extensions/subagent/agents.ts`, `discoverAgents`, lines
97–102). Packages have no "agents" resource type, so `refactor.md` would not be
found. The extension needs a small change to also load agent files shipped
inside the package (e.g. resolved relative to `import.meta.url`).

---

## 5. Synthesis

No single tool covers all harnesses with the full workflow. One repo can still
serve several native install routes at once:

- a `package.json` with a `pi` key, making it a **pi package** that includes
  the patched subagent extension;
- a `.claude-plugin/marketplace.json`, making it a **Claude Code plugin**;
- `skills/` in the standard layout, so **`npx skills add`** and APM's
  `agent-skills` target work as a fallback for everyone else;
- **git tags per release**, so the book can cite a fixed version.

rulesync, or the existing exporter, would generate the harness-specific files.
The repo would look much like today's, with tags and package manifests in
place of, or alongside, the per-harness branches.

| Audience (from the 2026-08-12 note) | Covered by |
|---|---|
| Book: citable, stable URL | git tags (pi: `pi install git:…@<tag>`) |
| Workshop: one command, about 30 s | `pi -e …`, `/plugin install`, `npx skills add` |
| Colleagues: an update path | `pi update`, `/plugin marketplace update`, branches as `latest` |

---

## 6. Next steps

1. Add release tags to `export-sol.py --sync-distribution` and push them with
   the release. Cheap, and it closes the book gap independent of everything
   else.
2. Prototype: turn the pi tree into a pi package, patch the subagent extension
   to find the bundled `refactor.md`, and test it with `pi -e` on a kata.
3. Evaluate rulesync as a replacement for the porting logic in
   `export-sol.py` for the non-pi harnesses. Check whether its output matches
   the current trees, especially Copilot and OpenCode.
4. Decide whether to keep the per-harness branches as `latest` pointers or
   replace them with a single-tree repo carrying multiple manifests.
5. Watch APM [#2907](https://github.com/microsoft/apm/pull/2907) /
   [#2908](https://github.com/microsoft/apm/issues/2908) for a change in the
   deferred decision.
