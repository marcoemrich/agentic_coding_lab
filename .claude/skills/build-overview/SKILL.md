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

## Prerequisites

System tools required (all on `$PATH`):

- `python3` — runs `experiments/generate-snapshot-skeleton.py`
- `pandoc` — Markdown → HTML for the PDF step (any version ≥ 2.9 works)
- `google-chrome` (or `chromium` — adjust the binary name in step 6) — headless `--print-to-pdf`
- `pdfinfo` (Poppler utils) — optional, used for the PDF verification check in step 6

If any of these are missing, stop at step 6 and report which tool is unavailable so the user can install it.

## Lifecycle (6 steps)

### Step 1 — generate the skeleton

Bash:

```bash
./experiments/generate-snapshot-skeleton.py
```

The script writes to `/tmp/snapshot-skeleton-YYYY-MM-DD.md`. It auto-fills:

- Data-base count (from `experiments/runs/`)
- **Author line** (Marco Emrich, with EXACT-Coding co-credit "gemeinsam mit Ferdinand Ade")
- **Repository link** (github.com/marcoemrich/agentic_coding_lab)
- **`## Über die Studie`** H2 — only the heading; the two flowing paragraphs underneath are TODO-markers (filled in step 3)
- **`### Scope`** H3 sub-heading — TODO-marker (filled in step 3)
- **`### AI-Hinweis`** H3 sub-heading — full text is static
- **`## Hauptbefunde`** H2 — TODO-marker (filled interactively in step 4)
- §1 Research-question overview table with per-RQ coverage (data-driven, regenerated from frontmatter)
- §2.1 Experiment-design tables: Workflow, Modell × Thinking, Kata × Prompt-Stil — all static
- §2.1 **Workflow-Mechanik im Detail** block — static, one bullet per workflow generation
- §2.2 Workflow → Prompt-Mapping table — static
- §3 Methodology block — static, with a freshness-check TODO marker
- §3.2 **Metrik-Tabellen** (six grouped tables: Korrektheit, Effizienz, Code-Mass & Umfang, Code-Qualität, Test-Stärke, TDD-Disziplin) — all static
- §3.3 Bewertungsgrundsätze — static
- §4 Per RQ: heading + Datenbasis line + raw finding list + per-RQ synthesis TODO (current state, no status tags)
- §7 Reproducibility block — static
- §8 Files table — data-driven

Wherever Claude must fill in content, a `<!-- TODO Claude: ... -->` marker is left in place. **Everything else is static skeleton content — do not edit it during synthesis.** Concretely: Author / Repository / AI-Hinweis blocks, all §1 / §2 / §3 / §7 / §8 tables and prose, and the Workflow-Mechanik block must stay byte-identical to what the skeleton produced.

### Step 2 — read the skeleton + every findings.md

Read the skeleton (`/tmp/snapshot-skeleton-YYYY-MM-DD.md`) and **every** `findings.md` under `research/questions/*/` and `research/workflow-dev/*/` (skip dirs starting with `_`). Note for each RQ the current findings with their statement and data values.

`open-questions.md` (when present) does **not** go into the snapshot — those are internal backlog items for future batches, not publishable state.

### Step 3 — fill in the synthesis sections (except Hauptbefunde)

Replace every `<!-- TODO Claude: ... -->` marker with real content — **except** the `## Hauptbefunde` TODO, which is handled interactively in step 4. **Never leave any other TODO marker in place.**

Style requirements:

- **Glossary discipline:** Before step 3, read the glossary in the top-level `README.md`. Use terms like `code_mass`, `cc_loc`, `cc_longest_function`, `smell_total`, `verification_pct` only in the binding form defined there ("Code-Mass (APP)", "Produktiv-LoC", "Spitzen-Komplexität", "Smell-Summe", "Korrektheit (außen)") or directly via the metric ID in backticks. Synonyms like "Code-Volumen", "Code-Gesamtvolumen", "LoC-Größe" are forbidden — they are ambiguous or collide with established definitions (APP).
- **`## Über die Studie` (H2):** Two flowing paragraphs (no sub-headings between them):
  - **Paragraph 1 — EXACT Coding anchor.** Lab as the empirical validation platform for **EXACT Coding** (EXample-guided AI-Collaborative Test-driven Coding) — reference the manuscript at `../../../exact-coding-book/manuscript/exact-coding.md` (path relative to the repo root). Position the workflow variants as a spectrum from Vibe-Coding baselines (v1/v2) over EXACT-conformant setups (v4/v6) to the Delayed-Refactor control (v8).
  - **Paragraph 2 — Snapshot status.** Date, run count, RQ count, current research front. **Never use workflow version names (`v6.1-hybrid` etc.) here** — workflows are not yet introduced in §2.1; describe by mechanism instead (e.g. "Hybrid-Workflow mit Skill-basiertem Red/Green im geteilten Kontext + isoliertem Refactor-Subagent"). Mention any excluded workflow-dev RQs if their data collection is still ongoing.
