"""Classify TDD rigour per run from the tool sequence.

Beyond "did a test come first", check the three things that separate real TDD
from test-first-shaped work:
  1. red verified   — was there a test run between writing a test and writing impl?
  2. increments     — how many test-write blocks (1 = big bang, >1 = incremental)
  3. test count     — how many test cases in the first test block vs. total

Reads only the tool sequence from the transcript — no workflow markers required.
That makes it usable on vendored external workflows that must stay unmodified
(see research/external-tdd-workflows.md).

Examples:
  # every run in experiments/runs, to stdout
  ./measure-tdd-rigour.py

  # two workflows on one kata, into a file
  ./measure-tdd-rigour.py rigour.json \\
      --workflow v9-pocock-tdd v6.2-with-why-cleaned \\
      --kata-suffix example-mapping
"""
import argparse,json,re,sys
from pathlib import Path
TEST=re.compile(r"\.(spec|test)\.(ts|tsx|js|jsx|mjs|cjs)$",re.I)
SKIP=re.compile(r"(experiment-done|package\.json|tsconfig|eslint|vitest\.config|pnpm-lock)",re.I)
CASE=re.compile(r"\b(it|test)\s*\(", re.M)
# Test-runner invocations. Covers the pnpm default plus npm/yarn/bun and direct
# vitest/jest calls — an external skill may prescribe a different runner than the
# kata does (the Superpowers skill says `npm test`, our katas use pnpm).
TEST_RUN=re.compile(
    r"\b(?:pnpm|npm|yarn|bun)\s+(?:run\s+)?test\b"   # pnpm test, npm run test, ...
    r"|\bnpx\s+(?:vitest|jest)\b"                    # npx vitest
    r"|(?:^|[;&|]\s*)(?:vitest|jest)(?![\w.-])",     # bare vitest/jest as a command
    re.I|re.M)

def seq_cc(run):
    for line in open(run/"transcript.jsonl"):
        try: d=json.loads(line)
        except Exception: continue
        if d.get("type")!="assistant": continue
        for b in (d.get("message") or {}).get("content") or []:
            if b.get("type")!="tool_use": continue
            n,i=b.get("name"),b.get("input") or {}
            if n=="Bash":
                c=i.get("command") or ""
                if TEST_RUN.search(c): yield ("test_run","","")
            elif n in ("Write","Edit","MultiEdit"):
                p=i.get("file_path") or ""
                if not p or SKIP.search(p): continue
                # `edits` is a list of dicts in the documented shape, but some
                # harness versions emit plain strings — guard, don't crash.
                content=(i.get("content") or i.get("new_string") or " ".join(
                    (e.get("new_string") or e.get("newText") or "")
                    for e in (i.get("edits") or []) if isinstance(e,dict)))
                if TEST.search(p): yield ("test",p,content)
                elif "/src/" in p or p.startswith("src/"): yield ("impl",p,content)

def seq_pi(run):
    for line in open(run/"transcript-pi.jsonl"):
        try: d=json.loads(line)
        except Exception: continue
        if d.get("type")!="tool_execution_start": continue
        n=d.get("toolName"); a=d.get("args") or {}
        if n=="bash":
            c=a.get("command") or ""
            if TEST_RUN.search(c): yield ("test_run","","")
        elif n in ("write","edit"):
            p=a.get("path") or ""
            if not p or SKIP.search(p): continue
            content=a.get("content") or " ".join(
                (e.get("newText") or "")
                for e in (a.get("edits") or []) if isinstance(e,dict))
            if TEST.search(p): yield ("test",p,content)
            elif p.startswith("src/") or "/src/" in p: yield ("impl",p,content)

