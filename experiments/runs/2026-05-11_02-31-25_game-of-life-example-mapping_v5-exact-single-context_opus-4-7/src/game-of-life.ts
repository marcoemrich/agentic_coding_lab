export type Cell = [number, number];

const key = (x: number, y: number): string => `${x},${y}`;

const countLiveNeighbors = (x: number, y: number, liveSet: Set<string>): number => {
  let count = 0;
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      if (liveSet.has(key(x + dx, y + dy))) count++;
    }
  }
  return count;
};

export const nextGeneration = (cells: Cell[]): Cell[] => {
  const liveSet = new Set(cells.map(([x, y]) => key(x, y)));
  const candidates = new Map<string, Cell>();

  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const cx = x + dx;
        const cy = y + dy;
        candidates.set(key(cx, cy), [cx, cy]);
      }
    }
  }

  const next: Cell[] = [];
  for (const [k, [x, y]] of candidates) {
    const n = countLiveNeighbors(x, y, liveSet);
    const alive = liveSet.has(k);
    // Conway's rule: alive next gen iff exactly 3 neighbors, or alive with 2.
    if (n === 3 || (alive && n === 2)) {
      next.push([x, y]);
    }
  }
  return next;
};
