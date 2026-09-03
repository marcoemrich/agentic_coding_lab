# Workflow Markers — What the Pipeline Actually Reads

> **Inhalts-Design** (Theory-of-Mind, Why-Block-Pattern, Reduktions-
> Erfahrungen aus RQ-rules/RQ-pep/RQ-emoji/RQ-lean, Subagent-Architektur-Gradient):
> siehe `research/workflow-dev/workflow-construction.md`. Diese
> Datei hier deckt nur die harten Parser-Anforderungen ab.


When you derive a new workflow (e.g. `v5.1`, `v6`) by reducing or rewriting
rules/commands, these markers must remain intact. Removing one of them
silently zeros out the corresponding metric — runs still complete, but the
RQ aggregation gets blind spots that look like "no effect" when really the
signal vanished.

Source of truth: `experiments/analyze_transcript.py` (CC/OC),
`experiments/parse_pi_transcript.py` (pi), and
`experiments/parse_cursor_transcript.py` (cursor). If you change those
parsers, update this file.

## Vendored external workflows: no RED marker block

The markers below apply to workflows **we author**. For a vendored external skill
(Pocock, Superpowers, nWave …) do **not** insert marker 2/3 — the skill stays
unmodified, and only marker 4 (`experiment-done.txt`) is added, because without it
the container hits its timeout.

Reason: the `Red Phase Complete` obligation is itself a structural break per cycle.
Inserting it into a foreign skill changes the very behaviour under test, and it
does not even measure reliably there — on v9-pocock the marker-derived
`cycle_count` (14.0) falls ~30 % short of the actual test-write blocks (20.3),
while on our own v6.2 the two agree (37.4 vs 38.5).

Measure cycle discipline for those runs with `experiments/measure-tdd-rigour.py`
instead: it reads only the tool sequence and needs no markers. Full rule and
evidence in `README.md` → "Cycle discipline is measured from the transcript, not
from markers".

What you still lose without markers 1–3: `refactorings_applied`,
`predictions_correct_rate`, and per-phase tokens/duration. Accept that for
external baselines, or measure those separately.

## Hard requirements — Claude Code / OpenCode

| # | Marker | Where it must appear | Drives | Where in parser |
|---|---|---|---|---|
| 1 | `Skill` tool-use with `skill ∈ {test-list, red, green, refactor}` | Tool calls during the run | Phase recognition, `cycle_count`, `refactorings_applied`, per-phase tokens/duration | `analyze_transcript.py` ~line 233 (`if tool_name == "Skill"`) and `aggregate_skill_phases` |

> **Skill-Tool findet auch `.claude/commands/<name>.md`.** Commands sind in Skills "merged" (Claude-Code-Doku, Slash-Commands-Sektion) und nicht deprecated. Die v6.x-Linie liegt bewusst unter `commands/` — Begründung in `research/workflow-dev/workflow-construction.md` §"Mechanismus: commands/ mit Skill-Tool".

| # | Marker | Where it must appear | Drives | Where in parser |
|---|---|---|---|---|
| 2 | The literal string `Red Phase Complete` | Assistant text emitted by the red-phase command | **Gates** prediction parsing — without this string, predictions in the same block are ignored | `extract_predictions_from_text` ~line 75 |
| 3 | One or more lines matching `(- \| ✅ \| ❌) (Correct\|Incorrect)` inside that block | Assistant text in the same block as marker 2 | `predictions_correct`, `predictions_total`, derived `predictions_correct_rate` | `_PREDICTION_OUTCOME_RE` ~line 61 |
| 4 | `experiment-done.txt` containing `DONE` | Written to the run cwd at the end of the autonomous loop | Run-driver detects clean termination; without it the container hits its timeout and the run is flagged `exit_reason: timeout` | `tdd-experiment-mode.md` (v6.5 and earlier) / `lab-only.md` (v6.6+) |

### Single-command workflows on CC — `## Refactor` text fallback

A CC workflow that keeps the **whole cycle in one command** (`basic-sol-tdd-cc`:
`/predictive-tdd` invoked once, then every cycle runs inline from that document)
breaks the phase-source selection in **two different ways**, depending on whether
the model treats the command as a tool call or as a document it simply reads.
Both were measured 2026-08-17 on `basic-sol-tdd-cc` and both silently produced a
wrong `refactorings_applied`:

