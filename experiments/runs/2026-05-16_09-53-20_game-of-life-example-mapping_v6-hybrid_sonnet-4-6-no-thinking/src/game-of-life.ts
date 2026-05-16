type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1,  0],          [1,  0],
  [-1,  1], [0,  1], [1,  1],
];

const cellKey = (x: number, y: number): string => `${x},${y}`;

export function nextGeneration(cells: Cell[]): Cell[] {
  const alive = new Set(cells.map(([x, y]) => cellKey(x, y)));

  const neighborCount = new Map<string, number>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const key = cellKey(x + dx, y + dy);
      neighborCount.set(key, (neighborCount.get(key) ?? 0) + 1);
    }
  }

  const result: Cell[] = [];
  for (const [key, count] of neighborCount) {
    const [x, y] = key.split(",").map(Number) as [number, number];
    if (count === 3 || (count === 2 && alive.has(key))) {
      result.push([x, y]);
    }
  }
  return result;
}