- **`### Scope` (H3 sub-heading inside Über die Studie):** One paragraph with the three-axis scope named explicitly: (1) Harness — **Claude Code CLI** (pin the version from `experiments/docker/Dockerfile`), headless without HITL; (2) Models — **only Anthropic models** (Opus, Sonnet, Haiku — with/without thinking, Direct-API and Portkey); (3) Target language — **only TypeScript** with the fixed pnpm/tsx/Vitest/ESLint+SonarJS stack per run. State explicitly that findings hold **for** this stack; transfer to other agentic tools (Cursor, Aider, Cline, Windsurf), other model providers (OpenAI, Google, local models), other target languages (Python, Go, Java), or interactive HITL setups is open.
- **Methodology (section 3):** Skeleton content is static. Verify against `experiments/docker/Dockerfile`, `experiments/analyze-run.sh`, `experiments/aggregate-by-query.py` whether the pipeline description is still accurate. On drift, correct in the snapshot. Replace the `<!-- TODO Claude: check whether still current ... -->` marker with either a brief confirmation ("pipeline unchanged since ...") or the corrected steps.
- **RQ sections (4.X):** Two artefacts per RQ, in this order:
  - **Übersichts-Tabelle from `findings.md`** copied verbatim into the snapshot, placed directly after the `_Datenbasis: …_` line and before the `**Befunde**:` list. Each findings.md carries an "Übersicht" or headline table near the top; copy it (with its caption + 🏆 markers) so readers see the numbers without leaving the snapshot. If a findings.md exposes two parallel overview tables (e.g. one per kata, as in RQ-tdd-quality), copy both.
  - **Synthesis paragraph** of 60–100 words after the `**Befunde**:` list. Top finding in detail + at most one caveat from the finding itself (e.g. narrow data base, only one kata) + an explicit `[research/.../findings.md](relative/path)` link. Where coverage < 100 %, name it in the synthesis ("with currently N runs in M of K cells ...").
- **Findings convention:** Snapshot shows **only the current state**. No status tags like `⚠️ bedingt` / `✅ stabil`, no comparisons with archive snapshots or older studies (e.g. the 235-run study). If findings.md still carries such status tags, drop them in the snapshot synthesis and only carry over the current statement. Reason: older runs had pipeline biases (see memory), comparisons are methodologically not robust.
- **Trophy convention (🏆) in cross-RQ summary tables:** If the snapshot includes pivot tables comparing workflows or models across outcomes, append 🏆 to the best value per row alongside the bold winner. Metric direction must be explicit (`smell_total` → "kleiner = besser", `refactorings_applied` → "höher = besser"). Award 🏆 only where the spread is meaningful — tied values get tied trophies, no winner gets fabricated from rounding noise. Same rule as in `findings.md` headline tables; see `run-rq` SKILL "Overview table" section for the full convention.
- **Cross-RQ synthesis (5):** 3–5 numbered points. Each point connects at least **two** RQs and would therefore not stand in any single findings.md.
- **Limitations (7):** 5–8 bullets. Mandatory: only Anthropic models, only synthetic katas, only TypeScript, headless without HITL, n ≤ 3 per cell. Optional: concrete coverage gaps from the per-RQ coverage values above (e.g. "RQ-model-quality only 1/5 cells fully populated").

Honesty rule: If an RQ has no robust findings in the current setup, **do not invent** something — say plainly "the current data base does not yield a robust finding" and use the synthesis to explain what is missing.

### Step 4 — propose Hauptbefunde, let the human select

This is the only interactive step. Do **not** silently write the Hauptbefunde — propose candidates and let the user pick.