| Case | What the model does | Winning phase source | Result |
|---|---|---|---|
| 1 | invokes `/predictive-tdd` | `skills` — one phase, **no refactor** | 0 against 11 markers |
| 2 | reads the rules, never invokes | `inline-tool` — guessed from tool sequences | **2** against 30 markers |

Case 2 is the nastier one: the inline-tool path *infers* phases from tool
sequences and undercounts badly, but it returns a non-zero number, so a naive
"fall back only when the count is 0" guard does not fire. Both cases occurred
within the same 10-run cell, i.e. the same workflow on the same kata can take
either path from run to run.

`refactorings_applied` therefore has its **own** resolution chain in
`analyze_transcript.py`, independent of `phase_source`, mirroring
`parse_pi_transcript.py` (`refactor_calls or text_phase_counts["refactor"] or
inferred_counts["refactor"]`):

1. subagent / skill-derived count — workflows that really delegate
2. `## Refactor` **text marker** — inline workflows with no call to count
3. inline-tool inference — marker-free runs only

**The text marker outranks the inference** (2 before 3). The inferred count is a
weak proxy — it also captures bugfixes, lint and tsc edits, see the same note in
`parse_pi_transcript.py` — and must never override a marker the workflow
contractually emits. Subagent workflows do not emit `## Refactor`, so step 2
cannot inflate them: for those, step 1 already produced a non-zero count.

Verified against 18 existing CC runs spanning v3, v4, v5.1, v6.2 and v6.6 across
claim-office, game-of-life and sphinx-score: all unchanged, `cycle_count`
included. The v3 cells are the load-bearing check here — they run on the
`inline-tool` path themselves and emit no `## Refactor`, so they confirm step 2
fires only where markers actually exist.

**Consequence for new CC workflows:** if your workflow refactors inline rather
than in a subagent, `## Refactor` is the only signal — emit it every cycle,
including the cycles where the review changes nothing. `cycle_count` is unaffected
either way: `derive_cycle_count` already had its own chain down to the text
markers, which is why a run can show a healthy `cycle_count` next to a zeroed
`refactorings_applied`. **Check both after a smoke run, not just the cycle count.**

### Where marker 4 lives per workflow generation

| Generation | Claude Code | pi / cursor / opencode |
|---|---|---|
| v6.5 and earlier | `.claude/rules/tdd-experiment-mode.md` | inline in `AGENTS.md` |
| **v6.6+ (`v6.6-lab-split-*`)** | `.claude/rules/lab-only.md` | `LAB-ONLY` fenced block at the end of `AGENTS.md` |

The v6.6 line separates **lab measurement infrastructure** from **TDD
methodology** so a workflow can be exported for real-world use by deleting
one file (CC) or stripping one fenced block (pi/cursor/oc). Everything the
parser depends on — the done-marker contract, the autonomy mandate, and the
phase-continuation fix — lives inside that droppable region.

**Consequence for new workflows:** if you derive from a v6.6 variant, marker
4 is *not* in `tdd.md`. Do not "clean up" `lab-only.md` or the fenced blocks
in a lab workflow — removing them zeroes clean-termination detection and
every run times out.

### Convention for marker 3

The red-phase command should produce **two** prediction lines per cycle:
one for compilation, one for runtime. Fewer lines lower
`predictions_total` and skew the per-cycle rate; more lines are fine but
unusual.

> **Exception — workflows that permit already-green cycles.** The
> `basic-sol-tdd-*` line forbids manufacturing a failure when an earlier
> generalization already covers the next test. Those cycles count in
> `cycle_count` but legitimately carry no predictions, so
> `predictions_total ≈ 2 × cycle_count` does not hold there and a low value
> is not by itself a compliance break. Compare that line on
> `predictions_correct_rate`, never on `predictions_total`.
>
> Smoke-verified (`game-of-life-prose` × `gpt-5-6-sol-codex`, n=1 each):
> inline arm 10 red phases → 4 formal prediction blocks (8/8 correct),
> 3 explicitly already-green, **3 with a prose-only prediction and no
> `Red Phase Complete:` block**; subagent arm 9 → 6 / 3 / 0. That last
> column *is* a compliance loss and is not covered by the exception — see
> `research/workflow-dev/workflow-construction.md`, section
> "`basic-sol-tdd`-Paar", for why this line is more exposed to it than the
> v6 line.

