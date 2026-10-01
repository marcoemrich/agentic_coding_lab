# TDD phase chain — 2026-10-01_00-00-05_game-of-life-example-mapping_exact-hybrid-v2.4-lab-split-cc_opus-5-5-no-thinking

**20 suite invocations.** Derived from `tdd-events.jsonl`; no workflow markers, tool calls or commits were read.

## Chain

```
Red -> Red(c) -> Red -> Green -> Refactor -> Skip -> Skip -> Red -> Green -> Refactor -> Skip -> Red -> Green -> Verify -> Refactor -> Refactor -> Skip -> Skip -> Skip -> Skip
```

Deviations present: `Skip` ×7 (test arrived and passed immediately — never red)

## Metrics

| Metric | Value |
|---|---:|
| `suite_runs` | 20 |
| `cycles_total` | 10 |
| `cycles_closed` | 3 |
| `test_first_rate` | 0.417 |
| `red_batch_size` | 1.0 |
| `red_batch_max` | 1 |
| `red_batch_unmeasurable` | 1 |
| `green_batch_size` | 1.0 |
| `refactor_events` | 4 |
| `skip_events` | 7 |
| `refactor_per_cycle` | 1.333 |
| `green_attempts` | 0.0 |
| `deviations` | 7 |
| `opens_red` | True |
| `ends_green` | True |
| `tdd_discipline` | 0.5 |
| `tdd_discipline_test_first` | 0.417 |
| `tdd_discipline_step` | 1.0 |
| `tdd_discipline_closure` | 0.3 |

`red_batch_size` is the one to read for step size: 1 means one failing test at a time, higher means a batch of tests was authored before any implementation existed. `green_batch_size` is its mirror on the implementation side — the two separate when a workflow writes several tests up front and then implements them one by one.

## Cycles (3 of 10 closed with a Green)

  1. `1–5`  Red -> Red(c) -> Red -> Green -> Refactor
  2. `6–6`  Skip  ← never closed
  3. `7–7`  Skip  ← never closed
  4. `8–10`  Red -> Green -> Refactor
  5. `11–11`  Skip  ← never closed
  6. `12–16`  Red -> Green -> Verify -> Refactor -> Refactor
  7. `17–17`  Skip  ← never closed
  8. `18–18`  Skip  ← never closed
  9. `19–19`  Skip  ← never closed
 10. `20–20`  Skip  ← never closed

## Label counts

| Label | n | Meaning |
|---|---:|---|
| `Skip` | 7 | test arrived and passed immediately — never red |
| `Red` | 4 | a new failing test arrived |
| `Refactor` | 4 | implementation changed, suite stayed green |
| `Green` | 3 | implementation changed, suite went green |
| `Red(c)` | 1 | test arrived, suite does not compile yet |
| `Verify` | 1 | nothing changed, suite re-run |

## Per invocation

| # | Phase | Suite | Tests p/f | Changed since previous |
|---:|---|---|---|---|
| 1 | Red | fail | 0/0 | _(initial tree: 1 files)_ |
| 2 | Red(c) | fail (1 collect err) | 0/0 | `src/game-of-life.spec.ts` |
| 3 | Red | fail | 0/1 | `src/game-of-life.ts` |
| 4 | Green | pass | 1/0 | `src/game-of-life.ts` |
| 5 | Refactor | pass | 1/0 | `src/game-of-life.ts` |
| 6 | Skip | pass | 2/0 | `src/game-of-life.spec.ts` |
| 7 | Skip | pass | 3/0 | `src/game-of-life.spec.ts` |
| 8 | Red | fail | 3/1 | `src/game-of-life.spec.ts` |
| 9 | Green | pass | 4/0 | `src/game-of-life.ts` |
| 10 | Refactor | pass | 4/0 | `src/game-of-life.ts` |
| 11 | Skip | pass | 5/0 | `src/game-of-life.spec.ts` |
| 12 | Red | fail | 5/1 | `src/game-of-life.spec.ts` |
| 13 | Green | pass | 6/0 | `src/game-of-life.ts` |
| 14 | Verify | pass | 6/0 | — |
| 15 | Refactor | pass | 6/0 | `src/game-of-life.ts` |
| 16 | Refactor | pass | 6/0 | `src/game-of-life.ts` |
| 17 | Skip | pass | 7/0 | `src/game-of-life.spec.ts` |
| 18 | Skip | pass | 8/0 | `src/game-of-life.spec.ts` |
| 19 | Skip | pass | 9/0 | `src/game-of-life.spec.ts` |
| 20 | Skip | pass | 10/0 | `src/game-of-life.spec.ts` |

Final suite state: **pass**.

