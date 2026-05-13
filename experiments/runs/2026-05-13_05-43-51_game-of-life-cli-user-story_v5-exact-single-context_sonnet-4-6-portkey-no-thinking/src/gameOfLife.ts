export type Cell = [number, number];

const cellKey = (x: number, y: number): string => `${x},${y}`;
const cellFromKey = (key: string): Cell => key.split(",").map(Number) as Cell;

export const step = (aliveCells: Cell[], stepCount: number): Cell[] => {
  if (stepCount === 0) return aliveCells;

  const aliveSet = new Set(aliveCells.map(([x, y]) => cellKey(x, y)));

  const neighborCounts = new Map<string, number>();
  for (const [x, y] of aliveCells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const key = cellKey(x + dx, y + dy);
        neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
      }
    }
  }

  const next: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    const [x, y] = cellFromKey(key);
    if (count === 3 || (count === 2 && aliveSet.has(key))) {
      next.push([x, y]);
    }
  }

  return next.sort(([ax, ay], [bx, by]) => ax !== bx ? ax - bx : ay - by);
};
