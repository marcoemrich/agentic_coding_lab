type Cell = [number, number];

const NEIGHBOR_OFFSETS: [number, number][] = [
  [-1, -1], [0, -1], [1, -1],
  [-1,  0],          [1,  0],
  [-1,  1], [0,  1], [1,  1],
];

const cellKey = (x: number, y: number): string => `${x},${y}`;

export function nextGeneration(cells: Cell[]): Cell[] {
  const live = new Set(cells.map(([x, y]) => cellKey(x, y)));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const key = cellKey(x + dx, y + dy);
      neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
    }
  }

  const result: Cell[] = [];

  for (const [x, y] of cells) {
    const count = neighborCounts.get(cellKey(x, y)) ?? 0;
    if (count === 2 || count === 3) {
      result.push([x, y]);
    }
  }

  for (const [key, count] of neighborCounts) {
    if (count === 3) {
      if (!live.has(key)) {
        const [xStr, yStr] = key.split(",");
        result.push([parseInt(xStr), parseInt(yStr)]);
      }
    }
  }

  return result;
}