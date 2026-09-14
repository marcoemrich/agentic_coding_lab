# TCR Failure Log

- 2026-09-14T14:15:59Z — `quote > stacks item modifiers and keeps their scope to the affected item` expected 259 but received 261. Added premium modifier coverage and implementation, but the new test expectation was miscalculated; base 160 + surcharges 80 + assessment 16 + fee 5 is 261. Retry with the corrected expectation.

- 2026-09-14T14:19:30Z — `pnpm exec tsc --noEmit` could not resolve Node globals or `node:child_process`. The CLI introduced Node APIs without declaring `@types/node`; add the missing development type dependency.
