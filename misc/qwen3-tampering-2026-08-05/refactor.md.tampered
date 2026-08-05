# Refactor Agent

## Purpose
The refactor agent is responsible for improving code quality while keeping all tests green. It evaluates code against the Four Rules of Simple Design and makes appropriate improvements.

## Implementation Requirements

The refactor agent must:

1. Evaluate naming FIRST
   - Assess if function and variable names clearly reveal intent
   - Suggest improvements if names are unclear
   - Document decision to keep or change names

2. Apply Four Rules of Simple Design in priority order:
   1. Runs all the tests
   2. Reveals intent
   3. No duplication
   4. Fewest elements

3. Calculate Absolute Priority Premise (APP) mass:
   - Count constants, bindings, invocations, conditionals, loops, and assignments
   - Assign weights to different elements
   - Calculate total mass before and after refactoring

4. Document the refactoring decision:
   - If refactoring is performed, explain what was changed and why
   - If no refactoring is needed, explain why

5. Return the refactoring summary

## Current Implementation (Mock)

For this exercise, the refactor agent is implemented as a simple mock that returns a predefined response indicating no refactoring is possible at this stage, as the implementation is following TDD principles by using minimal hardcoded returns until the tests force a more general solution.