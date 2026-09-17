# research/questions-pi/

Research questions that have pi workflows (suffix `-pi`) as their subject.

Convention:
- RQ dirs as `<chapter>-<slug>/` (e.g. `1.1-model-quality-pi/`).
- The frontmatter `id:` is the stable identity (e.g. `RQ-model-quality-pi`).
- Workflow values are pi workflows (`exact-hybrid-v4-cleaned-pi`, …) — identifiable by the `.pi/` directory in `experiments/workflows/<name>/`.
- Models: lab variant IDs for Requesty-routed pi models. pi routes via **Requesty** (`provider=requesty`, `api:"openai-completions"`, Bearer auth), not via Portkey (OpenCode) or the Direct API (Claude Code). Provider config: `experiments/docker/pi-config/agent/models.json`.

Cross-harness RQs (Claude vs OpenCode vs pi) live under `../questions-cross/`.

## Harness status (walking skeleton)

The pi harness in `experiments/docker/run-batch.sh` is still in a walking-skeleton state: the lab-variant→pi-model mapping table (branch `harness = pi`) so far knows **only** `opus-4-7-portkey[-no-thinking]` (→ `requesty/bedrock/claude-opus-4-7@eu-west-1`). All further models from `pi-config/agent/models.json` (GPT-5.x via Azure, kimi-k2.x, glm-5.x, minimax, deepseek-v4, gemini via Vertex, Mistral, Nebius Qwen/Llama) are **configured as routable, but not yet wired up as lab variants**.

The RQs in this folder are therefore **open** for now (n=0 for all non-Opus cells): they declare the target model matrix, but fill runs for new models first need a mapping entry in `run-batch.sh`. The procedure is exactly as it was for `questions-opencode/` at its beginning — the RQ schema is in place, runs follow cell by cell once the routing is wired up.
