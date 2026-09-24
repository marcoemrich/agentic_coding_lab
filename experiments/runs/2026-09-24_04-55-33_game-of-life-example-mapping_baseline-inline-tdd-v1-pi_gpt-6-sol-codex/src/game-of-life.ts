export type Cell = [number, number];

const SURVIVAL_NEIGHBORS = 2;
const BIRTH_NEIGHBORS = 3;
const OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1],
];

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(([x, y]) => JSON.stringify([x, y])));
  const neighbors = new Map<string, number>();

  for (const key of living) {
    const [x, y] = JSON.parse(key) as Cell;
    for (const [dx, dy] of OFFSETS) {
      const neighbor = JSON.stringify([x + dx, y + dy]);
      neighbors.set(neighbor, (neighbors.get(neighbor) ?? 0) + 1);
    }
  }

  return [...neighbors]
    .filter(([key, count]) => count === BIRTH_NEIGHBORS || (count === SURVIVAL_NEIGHBORS && living.has(key)))
    .map(([key]) => JSON.parse(key) as Cell);
}
