export type Cell = [number, number];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const survivesToNextGeneration = (isAlive: boolean, neighborCount: number): boolean =>
  neighborCount === 3 || (neighborCount === 2 && isAlive);

const tallyNeighborInfluence = (liveCells: Cell[]): Map<string, { cell: Cell; count: number }> => {
  const tallies = new Map<string, { cell: Cell; count: number }>();
  for (const [x, y] of liveCells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighbor: Cell = [x + dx, y + dy];
      const k = cellKey(neighbor);
      const entry = tallies.get(k) ?? { cell: neighbor, count: 0 };
      entry.count += 1;
      tallies.set(k, entry);
    }
  }
  return tallies;
};

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const aliveKeys = new Set(liveCells.map(cellKey));
  const tallies = tallyNeighborInfluence(liveCells);

  return Array.from(tallies)
    .filter(([k, { count }]) => survivesToNextGeneration(aliveKeys.has(k), count))
    .map(([, { cell }]) => cell);
}
