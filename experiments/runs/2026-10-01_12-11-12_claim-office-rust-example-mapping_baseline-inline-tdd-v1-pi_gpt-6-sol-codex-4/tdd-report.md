# TDD phase chain — 2026-10-01_12-11-12_claim-office-rust-example-mapping_baseline-inline-tdd-v1-pi_gpt-6-sol-codex-4

**10 suite invocations.** Derived from `tdd-events.jsonl`; no workflow markers, tool calls or commits were read.

## Chain

```
Red(c) -> Green -> Red -> Green -> Red -> Green -> Skip -> Red(c) -> Green -> Verify
```

Deviations present: `Skip` ×1 (test arrived and passed immediately — never red)

## Metrics

| Metric | Value |
|---|---:|
| `suite_runs` | 10 |
| `cycles_total` | 5 |
| `cycles_closed` | 4 |
| `test_first_rate` | 0.8 |
| `red_batch_size` | 2.5 |
| `red_batch_max` | 3 |
| `red_batch_unmeasurable` | 2 |
| `green_batch_size` | 2.5 |
| `refactor_events` | 0 |
| `skip_events` | 1 |
| `refactor_per_cycle` | 0.0 |
| `green_attempts` | 0.0 |
| `deviations` | 1 |
| `opens_red` | True |
| `ends_green` | True |
| `tdd_discipline` | 0.635 |
| `tdd_discipline_test_first` | 0.8 |
| `tdd_discipline_step` | 0.4 |
| `tdd_discipline_closure` | 0.8 |

`red_batch_size` is the one to read for step size: 1 means one failing test at a time, higher means a batch of tests was authored before any implementation existed. `green_batch_size` is its mirror on the implementation side — the two separate when a workflow writes several tests up front and then implements them one by one.

## Cycles (4 of 5 closed with a Green)

  1. `1–2`  Red(c) -> Green
  2. `3–4`  Red -> Green
  3. `5–6`  Red -> Green
  4. `7–7`  Skip  ← never closed
  5. `8–10`  Red(c) -> Green -> Verify

## Label counts

| Label | n | Meaning |
|---|---:|---|
| `Green` | 4 | implementation changed, suite went green |
| `Red(c)` | 2 | test arrived, suite does not compile yet |
| `Red` | 2 | a new failing test arrived |
| `Skip` | 1 | test arrived and passed immediately — never red |
| `Verify` | 1 | nothing changed, suite re-run |

## Per invocation

| # | Phase | Suite | Tests p/f | Changed since previous |
|---:|---|---|---|---|
| 1 | Red(c) | fail (1 collect err) | 0/0 | _(initial tree: 1 files)_ |
| 2 | Green | pass | 1/0 | `src/lib.rs` |
| 3 | Red | fail | 1/2 | `src/lib.rs#test` |
| 4 | Green | pass | 3/0 | `src/lib.rs` |
| 5 | Red | fail | 4/3 | `src/lib.rs#test` |
| 6 | Green | pass | 7/0 | `src/lib.rs` |
| 7 | Skip | pass | 9/0 | `src/lib.rs#test` |
| 8 | Red(c) | fail (1 collect err) | 0/0 | `tests/cli.rs#test` |
| 9 | Green | pass | 10/0 | `src/main.rs` |
| 10 | Verify | pass | 10/0 | — |

Final suite state: **pass**.

