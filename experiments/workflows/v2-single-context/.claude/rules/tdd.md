# Test-Driven Development (TDD) Rules

## ⚠️ CRITICAL: Skill Usage is MANDATORY

**YOU MUST USE THE SPECIALIZED TDD SKILLS FOR EVERY TDD TASK.**

Do NOT perform TDD phases without invoking the appropriate skill. The skills enforce discipline and prevent common mistakes.

### Before Starting Any TDD Work - Complete This Checklist:

- [ ] Have I been asked to implement something using TDD?
- [ ] Am I about to write tests or implementation code?
- [ ] **STOP** - Use the Skill tool to invoke the appropriate TDD skill
- [ ] NEVER write tests or code directly - ALWAYS use skills

### Which Skill to Use:

| Phase | Skill Name | Invoke With |
|-------|-----------|-------------|
| Test List | `/test-list` | `Skill({ skill: "test-list" })` |
| Red Phase | `/red` | `Skill({ skill: "red" })` |
| Green Phase | `/green` | `Skill({ skill: "green" })` |
| Refactor Phase | `/refactor` | `Skill({ skill: "refactor" })` |

**If you find yourself writing test code or implementation code without invoking a skill first, you are doing it WRONG.**

## Overview

This project follows strict Test-Driven Development practices using the Red-Green-Refactor cycle.

## TDD Workflow

**MANDATORY: Use the specialized TDD skills for each phase of the cycle:**

### 1. Test List Phase
**🚨 INVOKE SKILL**: Use `Skill` tool with `skill: "test-list"`

**Required context to provide:**
- Feature/function to implement
- Target file paths (test file + implementation file)
- Any constraints or requirements from the user

**Example Skill call:**
```
Skill({ skill: "test-list", args: "Feature: String Calculator, Test file: src/calculator.spec.ts, Implementation: src/calculator.ts" })
```

The skill will guide you to create a comprehensive test list using `it.todo()` for BASE FUNCTIONALITY ONLY:
- Focus on core behavior, not advanced features
- Order tests from simple → complex
- No implementation yet

**DO NOT** write the test list yourself - follow the skill's guidance.

### 2. Red Phase
**🚨 INVOKE SKILL**: Use `Skill` tool with `skill: "red"`

**Required context to provide:**
- Test file path
- Which `it.todo()` to activate (name or line number)
- Current state (number of passing tests)
- Implementation file path

**Example Skill call:**
```
Skill({ skill: "red", args: "Test: src/calculator.spec.ts, Activate: 'should return sum for two numbers', State: 2 passing" })
```

The skill will guide you to activate exactly ONE test and make it fail:
- Convert one `it.todo()` to executable test
- Make explicit predictions (Guessing Game)
- Verify compilation error, then runtime error

**DO NOT** write test code yourself - follow the skill's guidance.

### 3. Green Phase
**🚨 INVOKE SKILL**: Use `Skill` tool with `skill: "green"`

**Required context to provide:**
- Test file path
- Failing test name and expected behavior
- Current error message
- Implementation file path

**Example Skill call:**
```
Skill({ skill: "green", args: "Test: 'should return sum for two numbers', Error: Expected 3, Received undefined" })
```

The skill will guide you to implement minimal code to make the test pass:
- Use the simplest possible solution
- Hardcoded returns are acceptable early on
- No features for future tests

**DO NOT** write implementation code yourself - follow the skill's guidance.

### 4. Refactor Phase
**🚨 INVOKE SKILL**: Use `Skill` tool with `skill: "refactor"`

**Required context to provide:**
- Test file path
- Implementation file path
- Current number of passing tests
- Recent changes made in Green phase

**Example Skill call:**
```
Skill({ skill: "refactor", args: "Tests: 3 passing, Recent: Added split/map/reduce for comma parsing" })
```

The skill will guide you to improve code while keeping tests green:
- **MUST attempt at least one refactoring**
- Evaluate naming FIRST
- Apply Four Rules of Simple Design (priority order)
- Calculate APP (Absolute Priority Premise) mass
- Document improvements or why none were possible

**DO NOT** refactor code yourself - follow the skill's guidance.

### 5. Repeat
Return to step 2 (Red phase) for the next test in the list.

**Invoke the `red` skill again - DO NOT proceed manually.**

## Core TDD Principles

### TDD Mindset
TDD practices will feel counterintuitive:
- **Hardcoded returns feel "too simple"** - This is correct!
- **The urge to implement ahead is strong** - Resist this
- **Minimal steps feel inefficient** - They actually accelerate development
- **Predictions feel unnecessary** - They build crucial understanding
- **Push through discomfort** - These feelings indicate you're following the discipline correctly

### Common TDD Failure Modes
Watch for these violations:
- **🚨 NOT USING TDD SKILLS** - The most critical failure mode!
- Planning beyond base functionality
- Multiple active tests at once
- Implementing beyond what tests demand
- Skipping predictions
- Avoiding refactoring
- Premature abstraction
- Ignoring the uncomfortable
- Writing code directly instead of invoking skills

### Why This Discipline Works
- **Baby steps reveal simpler solutions** - Implementing only what tests demand often uncovers simpler approaches
- **One-test-at-a-time prevents complexity** - Not thinking ahead eliminates unnecessary features
- **Predictions build confidence** - Explicit expectations create deeper understanding
- **Refactoring becomes natural** - Mandatory improvement attempts prevent technical debt
- **The process fights harmful instincts** - Programming instincts often lead to premature optimization

## Technical Setup

See `@.claude/rules/tdd_with_ts_and_vitest.md` for TypeScript and Vitest configuration.

## Running Tests - CRITICAL

**🚨 MUST use pnpm with npm scripts**

### Correct Test Execution:
- ✅ `pnpm test` - Run all tests
- ✅ `pnpm test:unit` - Run unit tests
- ✅ `pnpm test:unit:basic` - Run basic unit tests
- ✅ `pnpm run build` - Build project

### NEVER use:
- ❌ `npm test` - Wrong package manager
- ❌ `npx vitest` - Don't call vitest directly
- ❌ `vitest --run SomeFile.spec.tsx` - Don't call test files directly
- ❌ Individual test file execution - Always use npm scripts

**Why**: npm scripts orchestrate TypeScript compilation, configuration, and test execution. Direct tool calls skip critical setup steps.

## Remember

- **🚨 ALWAYS USE TDD SKILLS** - Never write tests or code directly during TDD
- **Discomfort is a signal you're doing it right** - TDD should feel constraining at first
- **Trust the process** - Simple steps compound into elegant solutions
- **Discipline over instinct** - Follow the rules even when they feel wrong
- **Skills enforce TDD discipline** - They prevent you from making common mistakes

## Self-Check Before Proceeding

Ask yourself before writing ANY code:

1. ❓ **Am I doing TDD right now?**
   - If YES → Have I invoked the appropriate skill?
   - If NO skill invoked → **STOP and invoke the skill first**

2. ❓ **Am I about to write a test or implementation?**
   - If YES → Which phase am I in? Have I invoked that skill?
   - If NO skill invoked → **STOP and invoke the skill first**

3. ❓ **Did the user ask me to use TDD or am I implementing a feature?**
   - If YES → **Invoke test-list skill to start**
   - If unsure → Ask the user

**When in doubt, use the skills. They are there to help you follow the discipline correctly.**
