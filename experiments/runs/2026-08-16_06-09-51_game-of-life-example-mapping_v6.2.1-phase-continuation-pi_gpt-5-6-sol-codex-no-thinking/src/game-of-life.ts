export type Cell = [number, number];

type NeighborCounts = Map<string, number>;

const SURVIVAL_NEIGHBOR_COUNT = 2;
const BIRTH_NEIGHBOR_COUNT = 3;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function countNeighbors(liveCells: Cell[]): NeighborCounts {
  const neighborCounts: NeighborCounts = new Map();
  for (const [x, y] of liveCells) {
    for (const [xOffset, yOffset] of NEIGHBOR_OFFSETS) {
      const key = cellKey([x + xOffset, y + yOffset]);
      neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
    }
  }
  return neighborCounts;
}

function shouldBeAlive(neighborCount: number, isAlive: boolean): boolean {
  return neighborCount === BIRTH_NEIGHBOR_COUNT
    || (neighborCount === SURVIVAL_NEIGHBOR_COUNT && isAlive);
}

function cellFromKey(key: string): Cell {
  return key.split(",").map(Number) as Cell;
}

function compareCellsByRowThenColumn([xA, yA]: Cell, [xB, yB]: Cell): number {
  return yA - yB || xA - xB;
}

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveCellKeys = new Set(liveCells.map(cellKey));
  const nextLiveCells: Cell[] = [];

  for (const [key, neighborCount] of countNeighbors(liveCells)) {
    if (shouldBeAlive(neighborCount, liveCellKeys.has(key))) {
      nextLiveCells.push(cellFromKey(key));
    }
  }
  return nextLiveCells.sort(compareCellsByRowThenColumn);
}
