## 2026-09-14T17:14:20Z — [RED] reverted
- Attempted: tests for mixed-type components, 4 and 7 alike components (no block)
- Expected: RED: test should fail
- Actual: exit 0 — all 13 passed unexpectedly; the existing grouping logic already covers these cases
## 2026-09-14T17:15:06Z — [RED] reverted
- Attempted: test that curse surcharge is scoped to the cursed item on a multi-item policy
- Expected: RED: test should fail
- Actual: exit 0 — passed unexpectedly; per-item surcharge loop already yields item-scoped behaviour
## 2026-09-14T17:16:33Z — [RED] reverted
- Attempted: the two spec integration examples (newcomer cursed sword 165 G; long-standing second contract 160 G)
- Expected: RED: test should fail
- Actual: exit 0 — both passed unexpectedly; the premium rules driven out so far already compose correctly
## 2026-09-14T17:17:05Z — [RED] reverted
- Attempted: test that the deductible applies once per damaged item (sword 500 + amulet 300 -> 600)
- Expected: RED: test should fail
- Actual: exit 0 — passed unexpectedly; the per-damage loop already deducts per entry
## 2026-09-14T17:19:26Z — [RED] reverted
- Attempted: dragon-material clause tests (ench 5 -> 700, ench 9 -> 400) and rune payout (200 -> 100)
- Expected: RED: test should fail
- Actual: exit 0 — passed unexpectedly. Dragon material needs no code path: full reimbursement is
  already the default, and every spec example where it overlaps the enchantment>=8 clause resolves
  in favour of the 50% rule, which is already implemented.
## 2026-09-14T17:20:22Z — [RED] reverted
- Attempted: scenario test that only quote steps advance the follow-up contract index
- Expected: RED: test should fail
- Actual: exit 0 — passed unexpectedly; the separate contractIndex counter already skips claim steps
## 2026-09-14T17:20:56Z — [RED] reverted
- Attempted: CLI test for non-zero exit + stderr message + empty stdout on an unknown item type
- Expected: RED: test should fail
- Actual: exit 0 — passed unexpectedly; the unhandled rejection from main() already exits non-zero
  and prints the error (including the type name) to stderr before anything is written to stdout
## 2026-09-14T17:21:49Z — [RED] reverted
- Attempted: cap tests — cursed sword cap 2000, sword + 3-rune block cap 3500
- Expected: RED: test should fail
- Actual: exit 0 — passed unexpectedly; the cap is already derived from a separate insurance-value
  table that knows nothing about premium modifiers or the block discount
