# Open questions — results site

## Deferred

- **Curation.** Which of the ~74 RQs are of interest? Help wanted: a prepared list of all RQs
  with question, data coverage, `closed` status and age.
- **Workflow-development RQs.** Out of scope for the first step. This also defers the question
  whether they get their own page shape (predecessor vs. successor, "this is what changed")
  and a per-workflow `change:` field to feed it.

## Decided

- **Workflow descriptions, depth.** A short profile per workflow (one or two sentences plus
  traits: architecture subagents/main-context/hybrid, harness, TDD variant, parent). The
  underlying concepts (Predictive TDD, EXACT Coding) get one concept page for outsiders;
  profiles link to it instead of re-explaining.
- **Workflow descriptions, source.** An optional per-workflow `description:` field in
  `LINEAGE.yaml`: outsider prose covering what the workflow is, its arm and what sets it apart.
  Kept separate from the lab-facing `note:`. Structured traits per arm (an `arms:` block) were
  considered and dropped as too complex for a first step.
- **Workflow descriptions, scope.** First step covers only workflows named in the frontmatter
  of a main RQ (`research/questions-*/`): 49 of 90 as of 2026-10-11. The rest — referenced
  only by workflow-dev or kata-dev RQs, or by none — is deferred along with those RQs.
