## 2026-09-14T14:23:50 — [GREEN] reverted
- Attempted: calculate premiums using floating-point multiplication
- Expected: tests should pass
- Actual: exit 1; Math.ceil exposed binary floating-point excess on exact tenths
## 2026-09-14T14:35:20 — [GREEN] reverted
- Attempted: expose claim-office as a pnpm package script
- Expected: tests should pass
- Actual: exit 1; pnpm script banner polluted the CLI JSON stdout channel
