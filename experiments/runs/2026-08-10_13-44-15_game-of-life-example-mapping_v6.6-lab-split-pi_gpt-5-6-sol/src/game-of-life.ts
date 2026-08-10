export type Cell = [number, number];

const coordinateKey = (x: number, y: number): string => `${x},${y}`;

const SURVIVAL_NEIGHBOR_COUNT = 2;
const REPRODUCTION_NEIGHBOR_COUNT = 3;

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveCellKeys = new Set(liveCells.map(([x, y]) => coordinateKey(x, y)));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of liveCells) {
    for (const [deltaX, deltaY] of NEIGHBOR_OFFSETS) {
      const neighborKey = coordinateKey(x + deltaX, y + deltaY);
      neighborCounts.set(neighborKey, (neighborCounts.get(neighborKey) ?? 0) + 1);
    }
  }

  const nextCells: Cell[] = [];
  for (const [key, liveNeighborCount] of neighborCounts) {
    if (
      liveNeighborCount === REPRODUCTION_NEIGHBOR_COUNT
      || (liveNeighborCount === SURVIVAL_NEIGHBOR_COUNT && liveCellKeys.has(key))
    ) {
      const [x, y] = key.split(",").map(Number);
      nextCells.push([x, y]);
    }
  }

  return nextCells;
}
