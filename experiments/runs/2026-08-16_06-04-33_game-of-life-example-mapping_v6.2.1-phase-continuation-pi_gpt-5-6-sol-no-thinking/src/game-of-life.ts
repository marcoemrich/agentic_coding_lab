export type Cell = [x: number, y: number];

const SURVIVING_NEIGHBOR_COUNT = 2;
const REPRODUCING_NEIGHBOR_COUNT = 3;

export function nextGeneration(currentLiveCells: Cell[]): Cell[] {
  const liveCellKeys = new Set(currentLiveCells.map(cellKey));
  const neighborCounts = new Map<string, number>();

  for (const cell of currentLiveCells) {
    countNeighborsOf(cell, neighborCounts);
  }

  return [...neighborCounts]
    .filter(([key, count]) => isAliveInNextGeneration(key, count, liveCellKeys))
    .map(([key]) => parseCellKey(key))
    .sort(([x1, y1], [x2, y2]) => y1 - y2 || x1 - x2);
}

function countNeighborsOf([x, y]: Cell, neighborCounts: Map<string, number>): void {
  for (let deltaY = -1; deltaY <= 1; deltaY += 1) {
    for (let deltaX = -1; deltaX <= 1; deltaX += 1) {
      if (deltaX === 0 && deltaY === 0) continue;
      const key = cellKey([x + deltaX, y + deltaY]);
      neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
    }
  }
}

function isAliveInNextGeneration(
  key: string,
  neighborCount: number,
  liveCellKeys: Set<string>,
): boolean {
  return neighborCount === REPRODUCING_NEIGHBOR_COUNT
    || (neighborCount === SURVIVING_NEIGHBOR_COUNT && liveCellKeys.has(key));
}

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function parseCellKey(key: string): Cell {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
}
