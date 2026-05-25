export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const survives = (wasAlive: boolean, liveNeighbors: number): boolean =>
  liveNeighbors === 3 || (wasAlive && liveNeighbors === 2);

type CellTally = { cell: Cell; liveNeighbors: number };

const tallyLiveNeighbors = (cells: Cell[]): Map<string, CellTally> => {
  const tally = new Map<string, CellTally>();
  for (const cell of cells.flatMap(neighborsOf)) {
    const key = keyOf(cell);
    const existing = tally.get(key);
    tally.set(key, { cell, liveNeighbors: (existing?.liveNeighbors ?? 0) + 1 });
  }
  return tally;
};

export function nextGeneration(cells: Cell[]): Cell[] {
  const aliveKeys = new Set(cells.map(keyOf));

  return [...tallyLiveNeighbors(cells)]
    .filter(([key, { liveNeighbors }]) => survives(aliveKeys.has(key), liveNeighbors))
    .map(([, { cell }]) => cell);
}
