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
3. **Continue** until all tests are implemented and passing
4. **End-Refactor Phase** → Launch the `end-refactor` subagent ONCE via the
   Task tool (isolated context), over the whole `src/`
5. At each phase boundary, consult
   `@.claude/rules/human-in-the-loop.md` to decide whether to stop or
   continue

## Subagent Prompt Contracts

Both subagents run in isolated contexts with no memory of the red/green
phases — everything they need must be in the prompt. The exact field lists
are in `@.claude/rules/subagent-prompts.md`.

After a subagent returns, read its summary, then consult HITL before
proceeding.

## Optional Done Marker

For unattended batch runs (e.g. CI pipelines or automation harnesses), it can
be useful to signal task completion mechanically. If your runner expects one,
write a file `experiment-done.txt` with the single word `DONE` as its only
content when all tests are implemented and passing.

In interactive use this marker is unnecessary; the human sees the final
Refactor checkpoint and ends the session normally.
