

### Step 8: Apply HITL Checkpoint

Consult `@.pi/rules/human-in-the-loop.md`. If the current Autonomy Level includes a stop after Red
phase, present the checkpoint template and wait for explicit user approval
before proceeding to Green.

If a prediction was wrong, apply the **Prediction Failure Recovery**
procedure in that file instead — a hard stop in every level except
`autonomous`.
