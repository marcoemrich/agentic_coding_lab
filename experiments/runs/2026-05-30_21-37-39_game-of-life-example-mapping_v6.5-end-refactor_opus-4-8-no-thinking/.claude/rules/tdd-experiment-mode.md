# TDD Autonomous Execution

The TDD cycle in this workflow runs autonomously — no
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
3. **Continue** until all tests are implemented and passing
4. **End-Refactor Phase** → Launch the `end-refactor` subagent ONCE via the Task tool (isolated context), over the whole `src/`
5. **Done Marker** → write `experiment-done.txt`

## Required Prompt Context for the Refactor Subagent (per cycle)

The refactor subagent has no memory of the red/green phases. Pass everything it needs:

```
Test file: [path]
Implementation file: [path]
Passing tests: [count]
Recent changes: [one-line summary of the Green phase]

Run autonomously, return after completion.
```

After the subagent returns, read its summary and proceed directly to the next Red phase.

## Required Prompt Context for the End-Refactor Subagent (once, after the last green cycle)

The end-refactor subagent runs in an isolated context and refactors the **whole production tree**. Pass:

```
Implementation files: src/<all non-spec *.ts>
Test files: src/<*.spec.ts>
Passing tests: [count]

Run the final metric-driven refactoring pass over the whole src/.
Iterate ONE change at a time with pre/post measurement (ESLint, cognitive,
APP, McCabe). Stop when no metric improves further or no improvement is
possible. Return after completion.
```

Launch the end-refactor subagent exactly once, after the last per-cycle refactor returns. After it returns, read its summary and proceed to the Done Marker.

## Done Marker

When all tests are implemented and passing AND the end-refactor pass has returned, write a file `experiment-done.txt` with the single word `DONE` as its only content. Do not write any other summary or report file.