The phrase **"MUST verbatim, do not abbreviate, do not collapse"** (or
equivalent) belongs in the red-phase command. Without it, the model tends
to merge the two prediction lines into one as the run goes on. This was
the root cause of the v4 compliance bug fixed on 2026-05-09 — see memory
note for the full story.

## Hard requirements — pi harness

Pi skills are auto-loaded documents, not tool calls. The model reads
`SKILL.md` once and then follows the instructions "freihand". The
measurement pipeline therefore cannot count `Skill` tool invocations.
Instead, it relies on **text markers** in assistant output and
**subagent tool calls**.

| # | Marker | Where it must appear | Drives | Where in parser |
|---|---|---|---|---|
| P1 | `## Red` heading in assistant text | Each occurrence counts as one red-phase cycle (`cycle_count`) | `parse_pi_transcript.py` (`_PHASE_TEXT_MARKERS_RE`) and `analyze_transcript.py` (`_PHASE_TEXT_MARKERS`, `derive_cycle_count`) |
| P2 | `## Green` heading in assistant text | Green-phase occurrence | same as P1 |
| P3 | `Test List Created` or `Test List Phase Complete` in assistant text — **not** `## Test List`, see note below | Test-list phase occurrence | same as P1 |
| P4 | `subagent` tool call with `agent: "refactor"` — or, for inline workflows, `## Refactor` in assistant text | Each call counts as `refactorings_applied`; the text marker is only consulted when there is no subagent call at all | `parse_pi_transcript.py` (`_is_refactor_subagent`, `_PHASE_TEXT_MARKERS_RE`) |
| P5 | `Red Phase Complete:` + prediction lines | **Gates** prediction parsing (same as CC marker 2) | `extract_predictions_from_text` with `loose_gate=True` (accepts prediction lines even without `Red Phase Complete` if they appear in a block with `## Red` or a `(Compilation\|Runtime) Prediction` header) |
| P6 | Lines matching `(Compilation\|Runtime) Prediction: ... (Correct\|Incorrect)` | `predictions_correct`, `predictions_total` | `_PREDICTION_OUTCOME_LINE_RE` |
| P7 | `experiment-done.txt` containing `DONE` | Same as CC marker 4 | same |

### pi-specific notes

- **P1 replaces CC marker 1** for pi runs. On CC/OC, marker 1 (`Skill` tool call)
  remains the primary cycle counter. The `## Red` pattern is only used as a fallback
  in `derive_cycle_count()` when no `Skill` tool calls are found.
- **P5 is looser than CC marker 2.** On pi, the red-phase header and prediction
  block may land in separate assistant messages (pi splits tool-call results into
  their own messages). `parse_pi_transcript.py` therefore passes `loose_gate=True`
  to `extract_predictions_from_text`, which also accepts blocks containing
  `(Compilation|Runtime) Prediction` lines as valid prediction carriers.
- **P4 is equivalent to CC marker 1's refactor branch.** The `subagent` extension
  produces a tool call with `name: "subagent"` and `arguments.agent: "refactor"`,
  which the pi parser counts the same way CC counts `Task({subagent_type: "refactor"})`.
- **P1–P3, P5, P6 have a subagent fallback for fully-delegated workflows.**
  `v4.1-*-pi` runs every phase in its own subagent, so the phase markers are
  emitted *inside* the subagent and never reach the main thread that
  `_assistant_text_of` reads — parsed naively, the entire TDD mechanic would come
  out as zero. `_subagent_phase_text_of` therefore also reads assistant text out
  of `tool_execution_end(subagent).result.details.results[].messages`, and each
  marker is **bound to the agent that produced it** (`results[].agent`): a
  `## Green` echoed inside a refactor agent's report is not a green phase. That
  binding is load-bearing — across 25 existing pi runs the refactor subagents
  emitted 98 `## Green` and 19 `## Refactor` headings, all of which an unbound
  fallback would have miscounted. The fallback applies per phase and only when
  the main thread produced no marker for that phase at all. Verified: 10 hybrid
  runs across `v6.1-hybrid-testlist-scope-fix-pi`, `v6.2-with-why-cleaned-pi`,
  `v6.2.1-phase-continuation-pi` and `v6.6-lab-split-pi` unchanged in
  `cycle_count`, `refactorings_applied` and `predictions_total`.
