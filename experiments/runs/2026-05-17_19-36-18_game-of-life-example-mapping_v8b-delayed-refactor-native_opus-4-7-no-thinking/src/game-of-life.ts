export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

const cellKey = (x: number, y: number): string => `${x},${y}`;

const parseKey = (key: string): Cell => {
  const comma = key.indexOf(",");
  return [Number(key.slice(0, comma)), Number(key.slice(comma + 1))];
};

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveCells = new Set<string>(cells.map(([x, y]) => cellKey(x, y)));
  const neighborCounts = countNeighbors(cells);

  const nextLiveCells: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (survives(liveCells.has(key), count)) {
      nextLiveCells.push(parseKey(key));
    }
  }
  return nextLiveCells;
}

function countNeighbors(cells: Cell[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const key = cellKey(x + dx, y + dy);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return counts;
}

function survives(isAlive: boolean, neighbors: number): boolean {
  // A live cell survives with 2 or 3 neighbors; a dead cell is born with exactly 3.
  return neighbors === 3 || (isAlive && neighbors === 2);
}
