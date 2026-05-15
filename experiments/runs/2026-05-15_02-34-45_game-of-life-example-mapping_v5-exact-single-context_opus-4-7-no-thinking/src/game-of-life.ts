export type Cell = [number, number];

const keyOf = (x: number, y: number): string => `${x},${y}`;

const isAliveInNextGen = (neighborCount: number, isAlive: boolean): boolean =>
  neighborCount === 3 || (neighborCount === 2 && isAlive);

export function nextGeneration(cells: Cell[]): Cell[] {
  const alive = new Set(cells.map((c) => keyOf(...c)));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const key = keyOf(x + dx, y + dy);
        neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
      }
    }
  }

  const result: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (isAliveInNextGen(count, alive.has(key))) {
      const [xs, ys] = key.split(",");
      result.push([Number(xs), Number(ys)]);
    }
  }

  return result;
}
