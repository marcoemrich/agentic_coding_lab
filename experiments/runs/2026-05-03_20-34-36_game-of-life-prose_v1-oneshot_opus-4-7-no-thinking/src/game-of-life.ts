export type Cell = readonly [number, number];

export function nextGeneration(livingCells: Iterable<Cell>): Set<string> {
  const liveSet = new Set<string>();
  for (const [x, y] of livingCells) {
    liveSet.add(key(x, y));
  }

  const neighborCounts = new Map<string, number>();
  for (const cellKey of liveSet) {
    const [x, y] = parseKey(cellKey);
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const nKey = key(x + dx, y + dy);
        neighborCounts.set(nKey, (neighborCounts.get(nKey) ?? 0) + 1);
      }
    }
  }

  const next = new Set<string>();
  for (const [cellKey, count] of neighborCounts) {
    if (count === 3 || (count === 2 && liveSet.has(cellKey))) {
      next.add(cellKey);
    }
  }
  return next;
}

export function nextGenerationCells(livingCells: Iterable<Cell>): Cell[] {
  const result: Cell[] = [];
  for (const k of nextGeneration(livingCells)) {
    result.push(parseKey(k));
  }
  return result;
}

function key(x: number, y: number): string {
  return `${x},${y}`;
}

function parseKey(k: string): Cell {
  const idx = k.indexOf(",");
  return [Number(k.slice(0, idx)), Number(k.slice(idx + 1))];
}