- **P4 has a text fallback for inline workflows.** Workflows that refactor in the
  main context instead of delegating (`v5.1-*-pi`: every phase in one shared
  context) never emit a subagent call, so counting only subagent calls would pin
  their `refactorings_applied` at 0 — indistinguishable from "the model never
  refactored". `refactorings_applied` is therefore `refactor_calls or
  text_phase_counts["refactor"]`: subagent calls win whenever they exist, and the
  `## Refactor` heading is consulted only in their complete absence. This mirrors
  the precedence P1 already has over skill reads for `cycle_count`, and it cannot
  inflate hybrid workflows, which emit no `## Refactor` heading. Verified against
  20 existing pi runs across `v6.2-with-why-cleaned-pi`,
  `v6.2.1-phase-continuation-pi` and `v6.6-lab-split-pi`: all unchanged.

## Hard requirements — cursor harness

cursor-agent is a hybrid, like cc and pi. The `test-list`, `red` and `green`
phases are auto-loaded skill documents, not tool calls, and the model follows
them "freihand" — so cycle/prediction detection relies on **text markers** in
assistant output. Refactor and end-refactor are **delegated to isolated
subagents** in `.cursor/agents/` and are detected by the `taskToolCall` itself,
exactly as pi's `subagent` calls are. A **tool-sequence fallback** covers models
that skip the text markers entirely.

> **Historical note.** Until 2026-07 these workflows ran refactor inline and
> counted a `## Refactor` text marker, on the false premise that cursor-agent
> had no subagent mechanism. Cursor has had a Task tool since v2.4. All cursor
> runs produced under the inline contract were discarded — none contained a
> single `taskToolCall`, so the isolated-context architecture was never
> actually measured on this harness.

| # | Marker | Where it must appear | Drives | Where in parser |
|---|---|---|---|---|
| C1 | `## Red` heading in assistant text (not only reasoning) | Each occurrence counts as one red-phase cycle (`cycle_count`) | `parse_cursor_transcript.py` (`_PHASE_TEXT_MARKERS_RE`) |
| C2 | `## Green` heading in assistant text | Green-phase occurrence | same as C1 |
| C3 | `Test List Created` or `Test List Phase Complete` in assistant text | Test-list phase occurrence | same as C1 |
| C4 | `taskToolCall` with `subagentType.custom.name` = `refactor` | Each call counts as a per-cycle refactoring (`refactorings_per_cycle`) | `parse_cursor_transcript.py` (`_subagent_name_of`, `_classify_tool_event`) |
| C4b | `taskToolCall` with `subagentType.custom.name` = `end-refactor` | The final whole-`src/` pass (`refactorings_end_pass`) | same as C4 |

> **C3 is not a `##` heading.** The regex matches the prose forms
> `Test List Created` / `Test List Phase Complete`, **not** `## Test List`.
> The workflows emit the prose forms; instructing a model to emit
> `## Test List` produces a marker the parser cannot see.

> **`refactorings_applied` = C4 + C4b**, and the two are also reported
> separately. Do **not** add the `## Refactor` text-marker count on top: a
> workflow that both delegates and echoes a heading would be double-counted.
> The parser enforces this — when any delegated call is present it ignores the
> text marker and sets `marker_source: "subagent-calls"`.
>
> Built-in subagents (Explore / Bash / Browser) also arrive as `taskToolCall`
> but carry no `subagentType.custom.name`, so they are correctly ignored.
>
> Text-marker-only runs (pre-2026-07 workflows) still parse via
> `##\s*Refactor\b`, which matches `## Refactor (final pass)` but **not**
> `## End-Refactor`. That path is legacy; new cursor workflows must delegate.
| C5 | `Red Phase Complete:` + prediction lines | **Gates** prediction parsing (same as pi P5) | `extract_predictions_from_text` with `loose_gate=True` |
| C6 | Lines matching `(Compilation\|Runtime) Prediction: ... (Correct\|Incorrect)` | `predictions_correct`, `predictions_total` | `_PREDICTION_OUTCOME_LINE_RE` |
| C7 | `experiment-done.txt` containing `DONE` | Same as CC marker 4 | same |

