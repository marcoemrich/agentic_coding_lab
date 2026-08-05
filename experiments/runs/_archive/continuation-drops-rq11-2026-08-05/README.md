# Continuation drops replaced in RQ-model-quality-pi (archived 2026-08-05)

Two runs removed from the `glm-5-1` and `qwen3-235b` cells of RQ-model-quality-pi
(game-of-life × v6.2.1-phase-continuation-pi) and replaced by fresh replicates.

| Run | Cell | `code_mass` | `tests_total` | tokens | `src/` |
|---|---|---:|---:|---:|---|
| `2026-07-25_07-20-21` | glm-5-1 | 0 | 0 | 36 k | empty |
| `2026-07-25_12-19-44` | qwen3-235b | 8 | 1 | 60 k | 2 files, 8 LoC |

## What actually happened

Not an infrastructure failure. Both transcripts end with `agent_end` / `turn_end`
after 12 and 15 tool calls — pi terminated normally, and there is no
`auto_retry_end {success:false}`, no provider error and no timeout. The model
stopped on its own without finishing the kata: a **continuation drop**, the same
failure shape `v6.2.1-phase-continuation-pi` was built to address at the
test-list→red transition.

They carry `exit_reason: ok` legitimately, which is why no automatic filter
caught them.

## Why they were replaced anyway

These two produced essentially no code, so they do not measure code quality —
they measure that the run ended early. Left in, they dominate the cell variance
of every quality metric: `code_mass` σ was 82.4 for glm-5-1 (mean 144.8 over a
0–195 range) and 116.6 for qwen3-235b (mean 206.6 over 8–315). A cell mean
computed across "wrote a full solution" and "wrote nothing" describes neither.

The evidence for the continuation-drop classification is condensed into
`drop-evidence.txt` per run: event-type histogram, tool-call count, and the
absence of `auto_retry_end {success:false}`. The full `transcript-pi.jsonl` was
dropped — at 189 MB for the glm run it would have pushed the commit pack toward
the 2 GiB limit that already blocked a push once (hence `runs/**/run.log` being
gitignored).

## What was NOT removed

Five runs in RQ-model-novel-pi (claim-office) show `tests_total = 0` and were
deliberately **left in place**: `kimi-k2-7-no-thinking`, `deepseek-v4-pro-no-thinking`,
two `qwen3-235b`, and one `minimax-m3`. Those runs produced complete code
including `cli.ts`, and their external verification ran all 15 scenarios and
failed them. `verification_pct = 0` there is a real measurement of model
performance, not an artifact — deleting them would have silently improved those
cells.
