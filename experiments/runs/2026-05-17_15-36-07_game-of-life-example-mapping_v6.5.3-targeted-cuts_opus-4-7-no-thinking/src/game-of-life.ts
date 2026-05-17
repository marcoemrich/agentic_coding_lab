export type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const willLive = (neighborCount: number, wasAlive: boolean): boolean =>
  neighborCount === 3 || (neighborCount === 2 && wasAlive);

const tallyNeighbors = (
  liveCells: Cell[]
): Map<string, { cell: Cell; count: number }> => {
  const tallies = new Map<string, { cell: Cell; count: number }>();
  for (const cell of liveCells.flatMap(neighborsOf)) {
    const key = cellKey(cell);
    const prev = tallies.get(key)?.count ?? 0;
    tallies.set(key, { cell, count: prev + 1 });
  }
  return tallies;
};

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveKeys = new Set(liveCells.map(cellKey));
  return [...tallyNeighbors(liveCells)].flatMap(([key, { cell, count }]) =>
    willLive(count, liveKeys.has(key)) ? [cell] : []
  );
}
