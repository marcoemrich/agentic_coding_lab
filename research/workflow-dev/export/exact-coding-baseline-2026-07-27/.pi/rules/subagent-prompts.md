# Subagent Prompt Contracts

The refactor and end-refactor subagents run in **isolated contexts**. They
have no memory of the test-list, red, or green phases. Everything they need
must be in the prompt.

This file defines what to pass. For the phase sequence itself see
`@.claude/rules/tdd-execution-mode.md`.

## Required Prompt Context for the Refactor Subagent (per cycle)

```
Test file: [path]
Implementation file: [path]
Passing tests: [count]
Recent changes: [one-line summary of the Green phase]
```

After the subagent returns, read its summary and proceed directly to the
next Red phase.

## Required Prompt Context for the End-Refactor Subagent (once, after the last green cycle)

The end-refactor subagent refactors the **whole production tree**. Pass:

```
Implementation files: src/<all non-spec *.ts>
Test files: src/<*.spec.ts>
Passing tests: [count]

Run the final metric-driven refactoring pass over the whole src/.
Iterate ONE change at a time with pre/post measurement (ESLint, cognitive,
APP, McCabe). Stop when no metric improves further or no improvement is
possible.
```

Launch the end-refactor subagent exactly once, after the last per-cycle
refactor returns. After it returns, read its summary.
