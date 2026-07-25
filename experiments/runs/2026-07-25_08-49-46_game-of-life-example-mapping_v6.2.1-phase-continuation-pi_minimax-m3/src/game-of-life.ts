export type Cell = [number, number];

const key = (x: number, y: number): string => `${x},${y}`;

const parseKey = (k: string): Cell => {
  const [x, y] = k.split(",").map(Number);
  return [x, y];
};

function countNeighbors(liveCells: Cell[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const [x, y] of liveCells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const k = key(x + dx, y + dy);
        counts.set(k, (counts.get(k) ?? 0) + 1);
      }
    }
  }
  return counts;
}

// Game of Life rule: a cell is alive next generation iff it has exactly 3
// live neighbors, or it was already alive with exactly 2 live neighbors.
const isAliveNext = (count: number, wasAlive: boolean): boolean =>
  count === 3 || (count === 2 && wasAlive);

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const live = new Set(liveCells.map(([x, y]) => key(x, y)));
  const neighborCounts = countNeighbors(liveCells);
  const next: Cell[] = [];
  for (const [k, count] of neighborCounts) {
    if (isAliveNext(count, live.has(k))) {
      next.push(parseKey(k));
    }
  }
  return next;
}
