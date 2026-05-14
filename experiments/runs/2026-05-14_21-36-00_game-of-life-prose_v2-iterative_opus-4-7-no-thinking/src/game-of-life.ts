export type Cell = [number, number];

const key = (x: number, y: number): string => `${x},${y}`;

const parseKey = (k: string): Cell => {
  const idx = k.indexOf(",");
  return [Number(k.slice(0, idx)), Number(k.slice(idx + 1))];
};

export function nextGeneration(cells: Cell[]): Cell[] {
  const alive = new Set<string>();
  for (const [x, y] of cells) {
    alive.add(key(x, y));
  }

  // Count neighbors for every cell adjacent to a living cell (including living cells themselves).
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const nk = key(x + dx, y + dy);
        neighborCounts.set(nk, (neighborCounts.get(nk) ?? 0) + 1);
      }
    }
  }

  const result: Cell[] = [];
  for (const [k, count] of neighborCounts) {
    const isAlive = alive.has(k);
    if (count === 3 || (isAlive && count === 2)) {
      result.push(parseKey(k));
    }
  }

  return result;
}
