## 2026-09-14T18:06:00Z — [GREEN] reverted
- Attempted: sum base 100 per item, multiply by 1.1 for first insurance, add 5 fee
- Expected: tests should pass
- Actual: exit 1 — expected 115.00000000000001 to be 115 (float arithmetic)
## 2026-09-14T18:09:00Z — [RED] reverted
- Attempted: integration test (long-standing customer 2nd contract = 160) plus multi-item modifier scope test (231)
- Expected: test should fail
- Actual: exit 0 — both passed immediately; existing modifier composition already covers them
## 2026-09-14T18:10:15Z — [RED] reverted
- Attempted: "alike" means identical type only (2 runes + 1 moonstone = 88)
- Expected: test should fail
- Actual: exit 0 — per-type counting already implements this interpretation
## 2026-09-14T18:16:15Z — [RED] reverted
- Attempted: CLI exits non-zero with stderr description for unknown item type
- Expected: test should fail
- Actual: exit 0 — Node's default unhandled-rejection behaviour already exits non-zero and prints the message; assertion satisfied incidentally
