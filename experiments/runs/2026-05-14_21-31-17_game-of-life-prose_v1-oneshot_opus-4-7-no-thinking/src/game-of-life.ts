export type Cell = [number, number];

const key = (x: number, y: number): string => `${x},${y}`;

const parseKey = (k: string): Cell => {
  const [x, y] = k.split(",").map(Number);
  return [x, y];
};

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set<string>();
  for (const [x, y] of cells) {
    living.add(key(x, y));
  }

  const neighborCounts = new Map<string, number>();

  for (const cellKey of living) {
    const [x, y] = parseKey(cellKey);
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const nk = key(x + dx, y + dy);
        neighborCounts.set(nk, (neighborCounts.get(nk) ?? 0) + 1);
      }
    }
  }

  const next: Cell[] = [];
  for (const [k, count] of neighborCounts) {
    const isAlive = living.has(k);
    if (count === 3 || (count === 2 && isAlive)) {
      next.push(parseKey(k));
    }
  }

  return next;
}
