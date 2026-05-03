export type Cell = readonly [number, number];

const cellKey = (x: number, y: number): string => `${x},${y}`;

const parseKey = (key: string): Cell => {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
};

export function nextGeneration(livingCells: Iterable<Cell>): Cell[] {
  const alive = new Set<string>();
  for (const [x, y] of livingCells) {
    alive.add(cellKey(x, y));
  }

  const neighborCounts = new Map<string, number>();

  for (const key of alive) {
    const [x, y] = parseKey(key);
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const nKey = cellKey(x + dx, y + dy);
        neighborCounts.set(nKey, (neighborCounts.get(nKey) ?? 0) + 1);
      }
    }
  }

  const next: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    const isAlive = alive.has(key);
    if (count === 3 || (count === 2 && isAlive)) {
      next.push(parseKey(key));
    }
  }

  return next;
}