1. From everything you read in step 2, draft **5–7 candidate main findings** that have the largest cross-RQ practical impact for a practitioner ("what should I take away?"). Each candidate carries: a bold-sentence title, 1–3 sentences with concrete numbers (`verification_pct`, `cognitive_max`, tokens), and a one-line practical consequence.
2. Present the candidates as a numbered list in chat, plus a short "why these and not others" line. **Do not** name workflow versions like `v6.1-hybrid` in the Hauptbefunde — workflows are not yet introduced at that early point in the document. Describe by mechanism instead ("Hybrid-Workflow mit Skill-basiertem Red/Green im geteilten Kontext + isoliertem Refactor-Subagent").
3. Use `AskUserQuestion` (multiSelect: true) to let the user pick **3–5** of the candidates. Accept "Other" answers as additions.
4. After the user has chosen, write the selected findings — verbatim with their bold titles and the practical-consequence line — into the `## Hauptbefunde` block, replacing the TODO marker. Order the chosen findings by descending practical impact (most actionable first).

### Step 5 — write the file

Take the date from the skeleton header (line 3: `Stand: YYYY-MM-DD.`) and write to:

```
research/_archive/experiment-overview-YYYY-MM-DD.md
```

Then verify with Glob or Read that:

1. The file exists
2. No `<!-- TODO -->` markers remain
3. All current findings from the findings.md files are referenced somewhere in the RQ sections (number + statement)
4. Each RQ section carries the Übersichts-Tabelle from its `findings.md` before the `**Befunde**:` list
5. No status tags (`⚠️ bedingt`, `✅ stabil`) and no references to old studies / archive snapshots in the published snapshot

### Step 6 — generate the PDF (mandatory)

The PDF is part of every snapshot — do **not** skip it, even if the user did not explicitly ask for one. Convert the Markdown snapshot to a PDF sibling via pandoc → Chromium headless:

```bash
SNAP=research/_archive/experiment-overview-YYYY-MM-DD
pandoc "$SNAP.md" -o "$SNAP.html" --standalone --self-contained \
  --metadata title="Experiment-Overview YYYY-MM-DD" \
  --css=experiments/snapshot-style.css
google-chrome --headless --no-sandbox --disable-gpu --no-pdf-header-footer \
  --print-to-pdf="$SNAP.pdf" "file://$(pwd)/$SNAP.html" 2>/dev/null
rm "$SNAP.html"
```

The stylesheet (`experiments/snapshot-style.css`) is checked in so every regeneration uses the same A4 layout, page-break rules (tables may span pages, individual rows stay intact, header repeats), and typography. The intermediate HTML is throwaway.

**Why Chromium and not WeasyPrint:** earlier iterations used WeasyPrint, optionally with Ghostscript re-serialization. Both produced technically valid PDFs (`pdfinfo` confirms A4 portrait, rotation=0), but VS Code's built-in PDF preview (vscode-pdf, PDF.js-based) consistently rendered the content rotated 90° inside otherwise portrait pages. Chromium's `--print-to-pdf` writes PDFs through Skia/PDFium — the same lineage that PDF.js was forked from — so PDF.js-based viewers render them reliably. All other viewers (Browser, evince, okular, pdftoppm) handle Chromium output equally well. Chromium also packs the content denser (typically ~40% fewer pages than WeasyPrint for the same snapshot).

A harmless `Failed to load module: …libgiolibproxy.so` or `VAAPI version is too old` warning from Chromium can be ignored — they don't affect PDF output.

**PDF verification.** After generation, sanity-check the output:

```bash
pdfinfo "$SNAP.pdf" | grep -E "Pages|Page size|Page rot"
```

Expected: `Pages` ≥ 5, `Page size` ≈ `595 x 842 pts (A4)`, `Page rot` = `0`. If any of these are off (e.g. zero pages, landscape page size, non-zero rotation), the PDF is broken — report it instead of pretending it worked.

Report at the end in 1–2 sentences the output paths (`.md` + `.pdf`), the page count, and any notable coverage gaps ("RQ-X is currently below min_replicates").

## Style template

`research/_archive/findings-validation-2026-05-04/experiment-overview-v2.md` shows the target table density and section ordering. Read it for orientation **before** starting step 3. Adopt the table style and tone — not the specific numbers (those come from the current findings.md).

## What is deliberately NOT part of your output

- Do not recompute or fabricate numbers — copy them verbatim from `findings.md` (Übersichts-Tabellen and finding-internal values). Numbers in tables come from `findings.md`, never from re-running aggregation or estimating.
- No auto-commit. The snapshot is reviewed by the user before it goes into the repo.
- No diff against the previous snapshot — that would be a separate skill.
- No subagent delegation; everything in the main context.
- Do not silently choose the Hauptbefunde for the user — step 4 is interactive by design.
