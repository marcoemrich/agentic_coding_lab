export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

const survives = (isAlive: boolean, neighbors: number): boolean =>
  neighbors === 3 || (isAlive && neighbors === 2);

const countNeighbors = (cells: Cell[]): Map<string, [Cell, number]> => {
  const counts = new Map<string, [Cell, number]>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighbor: Cell = [x + dx, y + dy];
      const key = keyOf(neighbor);
      const entry = counts.get(key);
      counts.set(key, [neighbor, (entry?.[1] ?? 0) + 1]);
    }
  }
  return counts;
};

export function nextGeneration(cells: Cell[]): Cell[] {
  const alive = new Set(cells.map(keyOf));
  const result: Cell[] = [];
  for (const [key, [cell, count]] of countNeighbors(cells)) {
    if (survives(alive.has(key), count)) result.push(cell);
  }
  return result;
}
