export type Cell = [number, number];

const SURVIVAL_NEIGHBOR_COUNT = 2;
const REPRODUCTION_NEIGHBOR_COUNT = 3;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

function cellKey([x, y]: Cell): string {
  return `${String(x)},${String(y)}`;
}

function cellFromKey(key: string): Cell {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
}

function isAliveInNextGeneration(neighborCount: number, currentlyAlive: boolean): boolean {
  return neighborCount === REPRODUCTION_NEIGHBOR_COUNT
    || (currentlyAlive && neighborCount === SURVIVAL_NEIGHBOR_COUNT);
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const livingCells = new Set(cells.map(cellKey));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (const [offsetX, offsetY] of NEIGHBOR_OFFSETS) {
      const neighbor = cellKey([x + offsetX, y + offsetY]);
      neighborCounts.set(neighbor, (neighborCounts.get(neighbor) ?? 0) + 1);
    }
  }

  return [...neighborCounts]
    .filter(([key, count]) => isAliveInNextGeneration(count, livingCells.has(key)))
    .map(([key]) => cellFromKey(key))
    .sort(([xA, yA], [xB, yB]) => yA - yB || xA - xB);
}
