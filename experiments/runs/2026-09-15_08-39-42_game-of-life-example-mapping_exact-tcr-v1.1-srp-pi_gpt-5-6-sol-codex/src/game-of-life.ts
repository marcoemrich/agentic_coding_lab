export type Cell = [number, number];

const SURVIVAL_NEIGHBORS = 2;
const REPRODUCTION_NEIGHBORS = 3;
const NEIGHBOR_OFFSETS: Cell[] = [-1, 0, 1].flatMap((x) =>
  [-1, 0, 1]
    .filter((y) => x !== 0 || y !== 0)
    .map((y): Cell => [x, y]),
);

function keyOf([x, y]: Cell): string {
  return `${x},${y}`;
}

function cellFrom(key: string): Cell {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(keyOf));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (const [offsetX, offsetY] of NEIGHBOR_OFFSETS) {
      const neighbor = keyOf([x + offsetX, y + offsetY]);
      neighborCounts.set(neighbor, (neighborCounts.get(neighbor) ?? 0) + 1);
    }
  }

  return [...neighborCounts]
    .filter(([cell, count]) => count === REPRODUCTION_NEIGHBORS
      || (count === SURVIVAL_NEIGHBORS && living.has(cell)))
    .map(([cell]) => cellFrom(cell))
    .sort(([xA, yA], [xB, yB]) => xA - xB || yA - yB);
}
