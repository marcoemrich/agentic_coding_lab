# Python test infrastructure

Status: done
Source: [site data export mapping](2026-10-11_05_site-data-export.md), 2026-10-12.

## Story

`experiments/` has the minimum the `exact-coding` skill's `python-pytest` profile needs. `experiments/pyproject.toml` declares the runtime dependencies (pandas, PyYAML, tabulate, pinned to the host's system Python 3.10 versions) and pytest and ruff as dev dependencies; uv keeps the lock in `experiments/uv.lock` and the venv in the gitignored `experiments/.venv`. It replaces `experiments/requirements.txt`. Tests live in `experiments/tests/` and run with `cd experiments && uv run pytest`; `load_script()` in `tests/conftest.py` loads hyphenated scripts by file name, so nothing is renamed. ruff uses the lab's Python stack rules and gates only the files a story touches. A first test checks `is_replicate()` and the loader. An aggregation through the uv environment produced the same `runs.csv` and `summary.md` as the system Python.
