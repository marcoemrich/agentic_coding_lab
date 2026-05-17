export type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const tallyNeighbors = (cells: Cell[]): Map<string, [Cell, number]> => {
  const tallies = new Map<string, [Cell, number]>();
  for (const cell of cells) {
    for (const neighbor of neighborsOf(cell)) {
      const key = cellKey(neighbor);
      const existing = tallies.get(key);
      tallies.set(key, [neighbor, (existing?.[1] ?? 0) + 1]);
    }
  }
  return tallies;
};

export function nextGeneration(cells: Cell[]): Cell[] {
  const aliveKeys = new Set(cells.map(cellKey));
  const survivors: Cell[] = [];
  for (const [key, [cell, count]] of tallyNeighbors(cells)) {
    if (count === 3 || (count === 2 && aliveKeys.has(key))) {
      survivors.push(cell);
    }
  }
  return survivors;
}
