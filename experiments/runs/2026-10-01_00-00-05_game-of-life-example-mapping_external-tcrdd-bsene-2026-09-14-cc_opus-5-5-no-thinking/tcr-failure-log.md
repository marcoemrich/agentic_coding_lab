## 2026-10-01T00:05:00Z — [REFACTOR] reverted
- Attempted: restructure spec to mirror prompt.md examples with order-insensitive helper
- Expected: tests should pass
- Actual: exit 1 — rule 2 and rule 3 examples failed; the prompt's drawn Gen 1 grids contradict the stated rules ((1,1) in rule 2 example has 4 neighbours; rule 3 centre has 6 and top/bottom middles survive with 3)
