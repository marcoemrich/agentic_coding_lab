# TDD Experiment Docker Image
# Provides isolated, reproducible environment for TDD workflow experiments

FROM node:22-slim

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    curl \
    jq \
    bash \
    python3 \
    gawk \
    && rm -rf /var/lib/apt/lists/*

# Install pnpm
RUN npm install -g pnpm@9.15.9

# Install Claude Code CLI
# 2.1.107: verified end-to-end, but sends thinking.type.enabled which
#   Vertex-AI Opus 4.7 rejects (needs thinking.type.adaptive).
# 2.1.146: upgrade candidate to fix Opus 4.7 Vertex thinking support.
# 2.1.156: required for Opus 4.8 (absent in 2.1.107/2.1.146); verified
#   end-to-end on 2026-05-29 via RQ-model-novel (opus-4-8 native × v4,
#   5/5 runs OK, verification_pct 0.80–1.00).
# 2.1.170: required for Fable 5 (absent in 2.1.156); verified end-to-end on
#   2026-06-09 via fable5-smoke (opus-4-8-no-thinking marker regression OK:
#   cycle 8 / refactor 8 / pred 16-16; fable-5-no-thinking native-OAuth route
#   OK: cycle 9 / refactor 4 / pred 18-18, tests 9-9, verification_pct 1.00).
# Known bad: 2.1.37 (hangs on .claude/agents/), 2.1.126 (needs ~/.claude.json).
RUN npm install -g @anthropic-ai/claude-code@2.1.170

# Install OpenCode CLI (second harness).
# 1.15.10: verified end-to-end on 2026-05-25 with v1-oneshot-oc +
#   claim-office-prose + opus-4-7-portkey (via Portkey-Vertex routing).
# Bump policy: same as Claude Code — re-run skeleton plan after any
# version bump before launching multi-cell batches.
RUN npm install -g opencode-ai@1.15.10

# Install pi CLI (third harness).
# 0.75.5: verified locally on 2026-05-26 against Portkey-Vertex-EU /
#   Opus 4.7 via api:"openai-completions" + x-portkey-api-key header.
#   `anthropic-messages` api type 404s on /v1/messages — must stay openai-completions.
# Bump policy: same as the others — verify v1-oneshot-pi smoke before
# launching multi-cell batches.
RUN npm install -g --ignore-scripts @earendil-works/pi-coding-agent@0.75.5

# Stryker (mutation testing): NOT installed globally. Stryker's TS-config
# preprocessor resolves `typescript` from where stryker itself is loaded,
# so a global install + per-run typescript devDep produces ERR_MODULE_NOT_FOUND.
# Instead, compute-mutation-score.py adds Stryker as a per-run devDep on
# demand. The pinned versions are pre-cached via package.cache.json into
# the shared pnpm store, so the install is offline-cache-hit and cheap.

# Reuse existing node user (UID 1000) - rename and adjust if needed
# This avoids conflicts with node:22-slim's built-in user
RUN usermod -l experimenter -d /home/experimenter -m node \
    && groupmod -n experimenter node

# Create directory structure (incl. the pnpm store path, so the named
# volume mount inherits experimenter ownership instead of root)
RUN mkdir -p \
    /home/experimenter/experiments/katas \
    /home/experimenter/experiments/workflows \
    /home/experimenter/experiments/runs \
    /home/experimenter/.claude \
    /home/experimenter/.anthropic \
    /home/experimenter/.local/share/pnpm/store \
    && chown -R experimenter:experimenter /home/experimenter

# Provision an empty Claude config file. The CLI 2.1.107 logs a noisy
# "Claude configuration file not found at: /home/experimenter/.claude.json"
# warning multiple times per run if this is missing (once per subagent
# spawn, so v4-exact-subagents floods the log). It otherwise functions
# fine, but the warning crowds out the real output. An empty JSON is
# sufficient — the CLI fills in its own fields on first use.
RUN echo '{}' > /home/experimenter/.claude.json \
    && chown experimenter:experimenter /home/experimenter/.claude.json

# Switch to non-root user
USER experimenter
WORKDIR /home/experimenter

# Set environment variables
ENV NODE_ENV=production
ENV PNPM_HOME=/home/experimenter/.local/share/pnpm
ENV PATH="$PNPM_HOME:$PATH"

# Pre-cache common dependencies into the default pnpm store
# (/home/experimenter/.local/share/pnpm/store). At runtime this path is
# backed by a docker volume so subsequent runs resolve from the store
# instead of refetching from the network.
WORKDIR /tmp/cache
COPY --chown=experimenter:experimenter package.cache.json ./package.json
RUN pnpm install --silent 2>/dev/null || true
WORKDIR /home/experimenter/experiments

# Default command
CMD ["bash"]
