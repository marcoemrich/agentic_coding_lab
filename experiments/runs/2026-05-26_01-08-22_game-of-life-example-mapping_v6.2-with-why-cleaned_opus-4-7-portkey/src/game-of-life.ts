/** A live cell on the infinite grid, represented as an [x, y] coordinate tuple. */
export type LiveCell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const keyOf = ([x, y]: LiveCell): string => `${x},${y}`;

/** Tallies, for every cell adjacent to any live cell, how many live neighbors it has. */
function countLiveNeighbors(
  liveCells: LiveCell[],
): Map<string, { cell: LiveCell; count: number }> {
  const counts = new Map<string, { cell: LiveCell; count: number }>();
  for (const [x, y] of liveCells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighbor: LiveCell = [x + dx, y + dy];
      const k = keyOf(neighbor);
      const entry = counts.get(k) ?? { cell: neighbor, count: 0 };
      entry.count += 1;
      counts.set(k, entry);
    }
  }
  return counts;
}

/** Computes the next generation of live cells per Conway's Game of Life rules. */
export function nextGeneration(liveCells: LiveCell[]): LiveCell[] {
  const liveKeys = new Set(liveCells.map(keyOf));
  const survivesOrIsBorn = (key: string, count: number): boolean =>
    count === 3 || (count === 2 && liveKeys.has(key));

  return [...countLiveNeighbors(liveCells).entries()]
    .filter(([k, { count }]) => survivesOrIsBorn(k, count))
    .map(([, { cell }]) => cell);
}
