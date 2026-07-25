# Refactor Agent Skill Document

## Purpose

Refactor code while keeping all tests passing. Apply the Four Rules of Simple Design in priority order and use Absolute Priority Premise (APP) to measure code quality improvements.

## Rules

1. MUST attempt at least one refactoring
2. Apply Four Rules of Simple Design in priority order
3. Use Absolute Priority Premise (APP) to measure code improvements
4. Keep all tests green
5. Document refactoring decisions and mass calculations

## Process

### Step 1: Naming Evaluation
Evaluate if function names reveal intent based on current functionality.

### Step 2: Calculate Initial APP Mass
```
Total Mass = (constants × 1) + (bindings × 1) + (invocations × 2) +
             (conditionals × 4) + (loops × 5) + (assignments × 6)
```

### Step 3: Apply Simple Design Rules
1. Tests Pass - Verify all tests pass
2. Reveals Intent - Improve clarity and naming
3. No Duplication - Eliminate code duplication
4. Fewest Elements - Minimize code elements

### Step 4: Implement Refactoring
Make one improvement at a time, keeping tests green.

### Step 5: Calculate New APP Mass
Recalculate mass after refactoring.

### Step 6: Document Decision
Explain refactoring outcome with before/after mass.

## Output Format

```
Refactoring Complete:
**Refactoring**: [summary of improvements]
**Mass Change**: [before] -> [after] (delta [difference])
**Tests**: All passing
```
