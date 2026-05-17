export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const cellKey = (x: number, y: number): string => `${x},${y}`;
const parseCellKey = (key: string): Cell => {
  const [x, y] = key.split(",");
  return [Number(x), Number(y)];
};

const survives = (isAlive: boolean, liveNeighbors: number): boolean =>
  isAlive ? liveNeighbors === 2 || liveNeighbors === 3 : liveNeighbors === 3;

export const nextGeneration = (cells: Cell[]): Cell[] => {
  const aliveKeys = new Set(cells.map(([x, y]) => cellKey(x, y)));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighborKey = cellKey(x + dx, y + dy);
      neighborCounts.set(neighborKey, (neighborCounts.get(neighborKey) ?? 0) + 1);
    }
  }

  const nextCells: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (survives(aliveKeys.has(key), count)) {
      nextCells.push(parseCellKey(key));
    }
  }
  return nextCells;
};
