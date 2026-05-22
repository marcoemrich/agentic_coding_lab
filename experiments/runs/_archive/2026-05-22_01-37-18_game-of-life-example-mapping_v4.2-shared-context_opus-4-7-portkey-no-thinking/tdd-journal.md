# TDD Journal
1 R | empty input returns empty output | comp:OK | run:OK | -
1 G | return [] | passing:1
2 R | single live cell dies | comp:OK | run:OK | test passed immediately - prior `return []` already covers it; no red achieved
3 R | two adjacent live cells both die | comp:OK | run:OK | test passed immediately - prior `return []` still covers it; no red achieved
4 R | block is a still life | comp:OK | run:OK | -
4 G | if cells.length===4 return cells else [] | passing:4
5 R | dead cell with 3 live neighbours is born (L-shape) | comp:OK | run:OK | -
5 G | implement real GoL: count neighbours via Map, apply survive(2|3)/birth(3) rules | passing:5
6 R | live cell with 4 neighbours dies, corners born | comp:OK | run:OK | test passed immediately - prior general GoL algorithm already covers Rule 3 + corner births; no red achieved
7 R | blinker oscillates vertical to horizontal (negative x) | comp:OK | run:OK | test passed immediately - prior general GoL algorithm handles negative x via Map string keys; no red achieved
8 R | handles negative y (horizontal blinker on y=0) | comp:OK | run:OK | test passed immediately - prior general GoL algorithm handles negative y via Map string keys; no red achieved
8 Refactor | evaluated naming/DRY/mass/elements - no change | tests:8 passing | naming reveals intent (isBirth/survives document Conway rules); functional chain would reduce mass ~5 but lose named-rule clarity (Rule 2 trumps APP); extracting neighboursOf helper used once violates Rule 4 and anticipates future tests; code at local optimum
9 R | works on a sparse infinite grid (block at (100,100)) | comp:OK | run:OK | test passed immediately - prior sparse string-keyed Map algorithm is translation-invariant and has no bounds; no red achieved
