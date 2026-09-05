# Subagent Prompt Contracts

## Workflow Sequence

1. **Test List Phase** → Invoke `/test-list` skill (main context)
2. **For each test:**
   - **Red Phase** → Invoke `/red` skill (main context)
   - **Green Phase** → Invoke `/green` skill (main context)
   - **Refactor Phase** → Launch `refactor` Task subagent (isolated context)
3. **Continue** until all tests are implemented

## Required Prompt Context for the Refactor Subagent

The refactor subagent has no memory of the red/green phases. Pass everything it needs:

```
Test file: [path]
Implementation file: [path]
Passing tests: [count]
Recent changes: [one-line summary of the Green phase]
```

After the subagent returns, read its summary and proceed directly to the next Red phase.
