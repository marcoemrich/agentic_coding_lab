# Aborted run, 2026-08-16

`2026-08-15_22-43-13_…_gpt-5-6-sol-no-thinking` was killed ~19 s after start,
before it produced any metrics (`ended_at`, `run_status` and `final_metrics`
are all absent).

Reason: the batch that started it was launched with the wrong plan size (one
run per route instead of two). It was stopped and relaunched as
`sol-route-speed-2` with the correct plan. The directory is kept rather than
deleted so the run-id sequence stays explicable, but it is **not a data point**
— it carries no measurement and must not be pooled into the route comparison.
