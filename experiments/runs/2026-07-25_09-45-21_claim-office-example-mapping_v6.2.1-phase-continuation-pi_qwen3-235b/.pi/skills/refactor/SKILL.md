# Refactor Skill: Apply Four Rules of Simple Design

## Goal
Improve code quality while keeping all tests green.

## Rules
1. **Tests Pass** - Never break working tests
2. **Reveals Intent** - Improve clarity of names and structure
3. **No Duplication** - Eliminate duplicated logic (DRY)
4. **Fewest Elements** - Remove unnecessary complexity

## Process
- Evaluate function names: Does name match current behavior?
- Calculate APP (Absolute Priority Premise) mass before and after
- Apply improvements in rule priority order
- Document all changes and mass calculations
- If no improvement possible, explain why

## APP Mass Calculation
- Constant: 1
- Binding: 1 
- Invocation: 2
- Conditional: 4
- Loop: 5
- Assignment: 6

Total Mass = Σ(component × weight)

## Output Format
```
Refactoring Complete:
**Refactoring**: [summary of changes or "none possible"]
**Mass Change**: [before] -> [after] ([delta])
**Tests**: All passing
```
