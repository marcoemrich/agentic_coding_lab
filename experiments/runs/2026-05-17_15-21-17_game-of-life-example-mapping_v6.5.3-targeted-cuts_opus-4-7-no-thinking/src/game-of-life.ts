export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const survives = (liveNeighborCount: number, isLive: boolean): boolean =>
  liveNeighborCount === 3 || (liveNeighborCount === 2 && isLive);

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveKeys = new Set(cells.map(cellKey));
  const neighborTallies = tallyNeighbors(cells);

  return [...neighborTallies.values()]
    .filter(({ key, count }) => survives(count, liveKeys.has(key)))
    .map(({ cell }) => cell);
}

type Tally = { key: string; cell: Cell; count: number };

const tallyNeighbors = (cells: Cell[]): Map<string, Tally> => {
  const tallies = new Map<string, Tally>();
  for (const cell of cells) {
    for (const neighbor of neighborsOf(cell)) {
      const key = cellKey(neighbor);
      const prev = tallies.get(key)?.count ?? 0;
      tallies.set(key, { key, cell: neighbor, count: prev + 1 });
    }
  }
  return tallies;
};
