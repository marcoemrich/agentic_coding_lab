# TDD Execution Mode

This workflow runs the TDD cycle as a sequence of Skill invocations
(`/test-list`, `/red`, `/green`) and one Task subagent (`refactor`). Whether
the cycle pauses for human approval between phases is controlled by
`@.claude/rules/human-in-the-loop.md` (the Autonomy Level setting at the top
of that file).

## Workflow Sequence

1. **Test List Phase** → Invoke `/test-list` skill (main context)
2. **For each test:**
   - **Red Phase** → Invoke `/red` skill (main context)
   - **Green Phase** → Invoke `/green` skill (main context)
   - **Refactor Phase** → Launch the `refactor` subagent via the Task tool
     (isolated context)
3. **Continue** until all tests are implemented
4. At each phase boundary, consult
   `@.claude/rules/human-in-the-loop.md` to decide whether to stop or
   continue

## Required Prompt Context for the Refactor Subagent

The refactor subagent has no memory of the red/green phases. Pass everything
it needs:

```
Test file: [path]
Implementation file: [path]
Passing tests: [count]
Recent changes: [one-line summary of the Green phase]
```

After the subagent returns, read its summary, then consult HITL before
proceeding to the next Red phase.

## Optional Done Marker

For unattended batch runs (e.g. CI pipelines or automation harnesses), it can
be useful to signal task completion mechanically. If your runner expects one,
write a file `experiment-done.txt` with the single word `DONE` as its only
content when all tests are implemented and passing.

In interactive use this marker is unnecessary; the human sees the final
Refactor checkpoint and ends the session normally.
