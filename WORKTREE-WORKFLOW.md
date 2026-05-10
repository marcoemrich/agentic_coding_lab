# Worktree workflow for agents

Goal: multiple agents work in parallel on their own worktrees but integrate frequently into `main` (continuous integration rather than long-lived feature branches).

## Layout

```
agentic_coding_lab_project/
├── main/      # worktree on branch `main` (integration point)
├── agent-1/   # worktree on branch `agent-1` (local-only)
├── agent-2/   # worktree on branch `agent-2` (local-only)
└── ...
```

- Branch name = worktree identity (not a feature name)
- Agent branches are **persistent** and reused across tasks
- Only `main` is pushed; agent branches stay local

## Before starting a new task (inside the agent worktree)

```bash
cd agent-1
git fetch origin
git rebase origin/main
```

→ The agent branch is up to date.

## During the task

Work normally on `agent-1`, commit small and often.

## After the task is done (tests green)

```bash
cd ../main
git pull
git merge --ff-only agent-1
git push
```

`--ff-only` fails if `main` moved forward in the meantime (e.g. because another agent integrated). In that case:

```bash
cd ../agent-1
git fetch origin
git rebase origin/main
# resolve conflicts if needed (see below)
cd ../main
git merge --ff-only agent-1
git push
```

## On a rebase conflict

```bash
git status              # shows affected files
# resolve conflicts manually
git add <resolved-files>
git rebase --continue
```

If needed, `git rebase --abort` and reconsider.

## Create a new agent worktree

```bash
cd main
git worktree add ../agent-2 -b agent-2
```

## Remove an agent worktree (rarely needed)

```bash
cd main
git worktree remove ../agent-2
git branch -D agent-2
```

## Rules of thumb

- **Integrate often** — small diffs, small conflicts
- **Always rebase before starting a task** — otherwise drift accumulates
- **Never push `agent-N`** — only `main` goes to origin
- **Tests must be green** before merging into main
