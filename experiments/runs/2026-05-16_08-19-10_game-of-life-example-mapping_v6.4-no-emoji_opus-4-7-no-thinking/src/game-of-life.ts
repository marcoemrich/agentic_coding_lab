export type Cell = [number, number];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;
const cellOf = (key: string): Cell =>
  key.split(",").map(Number) as Cell;

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const countNeighbors = (cells: Cell[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const cell of cells) {
    for (const neighbor of neighborsOf(cell)) {
      const key = keyOf(neighbor);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return counts;
};

export const nextGeneration = (cells: Cell[]): Cell[] => {
  const livingKeys = new Set(cells.map(keyOf));
  const neighborCounts = countNeighbors(cells);

  const isAliveNext = (key: string, count: number): boolean =>
    count === 3 || (count === 2 && livingKeys.has(key));

  return Array.from(neighborCounts)
    .filter(([key, count]) => isAliveNext(key, count))
    .map(([key]) => cellOf(key));
};
