## 2026-09-14T18:39:30Z — [RED] reverted
- Attempted: characterisation test for block edge cases (4/7 runes, mixed types, two blocks)
- Expected: RED: test should fail
- Actual: exit 0 — passed unexpectedly; existing block logic already covers these cases
## 2026-09-14T18:41:15Z — [RED] reverted
- Attempted: test for per-item deductible on a multi-damage incident
- Expected: RED: test should fail
- Actual: exit 0 — passed unexpectedly; per-damage deductible loop already covers it
## 2026-09-14T18:45:00Z — [RED] reverted
- Attempted: scenario test for the follow-up contract discount on the second quote step
- Expected: RED: test should fail
- Actual: exit 0 — passed unexpectedly; runScenario already passes results.length as contract index
## 2026-09-14T18:46:10Z — [RED] reverted
- Attempted: CLI test for unknown item type (non-zero exit, stderr mentions the type, empty stdout)
- Expected: RED: test should fail
- Actual: exit 0 — passed unexpectedly; the unhandled promise rejection already exits 1 and prints the type
## 2026-09-14T18:47:40Z — [RED] reverted
- Attempted: multi-item modifier scope test (cursed sword + plain amulet)
- Expected: RED: test should fail
- Actual: exit 0 — passed unexpectedly; per-item surcharges vs policy-wide modifiers are already separated
