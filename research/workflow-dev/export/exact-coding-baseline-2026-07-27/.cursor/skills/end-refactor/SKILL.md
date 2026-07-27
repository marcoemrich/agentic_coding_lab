

### Apply HITL Checkpoint

Refactor runs inline in the main context here — applying the checkpoint is
**your** responsibility, not a requester's. Consult `@.cursor/rules/human-in-the-loop.mdc`; if the current
Autonomy Level includes a stop after this phase (the default `full-hitl`
does), present the checkpoint template and wait for approval.
