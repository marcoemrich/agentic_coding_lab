# Worktree-Workflow für Agents

Ziel: Mehrere Agents arbeiten parallel auf eigenen Worktrees, integrieren aber häufig nach `main` (Continuous Integration statt langlebige Feature-Branches).

## Struktur

```
agentic_coding_lab_project/
├── main/      # Worktree auf Branch `main` (Integrations-Punkt)
├── agent-1/   # Worktree auf Branch `agent-1` (lokal-only)
├── agent-2/   # Worktree auf Branch `agent-2` (lokal-only)
└── ...
```

- Branch-Name = Worktree-Identität (kein Feature-Name)
- Agent-Branches existieren **dauerhaft** und werden wiederverwendet
- Nur `main` wird gepusht; Agent-Branches sind lokal

## Vor jedem neuen Task (im Agent-Worktree)

```bash
cd agent-1
git fetch origin
git rebase origin/main
```

→ Agent-Branch ist auf neuestem Stand.

## Während des Tasks

Normal auf `agent-1` arbeiten, klein und häufig committen.

## Nach Task-Abschluss (Tests grün)

```bash
cd ../main
git pull
git merge --ff-only agent-1
git push
```

`--ff-only` schlägt fehl, wenn `main` zwischenzeitlich weitergewandert ist (z.B. weil ein anderer Agent integriert hat). Dann:

```bash
cd ../agent-1
git fetch origin
git rebase origin/main
# ggf. Konflikte lösen, siehe unten
cd ../main
git merge --ff-only agent-1
git push
```

## Bei Rebase-Konflikt

```bash
git status              # zeigt betroffene Dateien
# Konflikte manuell lösen
git add <gelöste-dateien>
git rebase --continue
```

Bei Bedarf `git rebase --abort` und überlegen.

## Neuen Agent-Worktree anlegen

```bash
cd main
git worktree add ../agent-2 -b agent-2
```

## Agent-Worktree entfernen (selten nötig)

```bash
cd main
git worktree remove ../agent-2
git branch -D agent-2
```

## Faustregeln

- **Häufig integrieren** — kleine Diffs, kleine Konflikte
- **Vor Task-Start immer rebasen** — sonst wachsen Drifts
- **Nie `agent-N` pushen** — nur `main` geht nach origin
- **Tests müssen grün sein** vor dem Merge nach main
