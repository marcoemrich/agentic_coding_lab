type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<[number, number]> = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],           [1, 0],
  [-1, 1],  [0, 1],  [1, 1],
];

const cellKey = (x: number, y: number): string => `${x},${y}`;
const parseKey = (key: string): Cell => {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
};

export function nextGeneration(cells: Cell[]): Cell[] {
  const aliveKeys = new Set(cells.map(([x, y]) => cellKey(x, y)));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const key = cellKey(x + dx, y + dy);
      neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
    }
  }

  const nextCells: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    const isCurrentlyAlive = aliveKeys.has(key);
    const survives = isCurrentlyAlive && (count === 2 || count === 3);
    const isBorn = !isCurrentlyAlive && count === 3;
    if (survives || isBorn) nextCells.push(parseKey(key));
  }

  return nextCells;
}
