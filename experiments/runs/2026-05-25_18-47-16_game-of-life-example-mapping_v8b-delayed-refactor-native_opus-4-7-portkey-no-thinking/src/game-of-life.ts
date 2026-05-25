export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],           [1, 0],
  [-1, 1],  [0, 1],  [1, 1],
];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;
const cellOf = (key: string): Cell => {
  const [x, y] = key.split(',');
  return [Number(x), Number(y)];
};

const shouldLive = (neighborCount: number, wasAlive: boolean): boolean =>
  neighborCount === 3 || (neighborCount === 2 && wasAlive);

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveCells = new Set(cells.map(keyOf));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const key = keyOf([x + dx, y + dy]);
      neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
    }
  }

  const nextCells: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (shouldLive(count, liveCells.has(key))) {
      nextCells.push(cellOf(key));
    }
  }
  return nextCells;
}
