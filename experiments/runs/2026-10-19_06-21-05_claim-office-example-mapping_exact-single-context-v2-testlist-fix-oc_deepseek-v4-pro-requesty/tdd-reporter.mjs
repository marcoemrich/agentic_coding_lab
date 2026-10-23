// Records one append-only event per test-suite invocation, for measuring TDD
// discipline without workflow markers and without reading the transcript.
//
// Why here and not in the pipeline: every route we had keyed on something the
// workflow has to supply — phase markers, Write/Edit tool calls, or per-cycle
// commits. Each is optional, so each falls silent somewhere: vendored external
// skills carry no markers by policy, a model that edits through the shell makes
// no edit-tool calls, and only the TCR arms commit. The one event no TDD
// workflow can avoid is running the tests, and vitest calls this reporter
// itself — so the record is identical across workflows, harnesses and edit
// mechanisms, and nothing in any workflow has to be touched.
//
// Two hard constraints, both load-bearing:
//
// 1. It writes NOTHING to stdout or stderr. The verification suites start the
//    kata CLI via spawnSync and assert `stderr === ""`; a chatty reporter turns
//    green runs red for a reason unrelated to the agent's code. That exact
//    accident is on record for the pnpm version warning (4 of 40 runs, see
//    CLAUDE.md "Host dependencies").
// 2. It never throws. A reporter that raises takes the whole test run with it,
//    which would look like a workflow failure. Every step is guarded and a
//    failure to record is silently dropped — a missing event is a measurement
//    gap, a broken test run is corrupted data.
//
// The event is deliberately descriptive, not derived: counts, names, and a
// content hash per file. Which discipline metrics get computed from the stream
// is a separate decision, and keeping the raw record lets that change without
// re-running anything.
import { createHash } from "node:crypto";
import { appendFileSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const EVENTS_FILE = "tdd-events.jsonl";
// Hash the sources the agent authors. node_modules and build output would
// dominate the walk and say nothing about the exercise.
const ROOTS = ["src", "test", "tests"];
const SKIP_DIRS = new Set(["node_modules", ".git", "dist", "coverage", "target", ".venv", "__pycache__"]);

function walk(dir, out, base) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;                       // root absent: nothing to record, not an error
  }
  for (const e of entries) {
    if (e.name.startsWith(".") || SKIP_DIRS.has(e.name)) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, out, base);
    else if (e.isFile()) {
      try {
        const buf = readFileSync(p);
        out[relative(base, p).split(sep).join("/")] = {
          sha256: createHash("sha256").update(buf).digest("hex").slice(0, 16),
          bytes: buf.length,
          lines: buf.toString("utf8").split("\n").length,
        };
      } catch { /* unreadable mid-write: skip this file, keep the event */ }
    }
  }
  return out;
}

function snapshotTree(cwd) {
  const tree = {};
  for (const r of ROOTS) {
    try {
      if (statSync(join(cwd, r)).isDirectory()) walk(join(cwd, r), tree, cwd);
    } catch { /* root does not exist */ }
  }
  return tree;
}

// vitest nests suites arbitrarily deep; flatten to leaf tests with their full
// path so a test keeps its identity across runs even when suites are renamed.
function collectTests(tasks, prefix, acc) {
  for (const t of tasks || []) {
    const name = prefix ? `${prefix} > ${t.name}` : t.name;
    if (t.type === "suite") {
      collectTests(t.tasks, name, acc);
      continue;
    }
    // `mode` before `result`: a test declared `it.todo` or `it.skip` carries no
    // result at all, so reading only result.state filed it as "unknown" — it
    // counted towards `total` but towards no bucket. A test-list workflow
    // declares its whole list up front and activates one entry per cycle, so
    // that made every invocation look like it had tests that failed to run.
    const mode = t.mode === "todo" || t.mode === "skip" ? "skip" : null;
    acc.push({ name, state: mode ?? t.result?.state ?? "unknown" });
  }
  return acc;
}

function nextSeq(cwd) {
  try {
    const raw = readFileSync(join(cwd, EVENTS_FILE), "utf8");
    return raw.split("\n").filter(Boolean).length + 1;
  } catch {
    return 1;
  }
}

export default class TddEventReporter {
  onInit(ctx) {
    this.cwd = ctx?.config?.root || process.cwd();
    this.startedAt = Date.now();
  }

  onFinished(files, errors) {
    try {
      // The stream must contain the agent's test runs and nothing else. The
      // analysis pipeline runs the suite again (analyze-run.sh) and mutation
      // testing runs it once per mutant — hundreds of invocations that would
      // swamp the record and make the phase chain describe our tooling instead
      // of the exercise. Those callers set TDD_REPORTER_OFF.
      if (process.env.TDD_REPORTER_OFF) return;
      const cwd = this.cwd || process.cwd();
      const tests = [];
      for (const f of files || []) collectTests(f.tasks, f.name, tests);

      const passed = tests.filter((t) => t.state === "pass").length;
      const failed = tests.filter((t) => t.state === "fail").length;
      const skipped = tests.filter((t) => t.state === "skip" || t.state === "todo").length;

      // A file can fail without any single test failing, and in two ways that
      // both matter. It may report no tasks at all (nothing could be
      // collected), or it may declare its tasks and run none of them — the
      // case when the module under test does not exist yet, so the import
      // throws and every `it` stays resultless. The second shape is the one a
      // test-list workflow produces on its very first invocation: ten tests
      // collected, none executed. Counting only the first shape made that read
      // as a clean green and turned the whole opening of the run into noise.
      const filesFailed = (files || []).filter(
        (f) => f.result?.state === "fail",
      ).length;
      const collectionErrors = (errors || []).length + (files || []).filter(
        (f) => f.result?.state === "fail" && collectTests(f.tasks, "", []).length === 0,
      ).length;

      appendFileSync(
        join(cwd, EVENTS_FILE),
        JSON.stringify({
          seq: nextSeq(cwd),
          ts: new Date().toISOString(),
          // The single unambiguous observation. Everything else is descriptive
          // so the derived metrics stay a separate, revisable decision.
          // Derived here for convenience; tdd-report.py recomputes it from
          // the counts below so a fix to this rule reaches existing streams.
          // Tests declared but none executed is not a pass.
          suite_failed: failed > 0 || collectionErrors > 0 || filesFailed > 0
            || (tests.length > 0 && passed + failed === 0),
          tests: { passed, failed, skipped, total: tests.length },
          collection_errors: collectionErrors,
          files_failed: filesFailed,
          failed_tests: tests.filter((t) => t.state === "fail").map((t) => t.name),
          passed_tests: tests.filter((t) => t.state === "pass").map((t) => t.name),
          duration_ms: this.startedAt ? Date.now() - this.startedAt : null,
          tree: snapshotTree(cwd),
        }) + "\n",
        "utf8",
      );
    } catch {
      // Recording failed. Losing one event is acceptable; failing the run is not.
    }
  }
}
