export type Cell = [number, number];

type CellKey = string;

const encodeCell = ([x, y]: Cell): CellKey => `${x},${y}`;

const decodeCell = (key: CellKey): Cell => {
  const [x, y] = key.split(",");
  return [Number(x), Number(y)];
};

const neighborOffsets: ReadonlyArray<[number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const survives = (wasAlive: boolean, liveNeighbors: number): boolean =>
  liveNeighbors === 3 || (wasAlive && liveNeighbors === 2);

const countLiveNeighbors = (cells: Cell[]): Map<CellKey, number> => {
  const counts = new Map<CellKey, number>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of neighborOffsets) {
      const key = encodeCell([x + dx, y + dy]);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return counts;
};

export const nextGeneration = (cells: Cell[]): Cell[] => {
  const aliveKeys = new Set(cells.map(encodeCell));
  const neighborCounts = countLiveNeighbors(cells);

  return Array.from(neighborCounts)
    .filter(([key, count]) => survives(aliveKeys.has(key), count))
    .map(([key]) => decodeCell(key));
};
