export type Cell = [number, number];

const MINIMUM_SURVIVAL_NEIGHBORS = 1 + 1;
const REPRODUCTION_NEIGHBORS = MINIMUM_SURVIVAL_NEIGHBORS + 1;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1],
];

function keyOf([x, y]: Cell): string {
  return `${x},${y}`;
}

function cellFrom(key: string): Cell {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
}

function compareCells([leftX, leftY]: Cell, [rightX, rightY]: Cell): number {
  return leftX - rightX || leftY - rightY;
}

function willBeAlive(isAlive: boolean, neighborCount: number): boolean {
  return neighborCount === REPRODUCTION_NEIGHBORS
    || (isAlive && neighborCount === MINIMUM_SURVIVAL_NEIGHBORS);
}

function countNeighbors(cells: Cell[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const [x, y] of cells) {
    for (const [xOffset, yOffset] of NEIGHBOR_OFFSETS) {
      const neighbor = keyOf([x + xOffset, y + yOffset]);
      counts.set(neighbor, (counts.get(neighbor) ?? 0) + 1);
    }
  }
  return counts;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(keyOf));
  return [...countNeighbors(cells)]
    .filter(([cell, count]) => willBeAlive(living.has(cell), count))
    .map(([cell]) => cellFrom(cell))
    .sort(compareCells);
}
