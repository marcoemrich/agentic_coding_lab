export type Cell = [number, number];

export function nextGeneration(cells: Cell[]): Cell[] {
  const toKey = (x: number, y: number) => `${x},${y}`;
  const fromKey = (key: string): Cell => key.split(",").map(Number) as Cell;

  const live = new Set(cells.map(([x, y]) => toKey(x, y)));
  const neighbors = new Map<string, number>();

  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const key = toKey(x + dx, y + dy);
        neighbors.set(key, (neighbors.get(key) ?? 0) + 1);
      }
    }
  }

  const result: Cell[] = [];
  for (const [key, count] of neighbors) {
    const [x, y] = fromKey(key);
    if (count === 3 || (count === 2 && live.has(key))) {
      result.push([x, y]);
    }
  }

  return result;
}