# Python test infrastructure

Status: open
Source: [site data export mapping](2026-10-11_05_site-data-export.md), 2026-10-12.
Blocks: [site data export](2026-10-11_05_site-data-export.md), [build command](2026-10-12_04_build-command.md).

## Story

The site data export and the build command are implemented with the `exact-coding` skill, whose `python-pytest` stack profile expects a `pyproject.toml`, a `tests/` directory and ruff as the smell gate. `experiments/` has none of these: no test configuration, no tests, and ruff is not installed on the host. Most scripts there are named with hyphens (`aggregate-by-query.py`), so tests cannot import them by module name; eight scripts already load their neighbours through `importlib`. Set up the minimum the stack profile needs — test configuration, a shared loader for hyphenated scripts, the pandas dependencies in an environment the tests run in, and ruff — without renaming the scripts.

## Example Mapping

Pending interview with the domain expert. Rules, concrete input/output examples, boundary cases and open questions have not yet been mapped.
