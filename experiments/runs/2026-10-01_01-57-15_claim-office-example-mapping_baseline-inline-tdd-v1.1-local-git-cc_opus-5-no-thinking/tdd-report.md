# TDD phase chain — 2026-10-01_01-57-15_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-no-thinking

**21 suite invocations.** Derived from `tdd-events.jsonl`; no workflow markers, tool calls or commits were read.

## Chain

```
Red(c) -> Green -> Red -> Green -> Red -> Green -> Red -> Green -> Red -> Green -> Red(c) -> Green -> Refactor -> Red(c) -> Green -> Red -> Green -> Skip -> Skip -> Skip -> Refactor
```

Deviations present: `Skip` ×3 (test arrived and passed immediately — never red)

## Metrics

| Metric | Value |
|---|---:|
| `suite_runs` | 21 |
| `cycles_total` | 11 |
| `cycles_closed` | 8 |
| `test_first_rate` | 0.727 |
| `red_batch_size` | 6.0 |
| `red_batch_max` | 10 |
| `red_batch_unmeasurable` | 3 |
| `green_batch_size` | 5.5 |
| `refactor_events` | 2 |
| `skip_events` | 3 |
| `refactor_per_cycle` | 0.25 |
| `green_attempts` | 0.0 |
| `deviations` | 3 |
| `opens_red` | True |
| `ends_green` | True |
| `tdd_discipline` | 0.445 |
| `tdd_discipline_test_first` | 0.727 |
| `tdd_discipline_step` | 0.167 |
| `tdd_discipline_closure` | 0.727 |

`red_batch_size` is the one to read for step size: 1 means one failing test at a time, higher means a batch of tests was authored before any implementation existed. `green_batch_size` is its mirror on the implementation side — the two separate when a workflow writes several tests up front and then implements them one by one.

## Cycles (8 of 11 closed with a Green)

  1. `1–2`  Red(c) -> Green
  2. `3–4`  Red -> Green
  3. `5–6`  Red -> Green
  4. `7–8`  Red -> Green
  5. `9–10`  Red -> Green
  6. `11–13`  Red(c) -> Green -> Refactor
  7. `14–15`  Red(c) -> Green
  8. `16–17`  Red -> Green
  9. `18–18`  Skip  ← never closed
 10. `19–19`  Skip  ← never closed
 11. `20–21`  Skip -> Refactor  ← never closed

## Label counts

| Label | n | Meaning |
|---|---:|---|
| `Green` | 8 | implementation changed, suite went green |
| `Red` | 5 | a new failing test arrived |
| `Red(c)` | 3 | test arrived, suite does not compile yet |
| `Skip` | 3 | test arrived and passed immediately — never red |
| `Refactor` | 2 | implementation changed, suite stayed green |

## Per invocation

| # | Phase | Suite | Tests p/f | Changed since previous |
|---:|---|---|---|---|
| 1 | Red(c) | fail (1 collect err) | 0/0 | _(initial tree: 1 files)_ |
| 2 | Green | pass | 1/0 | `src/quote.ts` |
| 3 | Red | fail | 1/5 | `src/quote.spec.ts` |
| 4 | Green | pass | 6/0 | `src/quote.ts` |
| 5 | Red | fail | 6/7 | `src/quote.spec.ts` |
| 6 | Green | pass | 13/0 | `src/quote.ts` |
| 7 | Red | fail | 13/10 | `src/quote.spec.ts` |
| 8 | Green | pass | 23/0 | `src/quote.ts` |
| 9 | Red | fail | 23/6 | `src/quote.spec.ts` |
| 10 | Green | pass | 29/0 | `src/quote.ts` |
| 11 | Red(c) | fail (1 collect err) | 29/0 | `src/claim.spec.ts` |
| 12 | Green | pass | 42/0 | `src/claim.ts` |
| 13 | Refactor | pass | 42/0 | `src/claim.ts` |
| 14 | Red(c) | fail (1 collect err) | 42/0 | `src/scenario.spec.ts` |
| 15 | Green | pass | 45/0 | `src/scenario.ts` |
| 16 | Red | fail | 46/4 | `src/cli.spec.ts` |
| 17 | Green | pass | 50/0 | `src/cli.ts` |
| 18 | Skip | pass | 51/0 | `src/quote.spec.ts` |
| 19 | Skip | pass | 51/0 | `src/quote.spec.ts` |
| 20 | Skip | pass | 51/0 | `src/claim.spec.ts` |
| 21 | Refactor | pass | 51/0 | `src/quote.ts` |

Final suite state: **pass**.

