# TDD phase chain — 2026-10-01_12-11-12_claim-office-rust-example-mapping_baseline-inline-tdd-v1-pi_gpt-6-sol-codex-3

**10 suite invocations.** Derived from `tdd-events.jsonl`; no workflow markers, tool calls or commits were read.

## Chain

```
Red -> Green? -> Green? -> Both -> Red -> Green -> Red(c) -> Green -> Skip -> Refactor
```

Deviations present: `Both` ×1 (test and implementation changed together — no verified red), `Green?` ×2 (implementation changed, still failing), `Skip` ×1 (test arrived and passed immediately — never red)

## Metrics

| Metric | Value |
|---|---:|
| `suite_runs` | 10 |
| `cycles_total` | 4 |
| `cycles_closed` | 2 |
| `test_first_rate` | 0.6 |
| `red_batch_size` | 4.0 |
| `red_batch_max` | 4 |
| `red_batch_unmeasurable` | 1 |
| `green_batch_size` | 7.5 |
| `refactor_events` | 1 |
| `skip_events` | 1 |
| `refactor_per_cycle` | 0.5 |
| `green_attempts` | 1.0 |
| `deviations` | 2 |
| `opens_red` | True |
| `ends_green` | True |
| `tdd_discipline` | 0.422 |
| `tdd_discipline_test_first` | 0.6 |
| `tdd_discipline_step` | 0.25 |
| `tdd_discipline_closure` | 0.5 |

`red_batch_size` is the one to read for step size: 1 means one failing test at a time, higher means a batch of tests was authored before any implementation existed. `green_batch_size` is its mirror on the implementation side — the two separate when a workflow writes several tests up front and then implements them one by one.

## Cycles (2 of 4 closed with a Green)

  1. `1–4`  Red -> Green? -> Green? -> Both  ← never closed
  2. `5–6`  Red -> Green
  3. `7–8`  Red(c) -> Green
  4. `9–10`  Skip -> Refactor  ← never closed

## Label counts

| Label | n | Meaning |
|---|---:|---|
| `Red` | 2 | a new failing test arrived |
| `Green?` | 2 | implementation changed, still failing |
| `Green` | 2 | implementation changed, suite went green |
| `Both` | 1 | test and implementation changed together — no verified red |
| `Red(c)` | 1 | test arrived, suite does not compile yet |
| `Skip` | 1 | test arrived and passed immediately — never red |
| `Refactor` | 1 | implementation changed, suite stayed green |

## Per invocation

| # | Phase | Suite | Tests p/f | Changed since previous |
|---:|---|---|---|---|
| 1 | Red | fail | 0/4 | _(initial tree: 2 files)_ |
| 2 | Green? | fail | 0/4 | `src/lib.rs` |
| 3 | Green? | fail | 0/4 | `src/lib.rs` |
| 4 | Both | pass | 4/0 | `src/lib.rs`, `src/lib.rs#test` |
| 5 | Red | fail | 5/4 | `src/lib.rs#test` |
| 6 | Green | pass | 9/0 | `src/lib.rs` |
| 7 | Red(c) | fail (1 collect err) | 0/0 | `tests/cli.rs#test` |
| 8 | Green | pass | 11/0 | `src/main.rs` |
| 9 | Skip | pass | 14/0 | `src/lib.rs#test` |
| 10 | Refactor | pass | 14/0 | `src/lib.rs` |

Final suite state: **pass**.

