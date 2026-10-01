# TDD Execution Mode

This workflow runs the TDD cycle as a sequence of Skill invocations
(`/test-list`, `/red`, `/green`) and two Task subagents (`refactor` per cycle,
`end-refactor` once at the end). Whether the cycle pauses for human approval
between phases is controlled by `@.claude/rules/human-in-the-loop.md` (the
Autonomy Level setting at the top of that file).

## Workflow Sequence

1. **Test List Phase** → Invoke `/test-list` skill (main context)
2. **For each test:**
   - **Red Phase** → Invoke `/red` skill (main context)
   - **Green Phase** → Invoke `/green` skill (main context)
   - **Refactor Phase** → Launch the `refactor` subagent via the Task tool
     (isolated context)
3. **Continue** until all tests are implemented and passing
4. **End-Refactor Phase** → Launch the `end-refactor` subagent via the Task
   tool ONCE, over the whole `src/`
5. At each phase boundary, consult
   `@.claude/rules/human-in-the-loop.md` to decide whether to stop or
   continue

## Subagent prompt contracts

Both refactor phases run in isolated contexts with no memory of the
test-list, red, or green phases. What to pass each of them is specified in
`@.claude/rules/subagent-prompts.md`.

After a subagent returns, read its summary, then consult HITL before
proceeding to the next phase.

## Interactive by default

This workflow is meant to be run interactively and is free to pause at any
phase boundary. It expects a human on the other end: the Autonomy Level
decides where it stops, and the session simply ends after the final
End-Refactor checkpoint. There is no completion marker to write and no
requirement to finish the whole cycle in one uninterrupted turn.

If you are driving this workflow from an automation harness that needs a
mechanical completion signal, add that instruction in your own prompt — it is
deliberately not part of the workflow.
