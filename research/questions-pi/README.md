# research/questions-pi/

Forschungsfragen, die pi-Workflows (Suffix `-pi`) als Subjekt haben.

Konvention:
- RQ-Dirs als `<chapter>-<slug>/` (z.B. `1.1-model-quality-pi/`).
- Frontmatter-`id:` ist die stabile Identität (z.B. `RQ-model-quality-pi`).
- Workflow-Werte sind pi-Workflows (`v6.2-with-why-cleaned-pi`, …) — erkennbar am `.pi/`-Verzeichnis in `experiments/workflows/<name>/`.
- Modelle: Lab-Variant-IDs für Requesty-geroutete pi-Modelle. pi routet über **Requesty** (`provider=requesty`, `api:"openai-completions"`, Bearer-Auth), nicht über Portkey (OpenCode) oder die Direct-API (Claude Code). Provider-Config: `experiments/docker/pi-config/agent/models.json`.

Harness-übergreifende RQs (Claude vs OpenCode vs pi) leben unter `../questions-cross/`.

## Harness-Status (Walking Skeleton)

Der pi-Harness ist in `experiments/docker/run-batch.sh` noch im Walking-Skeleton-Zustand: die Lab-Variant→pi-Modell-Mapping-Tabelle (Branch `harness = pi`) kennt bisher **nur** `opus-4-7-portkey[-no-thinking]` (→ `requesty/bedrock/claude-opus-4-7@eu-west-1`). Alle weiteren Modelle aus `pi-config/agent/models.json` (GPT-5.x via Azure, kimi-k2.x, glm-5.x, minimax, deepseek-v4, gemini via Vertex, Mistral, Nebius-Qwen/Llama) sind **routbar konfiguriert, aber noch nicht als Lab-Variant verdrahtet**.

Die RQs in diesem Ordner sind daher zunächst **offen** (n=0 für alle Nicht-Opus-Zellen): sie deklarieren die Ziel-Modell-Matrix, aber Fill-Runs für neue Modelle brauchen erst einen Mapping-Eintrag in `run-batch.sh`. Vorgehen genau wie bei `questions-opencode/` zu dessen Beginn — RQ-Schema steht, Runs folgen zellweise, sobald das Routing verdrahtet ist.
