export type Cell = [number, number];

type CellKey = string;

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const keyOf = ([x, y]: Cell): CellKey => `${x},${y}`;

const cellOf = (key: CellKey): Cell => {
  const [x, y] = key.split(",");
  return [Number(x), Number(y)];
};

const survives = (wasAlive: boolean, liveNeighbors: number): boolean =>
  liveNeighbors === 3 || (wasAlive && liveNeighbors === 2);

const countLiveNeighbors = (cells: Cell[]): Map<CellKey, number> => {
  const counts = new Map<CellKey, number>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighbor = keyOf([x + dx, y + dy]);
      counts.set(neighbor, (counts.get(neighbor) ?? 0) + 1);
    }
  }
  return counts;
};

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveCells = new Set(cells.map(keyOf));
  const neighborCounts = countLiveNeighbors(cells);

  const survivors: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (survives(liveCells.has(key), count)) {
      survivors.push(cellOf(key));
    }
  }
  return survivors;
}
