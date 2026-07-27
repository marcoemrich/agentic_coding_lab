

### Step 8: Apply HITL Checkpoint

Consult `@.cursor/rules/human-in-the-loop.mdc`. If the current Autonomy Level includes a stop after Red,
present the checkpoint template and wait for approval before Green.

If a prediction was wrong, apply the **Prediction Failure Recovery**
procedure in that file instead — a hard stop in every level except
`autonomous`.
