export type Cell = [number, number];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const isAliveNext = (wasAlive: boolean, neighbors: number): boolean =>
  neighbors === 3 || (wasAlive && neighbors === 2);

export const nextGeneration = (cells: Cell[]): Cell[] => {
  const live = new Set(cells.map(keyOf));
  const candidates = new Map<string, Cell>();
  const counts = new Map<string, number>();

  for (const cell of cells) {
    for (const neighbor of neighborsOf(cell)) {
      const k = keyOf(neighbor);
      candidates.set(k, neighbor);
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }
  }

  return [...candidates]
    .filter(([k]) => isAliveNext(live.has(k), counts.get(k)!))
    .map(([, cell]) => cell);
};
