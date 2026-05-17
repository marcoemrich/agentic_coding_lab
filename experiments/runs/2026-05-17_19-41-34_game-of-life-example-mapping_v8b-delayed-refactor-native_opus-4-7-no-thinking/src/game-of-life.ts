type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

const encode = (x: number, y: number): string => `${x},${y}`;

const decode = (key: string): Cell => {
  const [xs, ys] = key.split(",");
  return [Number(xs), Number(ys)];
};

const survives = (isAlive: boolean, neighborCount: number): boolean =>
  neighborCount === 3 || (neighborCount === 2 && isAlive);

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveCells = new Set(cells.map(([x, y]) => encode(x, y)));
  const neighborCounts = countNeighbors(cells);

  const nextLiveCells: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (survives(liveCells.has(key), count)) {
      nextLiveCells.push(decode(key));
    }
  }
  return nextLiveCells;
}

function countNeighbors(cells: Cell[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const key = encode(x + dx, y + dy);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return counts;
}
