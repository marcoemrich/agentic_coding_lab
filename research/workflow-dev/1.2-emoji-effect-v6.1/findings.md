# RQ-emoji-v6.1 — Findings

_Do decoration emojis (✅ ❌ 🔴 🟢 🔄 📋 🚨 ⚠️) in the workflow prompts on the hybrid-v2 base have a measurable effect on code quality or TDD discipline?_

## Overview (primary outcome code quality — lower = better)

| Outcome | v6.1-hybrid (emoji) | exact-hybrid-v2.2-no-emoji-cc |
|---|---:|---:|
| `code_mass` (APP) | **147.6** 🏆 | 156.8 |
| `smell_total` | 2.6 | **2.0** 🏆 |
| `cc_longest_function` | 15.0 | **11.4** 🏆 |
| `cognitive_max` | **6.2** 🏆 | 6.6 |
| `mccabe_max` | 5.2 | **4.6** 🏆 |

Trophies split 3:2 between the workflows, every single difference < 1σ of the respective spread — **no directional code quality effect**. Spreads dominate the deltas throughout.

---

## F-1.1 — Decoration emojis: no code quality effect, slight discipline shift

**Statement:** Removing all 95 decoration emojis (✅ ❌ 🚨 🔴 🟢 🔄 📋 ⚠️) from the skill commands, the refactor subagent and `rules/tdd.md` on the hybrid-v2 base degrades neither correctness (both 100% **Correctness (external)** and **Correctness (internal)**) nor code quality. It does shift TDD behaviour: **no-emoji refactors more often** and implements **less often up front** (fewer `tests_passed_immediately`) — the same direction as in [RQ-pep-v6.1](../1.1-pep-effect-v6.1/findings.md) F-1.1.

| Metric (direction) | v6.1-hybrid (emoji) | exact-hybrid-v2.2-no-emoji-cc | Δ |
|---|---:|---:|---|
| `refactorings_applied` (higher = more active) | 4.2 (std 2.28) | **5.4** 🏆 (std 2.88) | +29% |
| `tests_passed_immediately` (lower = more disciplined) | 4.8 (std 2.95) | **2.2** 🏆 (std 3.03) | −54% |
| `cycle_count` | 8.4 | 8.8 | ≈ |
| `predictions_correct_rate` | **98.8%** 🏆 | 97.7% | ≈ |
| **Correctness (external)** (`verification_pct`) | **100%** 🏆 | **100%** 🏆 | = |
| **Correctness (internal)** (`tests_passing`) | **100%** 🏆 | **100%** 🏆 | = |

**Rationale:** the discipline shift in the same direction as RQ-pep-v6.1 is notable — two independent reductions (no-pep, no-emoji) both produce more refactoring and less immediate green. The spreads (std ≈ mean for `tests_passed_immediately`) forbid a strong reading, though. A parsimonious explanation: less prompt scaffolding lets the model follow the bare process more closely. The difference in `predictions_correct_rate` (98.8 → 97.7) is trivial and within the noise — the ✅/❌ markers in the prediction template do **not** act as discipline anchors. Hyphen parsing (`- Correct`/`- Incorrect`) works without problems.

---

## F-1.2 — Decoration emojis save no tokens

**Statement:** Contrary to expectation, `exact-hybrid-v2.2-no-emoji-cc` saves no tokens — both workflows sit in the 7–8 M token range, and the no-emoji trend is even slightly more expensive.

| Metric (lower = better) | v6.1-hybrid (emoji) | exact-hybrid-v2.2-no-emoji-cc |
|---|---:|---:|
| `total_tokens` (mean) | **7.17 M** 🏆 | 7.78 M |
| `duration_seconds` (mean) | **597 s** 🏆 | 669 s |

**Rationale:** the 95 emojis are only a fraction of the total token load by volume (expected a priori). H3 (≥ 5 % saving) is nonetheless **refuted**. The slightly negative trend (+8.5 % tokens, +12 % wallclock) is presumably due to the larger refactor phases in no-emoji (+29 % `refactorings_applied`); every additional refactor phase costs tokens.

---

## Hypothesis status

| Hypothesis | Status | Evidence |
|---|---|---|
| **H1** Emojis have no effect on code quality | confirmed | 5 metrics split 3:2, all Δ < 1σ |
| **H2** Emojis help measurably | not confirmed | no consistent directional trend |
| **H3** Emojis save ≥ 5 % tokens | refuted | +8.5 % tokens, +12 % wallclock in no-emoji |
| **H4** Prediction discipline effect from ✅/❌ | not confirmed | Δ 1.1 pp trivial; hyphen parser works |
| **H5** Replication of the old RQ-emoji (hybrid-v1 line) | confirmed | H1 reading consistent; correctness of both workflows 100/100 |

**Consequence for the MARKERS classification:** emoji headers (`🔴`/`🟢`/`🔄`/`📋`) and ✅/❌ status markers stay classified as **decorative content (safe to drop)**. The CLAUDE.md rule "Only use emojis if the user explicitly requests it" can be applied to the workflow files without code quality or correctness damage — `exact-hybrid-v2.2-no-emoji-cc` is cleared as a reduction.