export type Cell = [number, number];

type CellKey = string;

const toKey = (x: number, y: number): CellKey => `${x},${y}`;

const fromKey = (key: CellKey): Cell => {
  const [x, y] = key.split(',');
  return [Number(x), Number(y)];
};

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const survives = (liveNeighbors: number, isAlive: boolean): boolean =>
  liveNeighbors === 3 || (liveNeighbors === 2 && isAlive);

export function nextGeneration(cells: Cell[]): Cell[] {
  const alive = new Set<CellKey>(cells.map(([x, y]) => toKey(x, y)));
  const neighborCounts = new Map<CellKey, number>();

  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const key = toKey(x + dx, y + dy);
      neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
    }
  }

  const result: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (survives(count, alive.has(key))) {
      result.push(fromKey(key));
    }
  }
  return result;
}
