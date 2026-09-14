## 2026-09-14T18:48:05Z — [RED] reverted
- Attempted: integration test "long-standing customer's second contract" (cursed sword ench 7, 3 years, 2nd contract → 160 G)
- Expected: test should fail
- Actual: exit 0 — passed unexpectedly; the modifier engine built by earlier steps already composes curse + high enchantment + loyalty + first insurance + follow-up correctly
## 2026-09-14T18:49:06Z — [RED] reverted
- Attempted: block applies per component type and only at exactly 3 (4 runes, 3+3, 2 runes + 1 moonstone)
- Expected: test should fail
- Actual: exit 0 — passed unexpectedly; the per-type count==3 loop from the previous GREEN already covers these cases
## 2026-09-14T18:53:22Z — [RED] reverted
- Attempted: dragon-material clause (full reimbursement; 50% enchantment clause still wins at ench 8)
- Expected: test should fail
- Actual: exit 0 — passed unexpectedly; "fully reimbursed" is already the default behaviour and the ench>=8 rule already takes precedence, so the clause changes no outcome. Re-added as characterization tests in the following REFACTOR.
## 2026-09-14T18:54:30Z — [RED] reverted
- Attempted: second quote step gets the follow-up contract discount (integration example, 160 G)
- Expected: test should fail
- Actual: exit 0 — passed unexpectedly; with only quote steps, results.length already equals the number of prior quotes. A claim step in between is needed to distinguish the two counters.
## 2026-09-14T18:55:10Z — [RED] reverted
- Attempted: successive claims on the same policy deplete the cap (second claim → payout 600, remainingCap 0)
- Expected: test should fail
- Actual: exit 0 — passed unexpectedly; the previous GREEN already writes the settled remainingCap back onto the stored policy. Re-added as a characterization test in the following REFACTOR.
## 2026-09-14T18:56:11Z — [RED] reverted
- Attempted: CLI exits non-zero with a stderr description and empty stdout on an unknown item type
- Expected: test should fail
- Actual: exit 0 — passed unexpectedly; an uncaught throw from runScenario already produces a non-zero exit, the message on stderr, and no stdout. Re-added as a characterization test in the following REFACTOR, alongside a clean error report.
## 2026-09-14T18:56:53Z — [RED] reverted
- Attempted: modifier scope on a multi-item policy (cursed sword + plain amulet → 231 G)
- Expected: test should fail
- Actual: exit 0 — passed unexpectedly; item-scoped surcharges vs policy-scoped modifiers were already separated in the "curse surcharge" GREEN. Re-added as a characterization test in the following REFACTOR.
