<!--
Substituted for {{MEASUREMENTS}} in README.template.md and reused in the
snapshot-level README. Numbers are model- and data-specific: re-check every
value against the cited RQs before each export, and update the model named
in each subsection. Sources as of 2026-09-13:
  - three-way + end-refactor control (Opus 4.7): RQ-tdd-quality (4.1) overview + F-tdd-quality.5/.6
  - Opus 5 comparison: runs pool, baseline-inline-tdd-v1-cc vs exact-hybrid-v2-testlist-fix-cc,
    opus-5-no-thinking (RQ-architecture-axis-opus5 runs.csv for avg LoC/function)
  - prose vs examples: exact-hybrid-v6-lab-split-cc on opus-5-no-thinking; RQ-prompt-correctness (1.1)
  - vibe/TDD on prose: F-tdd-quality.8
Delete this comment when substituting.
-->
We did not pick this workflow on gut feeling. We ran AI agents on the same
programming tasks many times, without anyone intervening, and measured the
resulting code. Two tasks:

- **Game of Life**: a well-known exercise. Models have seen it many times
  during training.
- **Claim Office**: an insurance-claims command-line tool we wrote ourselves,
  so the model cannot know it. Its spec contains deliberate ambiguities.
  Correctness is checked by 15 acceptance scenarios the agent never sees.

### "Just use TDD" vs. this workflow

- **"Just use TDD":** the agent is told to use TDD, with no further structure.
- **This workflow:** Test List, then Red → Green → Refactor with an isolated refactor step every cycle.

**Model: Claude Opus 4.7**, 5–10 runs per cell. Lower is better.

| What we measured | "Just use TDD" | **This workflow** |
|---|---:|---:|
| **Game of Life** (known task) | | |
| Complexity of the hardest function¹ | 22 | **6.5** |
| Longest function (lines) | 33 | **14** |
| Code smells found by the linter | 6 | **2.4** |
| Tokens used | 0.8 M | 6.9 M |
| Time per task | 1 min | 8 min |
| **Claim Office** (unknown task) | | |
| Complexity of the hardest function¹ | 20 | **5.7** |
| Longest function (lines) | 52 | **18** |
| Code smells found by the linter | 17 | **1.3** |
| Tokens used | 3.3 M | 35 M |
| Time per task | 5 min | 26 min |

¹ *Cognitive complexity (SonarJS): roughly, how hard a function is to read.*

- **"Just use TDD" is not enough.** Without structure, the agent writes long,
  deeply branched functions.
- **The enforced refactor step makes the difference.** It cuts the most complex
  function to about a third and removes most linter findings.
- **It costs tokens and time:** on Game of Life about 9× the tokens and 7× the
  time, on Claim Office about 10× the tokens and 5× the time.

### Why refactor after every step, not once at the end?

An obvious shortcut: let the agent write the code, add tests afterwards, and
clean up once when it is done. Same model (Opus 4.7), 5–7 runs per cell:

| What we measured | Code first, tests after, one cleanup at the end | **This workflow** |
|---|---:|---:|
| **Game of Life:** complexity of the hardest function¹ | 10.6 | **6.5** |
| **Game of Life:** longest function (lines) | 18 | **14** |
| **Claim Office:** complexity of the hardest function¹ | 7.4 | **5.7** |
| **Claim Office:** longest function (lines) | 28 | **18** |
| **Claim Office:** code smells found by the linter | 4.0 | **1.3** |
| **Claim Office:** hidden acceptance scenarios passed | 100 % | 100 % |
| **Claim Office:** tokens used | 2 M | 35 M |

Both get the task right. Cleaning up once at the end smooths the surface;
refactoring after every step breaks functions apart while they are still small.

### On the newest model: the gap narrows, but it stays

**Model: Claude Opus 5** (the model this version was validated on). 6 runs per
cell, this workflow on Claim Office 18 runs.

**Game of Life** (known task):

| What we measured | "Just use TDD" | **This workflow** |
|---|---:|---:|
| Hidden acceptance scenarios passed | 100 % | 100 % |
| Complexity of the hardest function¹ | 7.2 | **1.8** |
| Average function length (lines) | 6.5 | **4.2** |
| Longest function (lines) | 15 | **10** |
| Tokens used | 2.1 M | 7.4 M |
| Time per task | 3 min | 10 min |

**Claim Office** (unknown task):

| What we measured | "Just use TDD" | **This workflow** |
|---|---:|---:|
| Hidden acceptance scenarios passed | 100 % | 96 % |
| Complexity of the hardest function¹ | 5.3 | **2.8** |
| Average function length (lines) | 8.9 | **3.8** |
| Longest function (lines) | 24 | **16** |
| Tokens used | 4.5 M | 84 M |
| Time per task | 5.5 min | 44 min |

- **The newer model writes much cleaner code on its own**, even with plain "use TDD".
- **This workflow still clearly lowers complexity and function length** on both
  tasks, and the ranges barely overlap, so this is not noise.
- **The cost depends heavily on the task:** on Game of Life about 3.5× the tokens
  and 3.5× the time, on Claim Office about 19× the tokens and 8× the time.
- **The 96 % comes from one scenario** that trips every structured workflow on
  this model. It is not a general correctness penalty.

### Concrete examples matter more than any workflow

For getting the task *right*, it hardly matters whether the tests come before
or after the code. What matters is whether the spec contains concrete examples:

| Task | Spec as prose | Spec as examples |
|---|---:|---:|
| Claim Office | 27 % | **94 %** |
| Sphinx Score (a second unknown task) | 15 % | **100 %** |

*(Opus 5, measured with a closely related, more elaborate variant of this
workflow. On Opus 4.7, even working test-first from a prose spec reached only
21 %.)*

**Examples make the code correct, the per-step refactor keeps it simple.** That
is why Example Mapping comes first, and why the refactor step sits inside the loop.

### What these numbers do not show

- The agents ran **unattended**. The shipped workflow stops for your approval by
  default, and many misses we saw are the kind a single clarifying question prevents.
- Small, self-contained tasks, **TypeScript only**. No legacy code.
- Results are **per model**. Rankings between workflows have flipped between
  model versions before.
