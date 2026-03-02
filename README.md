# Agentic Coding Lab

A lightweight research framework for systematically comparing agentic coding setups -- models, agent architectures, and prompt strategies -- using reproducible benchmarks.

## Motivation

When working with agentic coding, many practical questions arise: Does a setup with dedicated sub-agents for testing produce cleaner code than a single agent doing everything? Does Sonnet deliver better code quality than Opus on a refactoring task? How do different system prompts affect the outcome? This framework was built to answer such questions with data instead of gut feeling.

## What This Framework Does

The framework runs controlled experiments across three dimensions:

- **Workflow variants** -- from simple one-shot generation ("vibe coding") to structured TDD with specialized agents per phase
- **Model configurations** -- Opus 4.6 vs Sonnet 4.5, with and without extended thinking
- **Coding katas** -- standardized tasks at varying complexity levels (string parsing, state machines, algorithmic patterns)

Each experiment produces measurable metrics: token usage, code complexity (APP mass), test count, TDD cycle discipline, and more.

## Repository Structure

```
.
├── experiments/
│   ├── katas/                # Coding exercises (problem definitions)
│   ├── workflows/            # 5 workflow variants (v1-v5)
│   ├── runs/                 # Recorded experiment results (249 runs)
│   ├── docker/               # Containerized execution
│   ├── record-run.sh         # Run an experiment
│   └── analyze-run.sh        # Analyze and compare results
├── reference/                # Reference configurations
├── HUMAN-IN-THE-LOOP.md      # Optional HITL checkpoint guide
├── SECURITY-AUDIT.md         # Pre-publication security audit
└── todos_and_ideas.txt       # Future research directions
```

## The Five Workflow Variants

| Variant | Approach | Description |
|---------|----------|-------------|
| **v1-oneshot** | No TDD | Direct implementation in one shot ("vibe coding" baseline) |
| **v2-iterative** | No TDD | Iterative prompting with plan/checklist |
| **v3-basic-tdd** | Minimal TDD | Just "use TDD" -- no detailed rules |
| **v4-exact-subagents** | Structured TDD | Each TDD phase (red/green/refactor) runs in a separate, isolated agent |
| **v5-exact-single-context** | Structured TDD | All TDD phases run in one continuous context using inline skills |

## Quick Start

### Prerequisites

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI installed
- Anthropic API key (or compatible provider)

### Run an Experiment Locally

```bash
cd experiments
./record-run.sh
```

This interactively prompts you to select a kata and workflow, then launches Claude Code to execute the task. Results are saved to `experiments/runs/`.

### Run via Docker

```bash
cd experiments/docker
cp .env.example .env          # Add your API key
docker compose build
docker compose run -it experiment bash
./record-run.sh               # Interactive mode
```

For batch execution of all kata/workflow combinations:

```bash
docker compose --profile batch run batch
```

### Analyze Results

```bash
cd experiments
./analyze-run.sh              # Compare runs, generate metrics
```

## Key Metrics

Each run is evaluated on:

- **Duration** -- wall-clock time for the complete task
- **Tests** -- number of test cases written
- **APP Mass** -- code complexity score (lower = simpler, more maintainable)
- **Tokens** -- total token consumption
- **TDD Cycles** -- number of red-green-refactor cycles completed
- **Prediction Accuracy** -- correctness of red-phase failure predictions
- **Refactorings** -- number of refactoring improvements applied

## Further Documentation

| Document | Description |
|----------|-------------|
| [experiments/README.md](experiments/README.md) | Detailed experiment framework docs, metrics definitions, research design |
| [experiments/docker/README.md](experiments/docker/README.md) | Docker setup and batch execution guide |
| [HUMAN-IN-THE-LOOP.md](HUMAN-IN-THE-LOOP.md) | How to re-enable human approval checkpoints between TDD phases |
| [SECURITY-AUDIT.md](SECURITY-AUDIT.md) | Pre-publication security verification |

## License

This project is provided as-is for research and educational purposes.
