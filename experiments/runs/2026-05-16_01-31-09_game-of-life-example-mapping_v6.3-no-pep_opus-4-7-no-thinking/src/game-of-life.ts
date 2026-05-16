export type Cell = [number, number];

const cellKey = (x: number, y: number): string => `${x},${y}`;

const NEIGHBOR_OFFSETS: ReadonlyArray<[number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

export const nextGeneration = (cells: Cell[]): Cell[] => {
  const aliveKeys = new Set(cells.map(([x, y]) => cellKey(x, y)));
  const neighborCounts = new Map<string, { cell: Cell; count: number }>();

  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighbor: Cell = [x + dx, y + dy];
      const key = cellKey(neighbor[0], neighbor[1]);
      const entry = neighborCounts.get(key);
      if (entry) entry.count += 1;
      else neighborCounts.set(key, { cell: neighbor, count: 1 });
    }
  }

  const survives = (key: string, count: number): boolean =>
    count === 3 || (count === 2 && aliveKeys.has(key));

  const result: Cell[] = [];
  for (const [key, { cell, count }] of neighborCounts) {
    if (survives(key, count)) result.push(cell);
  }
  return result;
};
