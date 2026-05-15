export type Cell = [number, number];

const key = (x: number, y: number): string => `${x},${y}`;
const parseKey = (k: string): Cell => {
  const [x, y] = k.split(",").map(Number);
  return [x, y];
};

export function nextGeneration(cells: Cell[]): Cell[] {
  const live = new Set<string>(cells.map(([x, y]) => key(x, y)));
  const neighborCounts = new Map<string, number>();

  for (const k of live) {
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
    if (count === 3 || (count === 2 && live.has(k))) {
      next.push(parseKey(k));
    }
  }

  return next;
}
