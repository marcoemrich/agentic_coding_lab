type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [0, -1], [1, -1],
  [-1,  0],          [1,  0],
  [-1,  1], [0,  1], [1,  1],
];

const keyOf = (x: number, y: number): string => `${x},${y}`;

const parseKey = (key: string): Cell => {
  const [xs, ys] = key.split(',');
  return [Number(xs), Number(ys)];
};

const survives = (isAlive: boolean, neighborCount: number): boolean =>
  (isAlive && (neighborCount === 2 || neighborCount === 3)) ||
  (!isAlive && neighborCount === 3);

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveCells = new Set(cells.map(([x, y]) => keyOf(x, y)));
  const neighborCounts = countNeighbors(cells);

  const result: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (survives(liveCells.has(key), count)) {
      result.push(parseKey(key));
    }
  }
  return result;
}

function countNeighbors(cells: Cell[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const key = keyOf(x + dx, y + dy);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return counts;
}
