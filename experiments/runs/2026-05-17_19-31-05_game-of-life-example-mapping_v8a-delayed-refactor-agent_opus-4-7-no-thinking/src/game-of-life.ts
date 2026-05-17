type Cell = [number, number];
type CellKey = string;

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [0, -1], [1, -1],
  [-1,  0],          [1,  0],
  [-1,  1], [0,  1], [1,  1],
];

const keyOf = ([x, y]: Cell): CellKey => `${x},${y}`;

const parseKey = (key: CellKey): Cell => {
  const [x, y] = key.split(',');
  return [Number(x), Number(y)];
};

const survives = (isAlive: boolean, neighborCount: number): boolean =>
  neighborCount === 3 || (isAlive && neighborCount === 2);

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveSet = new Set<CellKey>(cells.map(keyOf));
  const neighborCounts = new Map<CellKey, number>();

  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const key = keyOf([x + dx, y + dy]);
      neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
    }
  }

  const result: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (survives(liveSet.has(key), count)) {
      result.push(parseKey(key));
    }
  }
  return result;
}