def analyse(run):
    gen = seq_pi if (run/"transcript-pi.jsonl").exists() else seq_cc
    try: ev=list(gen(run))
    except OSError: return None   # aborted run, no transcript — skip, don't abort the batch
    if not ev: return None
    # collapse into blocks of consecutive same-kind edits
    blocks=[]
    for k,p,c in ev:
        if k=="test_run":
            blocks.append(("run",None)); continue
        if blocks and blocks[-1][0]==k: blocks[-1][1].append(c)
        else: blocks.append((k,[c]))
    test_blocks=[b for b in blocks if b[0]=="test"]
    # red verified: for each test-block followed (eventually) by impl, was there
    # a run in between?
    verified=unverified=0
    for i,(k,_) in enumerate(blocks):
        if k!="test": continue
        nxt=None
        for j in range(i+1,len(blocks)):
            if blocks[j][0] in ("impl","run"): nxt=blocks[j][0]; break
        if nxt=="run": verified+=1
        elif nxt=="impl": unverified+=1
    # cases in first test block vs all
    first_cases=len(CASE.findall(" ".join(test_blocks[0][1]))) if test_blocks else 0
    all_cases=len(CASE.findall(" ".join(c for b in test_blocks for c in b[1])))
    return dict(test_blocks=len(test_blocks), verified=verified,
                unverified=unverified, first_cases=first_cases, all_cases=all_cases)

def main():
    ap=argparse.ArgumentParser(description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("out",nargs="?",default=None,
        help="output JSON file (default: stdout)")
    ap.add_argument("--runs-dir",type=Path,default=Path(__file__).resolve().parent/"runs",
        help="directory holding the run folders (default: experiments/runs next to this script)")
    ap.add_argument("--pattern",default="*",
        help="glob over run directory names (default: all)")
    ap.add_argument("--workflow",nargs="*",default=None,
        help="keep only these workflows, matched against metrics.json (default: all)")
    ap.add_argument("--kata-suffix",default="",
        help="keep only katas ending in this suffix, e.g. example-mapping (default: all)")
    ap.add_argument("--run",type=Path,default=None,
        help="analyse one run directory and print a single JSON object; used by "
             "analyze-run.sh to fold the numbers into metrics.json")
    a=ap.parse_args()

    if a.run:
        # Always emit an object, even for an unparsable run — analyze-run.sh
        # pipes this straight into jq, which must not choke on empty output.
        json.dump(analyse(a.run) or {}, sys.stdout); print()
        return

    if not a.runs_dir.is_dir():
        sys.exit(f"runs dir not found: {a.runs_dir}")
    wanted=set(a.workflow) if a.workflow else None
    out=[]
    skipped_no_events=skipped_broken=0
    for run in sorted(a.runs_dir.glob(a.pattern)):
        mj=run/"metrics.json"
        if not mj.exists(): continue
        m=json.loads(mj.read_text())
        kata=str(m.get("kata",""))
        if a.kata_suffix and not kata.endswith(a.kata_suffix): continue
        wf=m.get("workflow")
        if wanted is not None and wf not in wanted: continue
        try: r=analyse(run)
        except Exception as exc:   # one malformed transcript must not kill the batch
            print(f"skipping {run.name}: {type(exc).__name__}: {exc}", file=sys.stderr)
            skipped_broken+=1
            continue
        if not r:
            skipped_no_events+=1
            continue
        r.update(run=run.name, workflow=wf, model=m.get("model"),
                 kata=kata.split("-example")[0])
        out.append(r)

    json.dump(out, open(a.out,"w") if a.out else sys.stdout, indent=1)
    if not a.out:
        print()
        sys.stdout.flush()   # otherwise the stderr summary interleaves into the JSON
    print(f"analysed: {len(out)} runs", file=sys.stderr)
    if skipped_no_events:
        # No test/impl edits found at all — usually a different harness format
        # (opencode/cursor transcripts are not parsed here) or an aborted run.
        print(f"skipped (no tool events matched): {skipped_no_events}", file=sys.stderr)
    if skipped_broken:
        print(f"skipped (malformed transcript): {skipped_broken}", file=sys.stderr)

if __name__=="__main__":
    main()
