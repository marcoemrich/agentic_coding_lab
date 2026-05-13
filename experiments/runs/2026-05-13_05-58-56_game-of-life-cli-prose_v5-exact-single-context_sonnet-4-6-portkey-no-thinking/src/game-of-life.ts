export type Cell = [number, number];

const cellKey = (x: number, y: number): string => `${x},${y}`;
const parseKey = (key: string): Cell => key.split(",").map(Number) as Cell;

export const nextGeneration = (cells: Cell[]): Cell[] => {
  const alive = new Set(cells.map(([x, y]) => cellKey(x, y)));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
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
    const [x, y] = parseKey(key);
    if (count === 3 || (count === 2 && alive.has(key))) {
      next.push([x, y]);
    }
  }

  return next.sort(([ax, ay], [bx, by]) => ax !== bx ? ax - bx : ay - by);
};
