<!--
Vendored from Matt Pocock's skills collection — https://github.com/mattpocock/skills
Path: skills/engineering/tdd/  ·  License: MIT (see ../../../LICENSE.upstream)
Retrieved: 2026-05-26. Snapshot of the skill as of that date; upstream has since evolved.
Included unmodified as an external comparison baseline for RQ-pocock-vs-v62.
Not authored by this project.
-->

# Refactor Candidates

After TDD cycle, look for:

- **Duplication** → Extract function/class
- **Long methods** → Break into private helpers (keep tests on public interface)
- **Shallow modules** → Combine or deepen
- **Feature envy** → Move logic to where data lives
- **Primitive obsession** → Introduce value objects
- **Existing code** the new code reveals as problematic
