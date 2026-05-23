export type Cell = [number, number];

const cellKey = (x: number, y: number): string => `${x},${y}`;

const parseKey = (key: string): Cell => {
  const [x, y] = key.split(",");
  return [Number(x), Number(y)];
};

function countNeighbors(cells: Cell[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const key = cellKey(x + dx, y + dy);
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
    }
  }
  return counts;
}

function survivesOrIsBorn(neighbors: number, isAlive: boolean): boolean {
  return neighbors === 3 || (neighbors === 2 && isAlive);
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const aliveKeys = new Set(cells.map(([x, y]) => cellKey(x, y)));
  const neighborCounts = countNeighbors(cells);

  const next: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (survivesOrIsBorn(count, aliveKeys.has(key))) {
      next.push(parseKey(key));
    }
  }
  return next;
}
