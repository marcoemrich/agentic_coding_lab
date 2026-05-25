export type Cell = [number, number];

type CellKey = string;

const toKey = ([x, y]: Cell): CellKey => `${x},${y}`;
const fromKey = (key: CellKey): Cell => {
  const [x, y] = key.split(",");
  return [Number(x), Number(y)];
};

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveCells = new Set(cells.map(toKey));
  const neighborCounts = new Map<CellKey, number>();

  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const key = toKey([x + dx, y + dy]);
      neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
    }
  }

  const survives = (key: CellKey, count: number): boolean =>
    count === 3 || (count === 2 && liveCells.has(key));

  const nextLive: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (survives(key, count)) nextLive.push(fromKey(key));
  }
  return nextLive;
}
