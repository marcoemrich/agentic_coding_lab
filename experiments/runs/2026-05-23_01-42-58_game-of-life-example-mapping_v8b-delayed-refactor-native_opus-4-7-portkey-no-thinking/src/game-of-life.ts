type Cell = [number, number];
type CellKey = string;

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [0, -1], [1, -1],
  [-1,  0],          [1,  0],
  [-1,  1], [0,  1], [1,  1],
];

const keyOf = ([x, y]: Cell): CellKey => `${x},${y}`;

const cellOf = (key: CellKey): Cell => {
  const [x, y] = key.split(",");
  return [Number(x), Number(y)];
};

const survives = (count: number) => count === 2 || count === 3;
const isBorn = (count: number) => count === 3;

export function nextGeneration(cells: Cell[]): Cell[] {
  const aliveKeys = new Set(cells.map(keyOf));
  const neighborCounts = new Map<CellKey, number>();

  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const key = keyOf([x + dx, y + dy]);
      neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
    }
  }

  const nextGen: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    const shouldLive = aliveKeys.has(key) ? survives(count) : isBorn(count);
    if (shouldLive) nextGen.push(cellOf(key));
  }
  return nextGen;
}
