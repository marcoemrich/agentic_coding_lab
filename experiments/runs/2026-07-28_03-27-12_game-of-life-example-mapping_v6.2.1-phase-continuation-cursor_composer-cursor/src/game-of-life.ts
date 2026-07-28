export type Cell = [number, number];

function cellKey(x: number, y: number): string {
  return `${x},${y}`;
}

function parseCellKey(key: string): Cell {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
}

function countNeighbors(
  x: number,
  y: number,
  liveSet: Set<string>,
): number {
  let count = 0;
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      if (liveSet.has(cellKey(x + dx, y + dy))) count++;
    }
  }
  return count;
}

export function nextGeneration(liveCells: Cell[]): Cell[] {
  if (liveCells.length === 0) {
    return [];
  }

  const liveSet = new Set(liveCells.map(([x, y]) => cellKey(x, y)));
  const candidates = new Set<string>();

  for (const [x, y] of liveCells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        candidates.add(cellKey(x + dx, y + dy));
      }
    }
  }

  const next: Cell[] = [];
  for (const key of candidates) {
    const [x, y] = parseCellKey(key);
    const neighborCount = countNeighbors(x, y, liveSet);
    const isLive = liveSet.has(key);

    if (neighborCount === 3 || (isLive && neighborCount === 2)) {
      next.push([x, y]);
    }
  }

  return next;
}
