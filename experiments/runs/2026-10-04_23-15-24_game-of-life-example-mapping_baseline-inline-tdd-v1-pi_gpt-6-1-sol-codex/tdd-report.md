# TDD phase chain — 2026-10-04_23-15-24_game-of-life-example-mapping_baseline-inline-tdd-v1-pi_gpt-6-1-sol-codex

**14 suite invocations.** Derived from `tdd-events.jsonl`; no workflow markers, tool calls or commits were read.

## Chain

```
Red(c) -> Green -> Skip -> Red -> Green -> Red -> Green -> Skip -> Red -> Green -> Skip -> Skip -> Skip -> Skip
```

Deviations present: `Skip` ×6 (test arrived and passed immediately — never red)

## Metrics

| Metric | Value |
|---|---:|
| `suite_runs` | 14 |
| `cycles_total` | 10 |
| `cycles_closed` | 4 |
| `test_first_rate` | 0.4 |
| `red_batch_size` | 1.0 |
| `red_batch_max` | 1 |
| `red_batch_unmeasurable` | 1 |
| `green_batch_size` | 1.0 |
| `refactor_events` | 0 |
| `skip_events` | 6 |
| `refactor_per_cycle` | 0.0 |
| `green_attempts` | 0.0 |
| `deviations` | 6 |
| `opens_red` | True |
| `ends_green` | True |
| `tdd_discipline` | 0.543 |
| `tdd_discipline_test_first` | 0.4 |
| `tdd_discipline_step` | 1.0 |
| `tdd_discipline_closure` | 0.4 |

`red_batch_size` is the one to read for step size: 1 means one failing test at a time, higher means a batch of tests was authored before any implementation existed. `green_batch_size` is its mirror on the implementation side — the two separate when a workflow writes several tests up front and then implements them one by one.

## Cycles (4 of 10 closed with a Green)

  1. `1–2`  Red(c) -> Green
  2. `3–3`  Skip  ← never closed
  3. `4–5`  Red -> Green
  4. `6–7`  Red -> Green
  5. `8–8`  Skip  ← never closed
  6. `9–10`  Red -> Green
  7. `11–11`  Skip  ← never closed
  8. `12–12`  Skip  ← never closed
  9. `13–13`  Skip  ← never closed
 10. `14–14`  Skip  ← never closed

## Label counts

| Label | n | Meaning |
|---|---:|---|
| `Skip` | 6 | test arrived and passed immediately — never red |
| `Green` | 4 | implementation changed, suite went green |
| `Red` | 3 | a new failing test arrived |
| `Red(c)` | 1 | test arrived, suite does not compile yet |

## Per invocation

| # | Phase | Suite | Tests p/f | Changed since previous |
|---:|---|---|---|---|
| 1 | Red(c) | fail (1 collect err) | 0/0 | _(initial tree: 1 files)_ |
| 2 | Green | pass | 1/0 | `src/game-of-life.ts` |
| 3 | Skip | pass | 3/0 | `src/game-of-life.spec.ts` |
| 4 | Red | fail | 3/1 | `src/game-of-life.spec.ts` |
| 5 | Green | pass | 4/0 | `src/game-of-life.ts` |
| 6 | Red | fail | 4/1 | `src/game-of-life.spec.ts` |
| 7 | Green | pass | 5/0 | `src/game-of-life.ts` |
| 8 | Skip | pass | 10/0 | `src/game-of-life.spec.ts` |
| 9 | Red | fail | 10/1 | `src/game-of-life.spec.ts` |
| 10 | Green | pass | 11/0 | `src/game-of-life.ts` |
| 11 | Skip | pass | 12/0 | `src/game-of-life.spec.ts` |
| 12 | Skip | pass | 20/0 | `src/game-of-life.spec.ts` |
| 13 | Skip | pass | 23/0 | `src/game-of-life.spec.ts` |
| 14 | Skip | pass | 25/0 | `src/game-of-life.spec.ts` |

Final suite state: **pass**.

