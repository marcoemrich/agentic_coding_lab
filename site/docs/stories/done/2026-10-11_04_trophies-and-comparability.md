# Trophies and comparability

Status: done
Source: [results-site decisions](../../open-questions.md#rq-page).

## Story

Mark eligible winners per kata table using metric direction and the spread rule. Warn where comparisons cross a test-list or stack boundary, and withhold trophies for affected columns. Implemented in `site/src/trophy.ts` and `site/src/metric-comparability.ts`; tests in `site/src/trophies-and-comparability.spec.tsx`.
