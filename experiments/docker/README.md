# TDD Experiment Docker Setup

Run TDD workflow experiments in isolated, reproducible Docker containers.

## Prerequisites

- Docker & Docker Compose
- Anthropic API key

## Quick Start

### 1. Setup Environment

```bash
cd experiments/docker

# Copy and edit environment file
cp .env.example .env
# Edit .env with your ANTHROPIC_API_KEY
```

### 2. Build Image

```bash
docker compose build
```

### 3. Run Interactive Experiment

```bash
docker compose run --rm experiment
```

This drops you into the experiment container. From there:

```bash
./record-run.sh
```

### 4. Run Batch Experiments

Run all kata/workflow combinations automatically:

```bash
docker compose --profile batch run --rm batch
```

## Container Details

### Base Image
- `node:22-slim` - Latest Node.js LTS

### Installed Tools
- **Node.js 22** - JavaScript runtime
- **pnpm** - Fast, disk space efficient package manager
- **TypeScript 5.3** - Type checking
- **Vitest 1.0** - Test runner
- **Claude Code CLI** - AI coding assistant
- **jq** - JSON processing
- **git** - Version control

### Resource Limits
- CPU: 2 cores max
- Memory: 4GB max

### Security
- Non-root user (`experimenter`)
- Read-only mounts for katas/workflows
- API key mounted securely

## Directory Structure

```
docker/
├── Dockerfile           # Container image definition
├── docker-compose.yml   # Service orchestration
├── package.cache.json   # Pre-cached dependencies
├── run-batch.sh         # Batch experiment script
├── .env.example         # Environment template
└── README.md            # This file
```

## Volume Mounts

| Host Path | Container Path | Mode |
|-----------|---------------|------|
| `../katas` | `/home/experimenter/experiments/katas` | ro |
| `../workflows` | `/home/experimenter/experiments/workflows` | ro |
| `../runs` | `/home/experimenter/experiments/runs` | rw |
| `~/.anthropic/api_key` | `/home/experimenter/.anthropic/api_key` | ro |
| `~/.claude` | `/home/experimenter/.claude` | rw |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `ANTHROPIC_API_KEY` | API key for Claude | (required) |
| `ANTHROPIC_API_KEY_FILE` | Path to file with API key | `~/.anthropic/api_key` |
| `CLAUDE_MODEL` | Model to use | `claude-opus-4-6` |
| `CLAUDE_CONFIG_DIR` | Claude config directory | `~/.claude` |

## Batch Mode

The batch runner executes all combinations of katas and workflows:

```
katas × workflows = experiments
  2   ×     3     = 6 runs
```

Each run:
1. Creates isolated run directory
2. Copies workflow rules
3. Installs dependencies
4. Runs Claude with 30-minute timeout
5. Records metrics and output

Results are saved to `../runs/`.

## Customization

### Add New Kata

Create `../katas/my-kata/prompt.md`:

```markdown
# My Kata

Implement [feature] using TDD.

## Requirements
- [requirement 1]
- [requirement 2]
```

### Add New Workflow

Create `../workflows/my-workflow/.claude/` with:
- `rules/` - TDD rules
- `agents/` or `commands/` - Phase implementations
- `settings.json` - Permissions

## Troubleshooting

### API Key Issues

```bash
# Verify key is mounted
docker compose run --rm experiment cat /home/experimenter/.anthropic/api_key
```

### Permission Errors

```bash
# Fix runs directory permissions
sudo chown -R $(id -u):$(id -g) ../runs
```

### Memory Issues

Increase limits in `docker-compose.yml`:

```yaml
deploy:
  resources:
    limits:
      memory: 8G
```

## Cleanup

```bash
# Remove containers
docker compose down

# Remove image
docker compose down --rmi local

# Remove all runs
rm -rf ../runs/*
```
