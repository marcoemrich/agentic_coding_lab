# EXACT Coding Predictive TDD — TCR-Parity Port (Claude Code)

This workflow transfers `exact-tcr-v1.3-domain-boundary-trial-pi` to Predictive TDD. It retains the source workflow's complete inactive test list, domain-responsibility and boundary-trial contract, concrete stack guidance, shared context, autonomous execution, and parser-visible records. Only method-specific TCR behavior is replaced: predictions and checks keep or narrowly undo changes without phase commits or hard resets.

## Required documents

Before changing code, read these files completely:

1. `/exact-coding-ptdd`
2. `/test-list`
3. `/predictive-tdd`
4. the matching profile under `.claude/skills/exact-coding-ptdd/stacks/`
5. `prompt.md`

Follow the composed `exact-coding-ptdd` skill when a generic Predictive TDD rule and this workflow differ. In particular, an activated behavior already satisfied by an earlier generalization is verified and recorded as already green; never manufacture a failure.

Use the full-suite command and quality gates selected by the stack profile. The run directory is an isolated Git repository only to control the environment against the TCR arm. Do not create method commits, change Git configuration, use hard resets as phase transitions, or operate outside the repository.

## Architecture

Invoke `/exact-coding-ptdd` once and follow it in the main context for the complete test-list and Predictive-TDD loop. `/test-list` and `/predictive-tdd` are supporting command documents referenced by the composed command. Red and Green stay in the main context; every Refactor phase is delegated through the Task tool to the isolated `refactor` subagent. Read the matching stack profile before changing code.
