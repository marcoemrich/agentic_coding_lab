# TDD Refactor Phase

You are now in the **Refactor Phase** of TDD. Follow these instructions to improve the code while keeping tests green.

## Your Mission

1. **MUST attempt at least one refactoring** - mandatory, not optional
2. Apply Kent Beck's Four Rules of Simple Design (priority order)
3. Use Absolute Priority Premise (APP) to measure improvements
4. Keep all tests green throughout
5. Document decisions and mass calculations
6. If no improvement possible, explicitly document why

## Context: $ARGUMENTS

## Refactor Phase Rules

- **Mandatory refactoring attempt**: MUST try at least one improvement
- **Tests must stay green**: Never break passing tests
- **Apply Simple Design Rules**: In priority order (1 → 2 → 3 → 4)
- **Calculate APP mass**: Before and after refactoring
- **Document decisions**: Explain improvements or why none were possible
- **Naming is first priority**: Evaluate if function name still fits

## Simple Design Rules (Priority Order)

### Rule 1: Tests Pass (Highest Priority)
- All tests must pass before and after refactoring
- If tests fail, revert and try different approach

### Rule 2: Reveals Intent
- Use meaningful names for variables, functions, classes
- Structure code to be self-documenting
- Prefer explicit over clever code
- **Naming Evaluation (FIRST)**:
  - Does this name clearly describe what the function does?
  - Has the function's purpose become clearer through the latest test?
  - Rename if the name doesn't capture the current full intent

### Rule 3: No Duplication (DRY)
- Extract common functionality
- Look for obvious and conceptual duplication
- Balance with Rule 2: If DRY hurts clarity, choose clarity

### Rule 4: Fewest Elements (Lowest Priority)
- Remove unnecessary abstractions
- Keep it simple - don't over-engineer
- Only add complexity when it serves clear purpose

## Absolute Priority Premise (APP)

### Mass Calculation
```
Total Mass = (constants × 1) + (bindings × 1) + (invocations × 2) +
             (conditionals × 4) + (loops × 5) + (assignments × 6)
```

### Component Values
| Component | Mass | Examples |
|-----------|------|----------|
| Constant | 1 | `5`, `"hello"`, `true` |
| Binding/Scalar | 1 | `amount`, `result`, parameters |
| Invocation | 2 | `calculate()`, `Math.max()` |
| Conditional | 4 | `if`, `switch`, `?:` |
| Loop | 5 | `for`, `forEach`, `map`, `reduce` |
| Assignment | 6 | `x = 5`, `count++` |

### Guidelines
- Lower mass = Generally better code
- **Rule 2 trumps APP**: Clarity over low mass
- Context matters: Don't sacrifice readability for mass

## Process

### Step 1: Naming Evaluation (FIRST PRIORITY)

Before anything else, evaluate naming:

```
**Naming Evaluation**:
- Current name: `calculate`
- Function purpose based on tests: "sums comma-separated numbers"
- Question: Does "calculate" clearly reveal this intent?
- Assessment: Too generic - could mean anything
- Decision: Rename to `sumCommaSeparatedNumbers` / Keep because [reason]
```

### Step 2: Calculate Initial APP Mass

```
**Current Code Mass**:
[paste current implementation]

Component Count:
- Constants: X (×1 = X)
- Bindings: X (×1 = X)
- Invocations: X (×2 = X)
- Conditionals: X (×4 = X)
- Loops: X (×5 = X)
- Assignments: X (×6 = X)

Total Mass: [sum]
```

### Step 3: Apply Simple Design Rules

Evaluate each rule systematically:

**Rule 1 - Tests Pass**: ✅ All [X] tests passing

**Rule 2 - Reveals Intent**:
- Names clear? [evaluation]
- Structure self-documenting? [evaluation]
- Potential improvements: [list or "none"]

**Rule 3 - No Duplication**:
- Duplicated code? [evaluation]
- Conceptual duplication? [evaluation]
- Potential improvements: [list or "none"]

**Rule 4 - Fewest Elements**:
- Unnecessary abstractions? [evaluation]
- Can simplify? [evaluation]
- Potential improvements: [list or "none"]

### Step 4: Implement Refactoring

- Make ONE improvement at a time
- Run tests after each change
- Ensure tests stay green
- If tests fail, revert

### Step 5: Calculate New APP Mass

```
**Refactored Code Mass**:
[paste refactored implementation]

Component Count:
[detailed breakdown]

Total Mass: [new sum]
Mass Change: [old] → [new] (Δ [difference])
```

### Step 6: Document Decision

**If Improvements Made:**
```
**Refactoring Applied**:
- ✅ Naming: [what was renamed and why]
- ✅ Mass: [old] → [new] (improvement/no change)
- ✅ Rule applied: [which rule and how]

Benefits:
- [benefit 1]
- [benefit 2]
```

**If No Improvements Possible:**
```
**Refactoring Evaluation**:
- ❌ Naming: Current name already clear because [reason]
- ❌ Duplication: No duplication found
- ❌ Mass: Already minimal ([X]) for this functionality
- ❌ Simplification: No unnecessary complexity

Reasoning:
Current implementation is already optimal because:
1. [reason 1]
2. [reason 2]

No refactoring performed - code is already clean.
```

### Step 7: Report Completion

```
🔄 Refactor Phase Complete:
**Naming**: [evaluated/changed to X]
**Refactoring**: [improvements made or "none possible - documented why"]
**Mass Change**: [before] → [after] (Δ [diff])
**Tests**: All [X] passing ✅

Proceeding to the next test.
```

## Important Guidelines

### DO
- ✅ MUST attempt at least one refactoring
- ✅ Evaluate naming FIRST
- ✅ Calculate APP mass before and after
- ✅ Apply Simple Design Rules in priority order
- ✅ Keep tests green at all times
- ✅ Document all decisions

### DON'T
- ❌ Skip refactoring phase
- ❌ Break tests during refactoring
- ❌ Sacrifice clarity for lower mass
- ❌ Refactor multiple things at once
- ❌ Say "no refactoring needed" without detailed explanation

## Completion

After completing Refactor phase, proceed to the next test:

```
🔄 Refactor Phase Complete. Proceeding to the next test.
```
