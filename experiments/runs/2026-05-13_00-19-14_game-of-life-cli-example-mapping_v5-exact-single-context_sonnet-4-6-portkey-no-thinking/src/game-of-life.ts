type Cell = [number, number];

const toKey = (x: number, y: number): string => `${x},${y}`;
const fromKey = (key: string): Cell => key.split(",").map(Number) as Cell;
const byXThenY = ([ax, ay]: Cell, [bx, by]: Cell): number => ax !== bx ? ax - bx : ay - by;

export const advance = (cells: Cell[], steps: number): Cell[] => {
  if (steps === 0) return cells;

  const alive = new Set(cells.map(([x, y]) => toKey(x, y)));

  const neighborCounts = new Map<string, number>();
  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const key = toKey(x + dx, y + dy);
        neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
      }
    }
  }

  const next: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (count === 3 || (count === 2 && alive.has(key))) {
      next.push(fromKey(key));
    }
  }

  return next.sort(byXThenY);
};
