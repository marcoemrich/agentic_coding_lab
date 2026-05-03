export type Cell = [number, number];

const key = (x: number, y: number): string => `${x},${y}`;

const parseKey = (k: string): Cell => {
  const [x, y] = k.split(',').map(Number);
  return [x, y];
};

export function nextGeneration(livingCells: Cell[]): Cell[] {
  const alive = new Set<string>();
  for (const [x, y] of livingCells) {
    alive.add(key(x, y));
  }

  // Count live neighbors for every cell that could possibly be alive next
  // generation (any cell adjacent to a currently living cell, plus the living
  // cells themselves).
  const neighborCounts = new Map<string, number>();
  for (const k of alive) {
    const [x, y] = parseKey(k);
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
    const isAlive = alive.has(k);
    if (isAlive && (count === 2 || count === 3)) {
      next.push(parseKey(k));
    } else if (!isAlive && count === 3) {
      next.push(parseKey(k));
    }
  }

  return next;
}
