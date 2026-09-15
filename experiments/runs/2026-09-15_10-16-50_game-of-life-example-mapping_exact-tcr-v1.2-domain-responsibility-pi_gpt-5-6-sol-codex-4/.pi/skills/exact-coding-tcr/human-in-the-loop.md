# Human-in-the-Loop (HITL)

This file is the single source of truth for EXACT Coding TCR checkpoints.

## Autonomy Level

**Current setting:** `autonomous`

| Level | Stops after |
|---|---|
| `every-step` | Every Red, Green, and Refactor step |
| `refactor-only` | Every Refactor step |
| `task-end` | End of task |
| `autonomous` | Never |

At a required checkpoint, summarize the verified evidence and wait for explicit human approval:

- **Red:** show the active behavior, actual test result, and why the committed failure is the intended behavioral Red.
- **Green:** show the active behavior, the production change, and the passing test evidence.
- **Refactor:** name the Four Rules decision, each structural change made, and the passing test evidence. Report explicitly when no refactoring improved the code.
- **Task end:** summarize the completed behaviors, commits, and final quality-gate evidence.

The Test List is verified and committed without a separate checkpoint. Do not begin the next TCR phase while waiting for approval. Only `autonomous` may continue without waiting at configured checkpoints.
