---
name: build-overview
description: Generates an experiment-overview snapshot of all research questions under research/_archive/. Invoke when a new point-in-time report across all RQs should be produced.
disable-model-invocation: false
allowed-tools: Bash(./experiments/generate-snapshot-skeleton.py:*) Read Write Glob
---

# /build-overview — produce an experiment-overview snapshot

You produce a frozen, publishable research report from the current state of every `findings.md` under `research/questions/` and `research/workflow-dev/`. The snapshot lands as a new file under `research/_archive/experiment-overview-YYYY-MM-DD.md`.

## Core principle

`findings.md` = living document, growing list of status-tagged findings.
Snapshot = frozen, table-heavy report at a point in time.

Both exist in parallel. The snapshot is **not written from memory** — it is filled in from an auto-generated skeleton.

## Lifecycle (4 steps)

### Step 1 — generate the skeleton

Bash:

```bash
./experiments/generate-snapshot-skeleton.py
```

The script writes to `/tmp/snapshot-skeleton-YYYY-MM-DD.md`. It auto-fills:

- Data-base count (from `experiments/runs/`)
- Research-question overview table with per-RQ coverage
- Experiment-design tables (workflow, model, kata, workflow→prompt mapping)
- Methodology block (static, with a freshness-check marker)
- Per RQ: raw finding list (current state, no status tags)
- Reproducibility + files table

Wherever synthesis is missing, a `<!-- TODO Claude: ... -->` marker is left in place.

### Step 2 — read the skeleton + every findings.md

Read the skeleton (`/tmp/snapshot-skeleton-YYYY-MM-DD.md`) and **every** `findings.md` under `research/questions/*/` and `research/workflow-dev/*/` (skip dirs starting with `_`). Note for each RQ the current findings with their statement and data values.

`open-questions.md` (when present) does **not** go into the snapshot — those are internal backlog items for future batches, not publishable state.

### Step 3 — fill in the synthesis sections

Replace every `<!-- TODO Claude: ... -->` marker with real content. **Never leave a TODO marker in place.**

Style requirements:

- **Glossary discipline:** Before step 3, read the glossary in the top-level `README.md`. Use terms like `code_mass`, `cc_loc`, `cc_longest_function`, `smell_total`, `verification_pct` only in the binding form defined there ("Code-Mass (APP)", "Produktiv-LoC", "Spitzen-Komplexität", "Smell-Summe", "Korrektheit (außen)") or directly via the metric ID in backticks. Synonyms like "Code-Volumen", "Code-Gesamtvolumen", "LoC-Größe" are forbidden — they are ambiguous or collide with established definitions (APP).
- **Intro (section before 1.):** 2–3 sentences. What is the study, what does this snapshot cover.
- **Methodology (section 3):** Skeleton content is static. Verify against `experiments/docker/Dockerfile`, `experiments/analyze-run.sh`, `experiments/aggregate-by-query.py` whether the pipeline description is still accurate. On drift, correct in the snapshot. Replace the `<!-- TODO Claude: check whether still current ... -->` marker with either a brief confirmation ("pipeline unchanged since ...") or the corrected steps.
- **RQ sections (4.X):** Per RQ 60–100 words of prose after the raw finding list. Top finding in detail + at most one caveat from the finding itself (e.g. narrow data base, only one kata) + an explicit reference to that RQ's `findings.md` (its actual path under `research/questions/` or `research/workflow-dev/`). Do not duplicate tables from findings.md. Where coverage < 100 %, name it in the synthesis ("with currently N runs in M of K cells ...").
- **Findings convention:** Snapshot shows **only the current state**. No status tags like `⚠️ bedingt` / `✅ stabil`, no comparisons with archive snapshots or older studies (e.g. the 235-run study). If findings.md still carries such status tags, drop them in the snapshot synthesis and only carry over the current statement. Reason: older runs had pipeline biases (see memory), comparisons are methodologically not robust.
- **Trophy convention (🏆) in cross-RQ summary tables:** If the snapshot includes pivot tables comparing workflows or models across outcomes, append 🏆 to the best value per row alongside the bold winner. Metric direction must be explicit (`smell_total` → "kleiner = besser", `refactorings_applied` → "höher = besser"). Award 🏆 only where the spread is meaningful — tied values get tied trophies, no winner gets fabricated from rounding noise. Same rule as in `findings.md` headline tables; see `run-rq` SKILL "Overview table" section for the full convention.
- **Cross-RQ synthesis (5):** 3–5 numbered points. Each point connects at least **two** RQs and would therefore not stand in any single findings.md.
- **Limitations (7):** 5–8 bullets. Mandatory: only Anthropic models, only synthetic katas, only TypeScript, headless without HITL, n ≤ 3 per cell. Optional: concrete coverage gaps from the per-RQ coverage values above (e.g. "RQ-3 only 1/5 cells fully populated").

Honesty rule: If an RQ has no robust findings in the current setup, **do not invent** something — say plainly "the current data base does not yield a robust finding" and use the synthesis to explain what is missing.

### Step 4 — write the file

Take the date from the skeleton header (line 3: `Stand: YYYY-MM-DD.`) and write to:

```
research/_archive/experiment-overview-YYYY-MM-DD.md
```

Then verify with Glob or Read that:

1. The file exists
2. No `<!-- TODO -->` markers remain
3. All current findings from the findings.md files are referenced somewhere in the RQ sections (number + statement)
4. No status tags (`⚠️ bedingt`, `✅ stabil`) and no references to old studies / archive snapshots in the published snapshot

Report at the end in 1–2 sentences the output path and any notable coverage gaps ("RQ-X is currently below min_replicates").

## Style template

`research/_archive/findings-validation-2026-05-04/experiment-overview-v2.md` shows the target table density and section ordering. Read it for orientation **before** starting step 3. Adopt the table style and tone — not the specific numbers (those come from the current findings.md).

## What is deliberately NOT part of your output

- Do not recompute tables with concrete metrics.json values — the numbers are already in findings.md and maintained there.
- No auto-commit. The snapshot is reviewed by the user before it goes into the repo.
- No diff against the previous snapshot — that would be a separate skill.
- No subagent delegation; everything in the main context.
