<!--
Vendored from Matt Pocock's skills collection — https://github.com/mattpocock/skills
Path: skills/engineering/tdd/  ·  License: MIT (see ../../../LICENSE.upstream)
Retrieved: 2026-05-26. Snapshot of the skill as of that date; upstream has since evolved.
Included unmodified as an external comparison baseline for RQ-pocock-vs-v62.
Not authored by this project.
-->

# Deep Modules

From "A Philosophy of Software Design":

**Deep module** = small interface + lots of implementation

```
┌─────────────────────┐
│   Small Interface   │  ← Few methods, simple params
├─────────────────────┤
│                     │
│                     │
│  Deep Implementation│  ← Complex logic hidden
│                     │
│                     │
└─────────────────────┘
```

**Shallow module** = large interface + little implementation (avoid)

```
┌─────────────────────────────────┐
│       Large Interface           │  ← Many methods, complex params
├─────────────────────────────────┤
│  Thin Implementation            │  ← Just passes through
└─────────────────────────────────┘
```

When designing interfaces, ask:

- Can I reduce the number of methods?
- Can I simplify the parameters?
- Can I hide more complexity inside?
