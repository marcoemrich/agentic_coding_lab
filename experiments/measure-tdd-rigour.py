"""Classify TDD rigour per run from the tool sequence.

Beyond "did a test come first", check the three things that separate real TDD
from test-first-shaped work:
  1. red verified   — was there a test run between writing a test and writing impl?
  2. increments     — how many test-write blocks (1 = big bang, >1 = incremental)
  3. test count     — how many test cases in the first test block vs. total
"""
import json,re,sys
from pathlib import Path
TEST=re.compile(r"\.(spec|test)\.(ts|tsx|js|jsx|mjs|cjs)$",re.I)
SKIP=re.compile(r"(experiment-done|package\.json|tsconfig|eslint|vitest\.config|pnpm-lock)",re.I)
CASE=re.compile(r"\b(it|test)\s*\(", re.M)

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
                if "pnpm test" in c or "pnpm run test" in c: yield ("test_run","","")
            elif n in ("Write","Edit","MultiEdit"):
                p=i.get("file_path") or ""
                if not p or SKIP.search(p): continue
                content=(i.get("content") or i.get("new_string") or " ".join(
                    (e.get("new_string") or e.get("newText") or "")
                    for e in (i.get("edits") or [])))
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
            if "pnpm test" in c or "pnpm run test" in c: yield ("test_run","","")
        elif n in ("write","edit"):
            p=a.get("path") or ""
            if not p or SKIP.search(p): continue
            content=a.get("content") or " ".join(
                (e.get("newText") or "") for e in (a.get("edits") or []))
            if TEST.search(p): yield ("test",p,content)
            elif p.startswith("src/") or "/src/" in p: yield ("impl",p,content)

def analyse(run):
    gen = seq_pi if (run/"transcript-pi.jsonl").exists() else seq_cc
    ev=list(gen(run))
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

if __name__=="__main__":
    import csv
    out=[]
    for run in sorted(Path(".").glob("*_v3-basic-tdd*")):
        mj=run/"metrics.json"
        if not mj.exists(): continue
        m=json.loads(mj.read_text())
        if not str(m.get("kata","")).endswith("example-mapping"): continue
        a=analyse(run)
        if not a: continue
        a.update(run=run.name, model=m.get("model"), kata=str(m.get("kata","")).split("-example")[0])
        out.append(a)
    json.dump(out, open(sys.argv[1] if len(sys.argv)>1 else "/dev/stdout","w"), indent=1)
    print(f"analysiert: {len(out)} Runs", file=sys.stderr)
