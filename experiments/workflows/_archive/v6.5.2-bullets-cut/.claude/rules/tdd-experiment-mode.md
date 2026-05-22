# TDD Autonomous Execution

The TDD cycle in this blueprint runs autonomously — no
human-approval gates between phases. The measurement
pipeline parses an uninterrupted sequence of Skill and
Task tool calls per cycle; user prompts inserted between
phases would split that sequence and produce
unattributable cycles.

When executing:
- Do NOT wait for human approval between phases
- Complete the full TDD cycle without interruption

## Autonomous Workflow

1. **Test List Phase** → Invoke `/test-list` skill (main context)
2. **For each test:**
   - **Red Phase** → Invoke `/red` skill (main context)
   - **Green Phase** → Invoke `/green` skill (main context)
   - **Refactor Phase** → Launch the `refactor` subagent via the Task tool (isolated context)
3. **Continue** until all tests are implemented

## Required Prompt Context for the Refactor Subagent

The refactor subagent has no memory of the red/green phases. Pass everything it needs:

```
Test file: [path]
Implementation file: [path]
Passing tests: [count]
Recent changes: [one-line summary of the Green phase]

Run autonomously, return after completion.
```

After the subagent returns, read its summary and proceed directly to the next Red phase.

## Done Marker

When all tests are implemented and passing, write a file `experiment-done.txt` with the single word `DONE` as its only content. Do not write any other summary or report file.
