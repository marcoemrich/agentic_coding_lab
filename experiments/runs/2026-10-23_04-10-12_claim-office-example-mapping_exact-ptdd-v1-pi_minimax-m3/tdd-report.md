# TDD phase chain — 2026-10-23_04-10-12_claim-office-example-mapping_exact-ptdd-v1-pi_minimax-m3

**10 suite invocations.** Derived from `tdd-events.jsonl`; no workflow markers, tool calls or commits were read.

## Chain

```
Start -> Red(c) -> Red -> Green -> Red -> Green -> Refactor -> Skip -> Skip -> Skip
```

Deviations present: `Skip` ×3 (test arrived and passed immediately — never red)

## Metrics

| Metric | Value |
|---|---:|
| `suite_runs` | 10 |
| `cycles_total` | 6 |
| `cycles_closed` | 2 |
| `test_first_rate` | 0.5 |
| `red_batch_size` | 1.0 |
| `red_batch_max` | 1 |
| `red_batch_unmeasurable` | 1 |
| `green_batch_size` | 1.0 |
| `refactor_events` | 1 |
| `skip_events` | 3 |
| `refactor_per_cycle` | 0.5 |
| `green_attempts` | 0.0 |
| `deviations` | 3 |
| `opens_red` | False |
| `ends_green` | True |
| `verification_tests` | 0 |
| `verification_red` | 0 |
| `tdd_after_cutoff` | 0 |
| `tdd_discipline` | 0.55 |
| `tdd_discipline_test_first` | 0.5 |
| `tdd_discipline_step` | 1.0 |
| `tdd_discipline_closure` | 0.333 |

`red_batch_size` is the one to read for step size: 1 means one failing test at a time, higher means a batch of tests was authored before any implementation existed. `green_batch_size` is its mirror on the implementation side — the two separate when a workflow writes several tests up front and then implements them one by one.

## Cycles (2 of 6 closed with a Green)

  1. `1–1`  Start  ← never closed
  2. `2–4`  Red(c) -> Red -> Green
  3. `5–7`  Red -> Green -> Refactor
  4. `8–8`  Skip  ← never closed
  5. `9–9`  Skip  ← never closed
  6. `10–10`  Skip  ← never closed

## Label counts

| Label | n | Meaning |
|---|---:|---|
| `Skip` | 3 | test arrived and passed immediately — never red |
| `Red` | 2 | a new failing test arrived |
| `Green` | 2 | implementation changed, suite went green |
| `Start` | 1 | first invocation |
| `Red(c)` | 1 | test arrived, suite does not compile yet |
| `Refactor` | 1 | implementation changed, suite stayed green |

## Per invocation

| # | Phase | Suite | Tests p/f | Changed since previous |
|---:|---|---|---|---|
| 1 | Start | pass | 0/0 | _(initial tree: 1 files)_ |
| 2 | Red(c) | fail (1 collect err) | 0/0 | `src/claim-office.spec.ts` |
| 3 | Red | fail | 0/1 | `src/claim.ts`, `src/quote.ts` |
| 4 | Green | pass | 1/0 | `src/quote.ts` |
| 5 | Red | fail | 1/1 | `src/claim-office.spec.ts` |
| 6 | Green | pass | 2/0 | `src/quote.ts` |
| 7 | Refactor | pass | 2/0 | `src/quote.ts` |
| 8 | Skip | pass | 3/0 | `src/claim-office.spec.ts` |
| 9 | Skip | pass | 4/0 | `src/claim-office.spec.ts` |
| 10 | Skip | pass | 5/0 | `src/claim-office.spec.ts` |

Final suite state: **pass**.

