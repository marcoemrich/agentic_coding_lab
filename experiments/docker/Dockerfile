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
    && rm -rf /var/lib/apt/lists/*

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install Claude Code CLI
# Pinned to 2.1.107 (mid-April 2026): older versions like 2.1.37 hang
# indefinitely on `--print` runs whose cwd contains a `.claude/agents/`
# directory (v4-exact-subagents workflow). Newer versions (2.1.126) regressed
# and require a `~/.claude.json` config file we do not provision in the
# container. 2.1.107 was verified end-to-end with the v4 workflow on Haiku.
RUN npm install -g @anthropic-ai/claude-code@2.1.107

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
