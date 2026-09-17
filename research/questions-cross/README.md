# research/questions-cross/

Cross-harness research questions — comparisons between Claude Code and OpenCode.

Convention:
- RQ dirs as `<chapter>-<slug>/` (e.g. `1.1-harness-effect/`).
- The frontmatter `id:` is the stable identity (e.g. `RQ-harness`).
- `factors.workflow` lists workflow pairs from both harnesses (e.g. `[v5-single-context-cc, v5-single-context-oc]`).
- Model routing must be identical across cells so the harness effect is not confounded with routing — typically all cells on a Portkey model (`opus-4-7-portkey`), not Direct API vs Portkey mixed.

Harness-specific RQs (Claude only or OpenCode only) live under `../questions-claude/` and `../questions-opencode/` respectively.
