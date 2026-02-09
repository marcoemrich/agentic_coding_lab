# TDD Experiment Docker Image
# Provides isolated, reproducible environment for TDD workflow experiments

FROM node:22-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    jq \
    bash \
    && rm -rf /var/lib/apt/lists/*

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install Claude Code CLI
RUN npm install -g @anthropic-ai/claude-code

# Create experiment user (non-root for safety)
RUN useradd -m -s /bin/bash experimenter
USER experimenter
WORKDIR /home/experimenter

# Create directory structure
RUN mkdir -p \
    /home/experimenter/experiments/katas \
    /home/experimenter/experiments/workflows \
    /home/experimenter/experiments/runs \
    /home/experimenter/.claude

# Pre-cache common dependencies
# Create a temp project to install vitest/typescript
WORKDIR /tmp/cache
COPY --chown=experimenter:experimenter package.cache.json ./package.json
RUN pnpm install --silent 2>/dev/null || true
WORKDIR /home/experimenter

# Set environment variables
ENV NODE_ENV=production
ENV PNPM_HOME=/home/experimenter/.local/share/pnpm
ENV PATH="$PNPM_HOME:$PATH"

# Default command
CMD ["bash"]
