export type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

const survives = (count: number, wasAlive: boolean): boolean =>
  count === 3 || (count === 2 && wasAlive);

type NeighborTally = { cell: Cell; count: number };

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const tallyNeighbors = (cells: Cell[]): Map<string, NeighborTally> => {
  const tallies = new Map<string, NeighborTally>();
  for (const cell of cells) {
    for (const neighbor of neighborsOf(cell)) {
      const key = keyOf(neighbor);
      const entry = tallies.get(key);
      if (entry) entry.count++;
      else tallies.set(key, { cell: neighbor, count: 1 });
    }
  }
  return tallies;
};

export function nextGeneration(cells: Cell[]): Cell[] {
  const alive = new Set(cells.map(keyOf));
  const tallies = tallyNeighbors(cells);
  return [...tallies]
    .filter(([key, { count }]) => survives(count, alive.has(key)))
    .map(([, { cell }]) => cell);
}
