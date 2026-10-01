# Findings — RQ-4.13: Five TDD Workflows Compared (opus-5.5)

No runs yet. 24 of 25 replicates outstanding; see
[README.md](README.md) § "Design" for the inventory and the fill plan.

All figures here will be `claim-office-example-mapping` × `opus-5-5-no-thinking`
× Claude Code 2.1.280. The three vendor workflows are snapshots at the commits
named in the README; every statement will describe those snapshots, not the
tools in general.

## Overview

Primary outcome is Correctness (external); TDD discipline comes from the phase
chain and is comparable across all five cells; the decomposition metrics follow
the binding quality metric from RQ-architecture-axis-opus5 F-1.6.

_Table follows the first aggregation._

> Two reminders for whoever writes this table. Quality and cost trophies are
> gated on `verification_pct = 1.0`, and `refactor_per_cycle` and `green_attempts`
> are ambivalent and take no trophy at all. Every cell holds one population —
> six pre-reporter runs were archived out of the pool so that no column mixes
> runs with and without a discipline measurement.
