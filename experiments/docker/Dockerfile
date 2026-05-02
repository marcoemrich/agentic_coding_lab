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
RUN npm install -g @anthropic-ai/claude-code

# Reuse existing node user (UID 1000) - rename and adjust if needed
# This avoids conflicts with node:22-slim's built-in user
RUN usermod -l experimenter -d /home/experimenter -m node \
    && groupmod -n experimenter node

# Create directory structure
RUN mkdir -p \
    /home/experimenter/experiments/katas \
    /home/experimenter/experiments/workflows \
    /home/experimenter/experiments/runs \
    /home/experimenter/.claude \
    /home/experimenter/.anthropic \
    && chown -R experimenter:experimenter /home/experimenter

# Switch to non-root user
USER experimenter
WORKDIR /home/experimenter

# Pre-cache common dependencies
WORKDIR /tmp/cache
COPY --chown=experimenter:experimenter package.cache.json ./package.json
RUN pnpm install --silent 2>/dev/null || true
WORKDIR /home/experimenter/experiments

# Set environment variables
ENV NODE_ENV=production
ENV PNPM_HOME=/home/experimenter/.local/share/pnpm
ENV PATH="$PNPM_HOME:$PATH"

# Default command
CMD ["bash"]
