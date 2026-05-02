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

# Set your user/group IDs (fixes volume permissions)
echo "USER_ID=$(id -u)" >> .env
echo "GROUP_ID=$(id -g)" >> .env

# Edit .env with your API credentials (direct or Portkey)
```

### 2. Build Image

```bash
docker compose build
```

Or with explicit UID/GID:

```bash
USER_ID=$(id -u) GROUP_ID=$(id -g) docker compose build
```

### 3. Run Interactive Experiment

```bash
docker compose run -it --rm experiment bash
```

This drops you into the experiment container. From there:

```bash
./record-run.sh
```

### 4. Run Batch Experiments

#### Convenience scripts

```bash
# List all available plans with description and run count
./list-plans.sh

# Run a plan (extension and full path optional)
./batch.sh smoke-test
./batch.sh workflow-comparison-string-calculator.json

# Run the full cross-product (no plan)
./batch.sh
```

The two scripts are thin wrappers around the `docker compose` invocations
described below — pick whichever style is more convenient.

#### Option A: Run a specific plan file

Plan files live in `../batch-plans/*.json` and list explicit
`{kata, workflow, model}` triples. Pass the plan name (or absolute path) via
the `BATCH_PLAN` env var:

```bash
# Single smoke run to verify the pipeline
BATCH_PLAN=smoke-test.json docker compose --profile batch run --rm batch

# Compare all 5 workflows on string-calculator with Sonnet 4.6
BATCH_PLAN=workflow-comparison-string-calculator.json \
  docker compose --profile batch run --rm batch
```

The plan is validated fail-fast against available katas, workflows, and the
hard-coded `MODEL_CONFIGS` list — typos abort before any Claude call.

Plan file schema:

```json
{
  "name": "Optional plan name",
  "description": "Optional description",
  "runs": [
    { "kata": "string-calculator-prose", "workflow": "v3-basic-tdd", "model": "sonnet-4-6" }
  ]
}
```

`model` is the model **name** from `MODEL_CONFIGS` in `run-batch.sh`
(e.g. `sonnet-4-6`, `opus-4-7-no-thinking`, `haiku-4-5`), not the full API ID.

#### Option B: Run the full cross-product

Without `BATCH_PLAN`, every enabled kata × workflow × model is executed —
this can be hundreds of runs and will hit Claude Max rate limits.

```bash
docker compose --profile batch run --rm batch
```

#### Per-run hardening

Each run is wrapped with a 30-minute timeout (override via
`CLAUDE_TIMEOUT_SECONDS=...`). Stdout/stderr is captured to
`runs/<run>/run.log`. If the log mentions a rate limit / 429 / overloaded
state, the batch aborts immediately to avoid burning further requests, and
the partial state is preserved in the run directory. Each `metrics.json`
gets a `run_status` block with `exit_code`, `exit_reason`, and `rate_limited`.

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

### Direct Anthropic API

| Variable | Description | Default |
|----------|-------------|---------|
| `ANTHROPIC_API_KEY` | API key for Claude | (required) |
| `ANTHROPIC_API_KEY_FILE` | Path to file with API key | `~/.anthropic/api_key` |
| `CLAUDE_CONFIG_DIR` | Claude config directory | `~/.claude` |

### Portkey Gateway (or other proxy)

| Variable | Description | Example |
|----------|-------------|---------|
| `ANTHROPIC_BASE_URL` | Proxy URL | `https://api.portkey.ai` |
| `ANTHROPIC_AUTH_TOKEN` | Auth token (can be dummy for Portkey) | `dummy` |
| `ANTHROPIC_CUSTOM_HEADERS` | Custom headers for proxy | `x-portkey-api-key: your-key` |

### Container User (volume permissions)

| Variable | Description | Default |
|----------|-------------|---------|
| `USER_ID` | Container user UID (run `id -u`) | `1000` |
| `GROUP_ID` | Container user GID (run `id -g`) | `1000` |

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

The container user must match your host user. Ensure `USER_ID` and `GROUP_ID` in `.env` match your system:

```bash
# Check your IDs
id -u  # USER_ID
id -g  # GROUP_ID

# Rebuild with correct IDs
docker compose build --no-cache

# Or fix existing runs directory
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