### cursor-specific notes

- **Markers must appear in *assistant output text*, not only in reasoning.**
  cursor-agent emits `thinking` events (private reasoning) separately from
  `assistant` events. The parser reads only `assistant` text, so a `## Red`
  that appears solely in a thinking block is not counted. The workflow prompt
  states this explicitly.
- **C4 is the direct analogue of pi's P4 (subagent call).** Both count an
  isolated refactor subagent actually running, so `refactorings_applied` is
  **comparable across cc, pi and cursor** — all three measure the same
  construct. This was not true before 2026-07, when cursor counted a text
  marker meaning "refactor phase declared"; cross-harness comparisons of
  `refactorings_applied` from that era are not valid.
- **Tool-sequence fallback.** When zero `## Red` markers are found,
  `parse_cursor_transcript.py` infers cycles from the `editToolCall` /
  `shellToolCall` sequence (test-edit → `pnpm test` = red; impl-edit →
  `pnpm test` = green; later impl-edit = refactor). `transcript-metrics.json`
  records `marker_source: "tool-sequence-fallback"` when this path is used.

- **`marker_source` tells you which path produced the refactor count:**
  `"subagent-calls"` (delegated — the current contract), `"text-markers"`
  (legacy inline), or `"tool-sequence-fallback"` (model ignored the markers).
  A current-generation cursor run reporting anything other than
  `"subagent-calls"` means the model refactored in the main context instead of
  delegating — the run is not measuring the intended architecture.

- Emoji headers `🔴` / `🟢` / `🔄` / `📋`
- The `Green Phase Complete:` / `Refactor Phase Complete:` strings (only
  `Red Phase Complete` is parsed)
- Naming-evaluation blocks
- APP mass calculations and component-count tables
- "Self-Check Before Proceeding" lists, "Psychological Resistance"
  sections, "Why this discipline works" pep talks
- Repeated "🚨 USE SKILLS" warnings — one mention is enough; the parser
  doesn't care, and the model behaves consistently with one strong
  instruction

## Smoke-test a new workflow before a full batch

After reducing/changing a workflow, run **one** smoke run and check
`metrics.json`:

```bash
jq '.final_metrics | {
  cycle_count, refactorings_applied,
  predictions_correct, predictions_total,
  tests_passing
}' experiments/runs/<latest-smoke-run>/metrics.json
```

Healthy baseline (game-of-life, 4–6 tests):

- `cycle_count >= 3` — phases were detected
- `refactorings_applied >= 1` — refactor skill fired
- `predictions_total ≈ 2 × cycle_count` — both prediction lines made it
  through (does **not** apply to workflows permitting already-green cycles,
  e.g. `basic-sol-tdd-*` — see the exception under "Convention for marker 3")
- `predictions_correct / predictions_total` plausible (not 0/0)
- `tests_passing == true`

If any of these are zero or null while the run otherwise looks fine, a
marker is broken — fix it before launching the n=3 batch.

## Cross-reference

- Parsers: `experiments/analyze_transcript.py`, `experiments/parse_pi_transcript.py`, `experiments/parse_cursor_transcript.py`
- CC/OC workflows satisfying markers 1–4:
  `v4-exact-subagents`, `v5-exact-single-context`, `v6.6-lab-split-cc`,
  `v6.6-lab-split-oc`, `basic-sol-tdd-cc` (single command — `cycle_count` and
  `refactorings_applied` both via text markers, see the fallback note above)
- pi workflows satisfying markers P1–P7: `v6.2-with-why-cleaned-pi`,
  `v6.6-lab-split-pi`, `basic-sol-tdd-pi` (P4 via `## Refactor` text
  fallback), `basic-sol-tdd-subagent-pi` (P4 via `subagent` call)

### P3 is not a `##` heading — same trap as cursor's C3

`_PHASE_TEXT_MARKERS_RE["test-list"]` matches the prose forms
`Test List Created` / `Test List Phase Complete`, **not** `## Test List`.
The table above says "heading" for historical reasons; the regex has never
matched one. Existing pi workflows survive this because their `test-list`
skill emits `Test List Created:` in its summary block — the AGENTS.md
instruction to write `## Test List` contributes nothing to P3 on its own.

