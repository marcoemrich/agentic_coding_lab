export type Cell = [number, number];

type CellKey = string;

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const toKey = ([x, y]: Cell): CellKey => `${x},${y}`;

const fromKey = (key: CellKey): Cell => {
  const [x, y] = key.split(',');
  return [Number(x), Number(y)];
};

const countLiveNeighbors = (cells: Cell[]): Map<CellKey, number> => {
  const counts = new Map<CellKey, number>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const key = toKey([x + dx, y + dy]);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return counts;
};

const survives = (isAlive: boolean, neighbors: number): boolean =>
  neighbors === 3 || (neighbors === 2 && isAlive);

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveCells = new Set(cells.map(toKey));
  const neighborCounts = countLiveNeighbors(cells);

  const survivors: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (survives(liveCells.has(key), count)) {
      survivors.push(fromKey(key));
    }
  }
  return survivors;
}
