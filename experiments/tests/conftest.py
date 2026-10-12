"""Shared test helpers for the scripts in experiments/.

Most scripts there are named with hyphens (aggregate-by-query.py), so a test
cannot import them by module name. load_script() loads one by file name the way
the scripts already load each other, without renaming anything.
"""
from __future__ import annotations

import importlib.util
import sys
from pathlib import Path

EXPERIMENTS_DIR = Path(__file__).resolve().parent.parent

# Scripts import their stdlib-named neighbours (rq_facts, workflow_paths) by
# module name, relative to their own directory.
sys.path.insert(0, str(EXPERIMENTS_DIR))


def load_script(name: str):
    """Load experiments/<name>.py as a module, e.g. load_script("aggregate-by-query")."""
    path = EXPERIMENTS_DIR / f"{name}.py"
    spec = importlib.util.spec_from_file_location(name.replace("-", "_"), path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module