A new pi workflow that instructs only the heading and drops the prose line
loses the test-list phase silently. Instruct **both**.

### Baseline workflows satisfy marker 4 only — by design

`v1-oneshot` / `v1-oneshot-pi` (no TDD) and `v3-basic-tdd` / `v3-basic-tdd-pi`
("use TDD", no phase structure) prescribe **no phase markers**. They carry only
the done-marker (marker 4 / P7). v3 tells the model to do TDD but never tells it
to write `## Red`.

This is **not a broken marker** and must not be "fixed": adding markers would turn
v3 into a mini-v4 and break comparability with the existing runs that define what
v3 means in this lab. The healthy-baseline checklist above does **not** apply to
these four workflows.

#### Marker-free ≠ unmeasurable: the inline-tool inference

Both parsers reconstruct phases from the **tool sequence** when a run carries no
marker at all — `infer_phases_from_tool_sequence` in `analyze_transcript.py`,
imported by `parse_pi_transcript.py` so cc and pi apply the same heuristic:

- test-edit → `pnpm test` = **red**
- impl-edit → `pnpm test` = **green**
- impl-edit with no fresh test before it = **refactor**

`phase_source` records which path produced the numbers — `skills`, `subagents`,
`skills+subagents` (cc only), `text-markers`, `inline-tool` or `none`; both
parsers use the same vocabulary. **The decision is per run, not per metric** —
inference runs only when the transcript carries no marker of any kind.
In an instrumented workflow a zero is a measurement, not a gap; a per-metric
fallback would fabricate refactorings for marked runs whose refactor count is
legitimately 0. (That bug existed briefly in 2026-08 and was caught by a
regression diff over 226 pi runs.)

#### What the inferred numbers do and do not support

`cycle_count` is a genuine signal — v3 runs show multi-cycle red/green sequences.
But it is **not comparable to marker-based counts**: on opus-5 v3 yields 1–8
while v6.6 yields 7–57. Different constructs (inferred tool sequence vs. marker
emission), not different amounts of discipline. Never put them in one column.

A non-zero `cycle_count` also does not mean the run was *rigorous* TDD. It counts
red/green alternations, not their size. Across 55 v3 runs only 22 % open with an
increment of two test cases or fewer, and 31 % never run the tests before
implementing — most models author a whole suite up front and implement against
it. To claim step size or verified-red, measure the first cycle directly; see
`research/questions-cross/1.5-v3-emergent-tdd/` F-1.5.

`refactorings_applied` is an **upper bound, not a refactoring count**. All 60
candidates across every v3 run (cc and pi) were hand-classified — against the
accompanying assistant text where the model narrates its work, against the code
diff for models that stay silent:

| Category | n | share |
|---|---:|---:|
| Refactoring (structure, no behaviour change) | 14 | 23% |
| Bugfix (wrong logic corrected) | 11 | 18% |
| Toolchain fix (tsc / ESLint) | 16 | 27% |
| New untested file ("Now the CLI:") | 19 | 32% |

Precision is strongly model-dependent: `gpt-5-6-sol` 43%, `opus-5` 37%, and
**0% for opus-4-7, opus-4-6 and haiku-4-5** — those models produce candidates,
but none of them are refactorings. Report the raw count only alongside a
validated one, never on its own. Details in
`research/questions-cross/1.5-v3-emergent-tdd/`.

`predictions_*` stays genuinely unmeasurable — no inference can reconstruct a
prediction the model was never asked to state. Report those as **n/a**, never 0,
and award no trophy in those rows.

Consequence for RQs using these workflows as a floor (e.g.
`RQ-architecture-axis-opus5`, `RQ-architecture-axis-sol-pi`): `cycle_count` and
`refactorings_applied` are available with the caveats above; only
`predictions_correct_rate` is n/a. Correctness and code-quality metrics are
unaffected — they are measured from the source tree.
- cursor workflows satisfying markers C1–C7: `v6.2.1-phase-continuation-cursor`
  (C4b not applicable — that generation has no end-refactor phase),
  `v6.6-lab-split-cursor` (all markers incl. C4b)
- Past compliance incidents documented in repo memory under
  *"Drei Metriken-Bugs"* and *"v4 Predictions-Compliance"*
