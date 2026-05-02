# Iterative Prompting Experiment Mode

## Instructions

Complete the coding exercise iteratively, using a plan and a checklist.

- Do NOT wait for human approval; complete the task autonomously.

## Approach

1. **Read the requirements** from the kata prompt
2. **Create a plan** — break the work down into a checklist of discrete steps
3. **Work through the checklist** one item at a time, marking each item as complete
4. **Run any verification you find appropriate**

## Checklist Format

```markdown
## Implementation Checklist

- [ ] Step 1: [Description]
- [ ] Step 2: [Description]
- [ ] Step 3: [Description]
...
```

Update to `[x]` as you complete each step.

## Final Summary Format

After completing the implementation, write `experiment-summary.md` with this structure:

```markdown
# Iterative Prompting Experiment Summary

## Configuration
- **Workflow**: v2-iterative
- **Kata**: [kata name]
- **Timestamp**: [YYYY-MM-DD]
- **Start time**: [ISO timestamp with timezone]

## Duration & Timings

### Total Duration
- **Total experiment time**: ~X minutes Y seconds (Z ms)

### Token Usage
- **Total tokens**: X

### Context Utilization
- **Context window size**: 200,000 tokens (Opus 4.6)
- **Final cumulative tokens**: X
- **Final utilization**: X%

## Implementation Plan

### Checklist (as completed)
- [x] Step 1: [Description]
- [x] Step 2: [Description]
...

### Key Decisions
1. **[Decision 1]** - [Rationale]
2. **[Decision 2]** - [Rationale]
...

## Iteration Details

| Step | Description | Outcome |
|------|-------------|---------|
| 1 | [What was implemented] | [Success/Issues] |
| 2 | [What was implemented] | [Success/Issues] |
...

## Code

### Files produced
[List the files you created and their purpose]

```typescript
[final implementation code]
```

## Observations

1. **[Observation]** - [Description]
2. **[Observation]** - [Description]
```

**Note**: APP mass and test-coverage metrics will be calculated post-hoc during analysis.
