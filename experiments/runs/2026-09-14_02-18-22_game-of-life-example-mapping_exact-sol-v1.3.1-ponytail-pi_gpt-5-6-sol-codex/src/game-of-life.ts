export type Cell = [number, number];

const MIN_SURVIVAL_NEIGHBORS = 2;
const REPRODUCTION_NEIGHBORS = 3;
const NEIGHBOR_OFFSETS: Cell[] = [-1, 0, 1]
  .flatMap((x) => [-1, 0, 1].map((y) => [x, y] as Cell))
  .filter(([x, y]) => x !== 0 || y !== 0);

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(String));
  const neighborCounts = new Map<string, number>();

  for (const cell of living) {
    const [x, y] = cell.split(",").map(Number);
    for (const [offsetX, offsetY] of NEIGHBOR_OFFSETS) {
      const neighbor = String([x + offsetX, y + offsetY]);
      neighborCounts.set(neighbor, (neighborCounts.get(neighbor) ?? 0) + 1);
    }
  }

  return [...neighborCounts]
    .filter(([cell, count]) => count === REPRODUCTION_NEIGHBORS ||
      count === MIN_SURVIVAL_NEIGHBORS && living.has(cell))
    .map(([cell]) => cell.split(",").map(Number) as Cell);
}
