export type Cell = [number, number];

type CellKey = string;

const SURVIVAL_NEIGHBOR_COUNT = 2;
const REPRODUCTION_NEIGHBOR_COUNT = 3;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

function toCellKey([x, y]: Cell): CellKey {
  return `${String(x)},${String(y)}`;
}

function fromCellKey(key: CellKey): Cell {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
}

function countLiveNeighbors(livingCells: Set<CellKey>): Map<CellKey, number> {
  const counts = new Map<CellKey, number>();
  for (const livingCell of livingCells) {
    const [x, y] = fromCellKey(livingCell);
    for (const [offsetX, offsetY] of NEIGHBOR_OFFSETS) {
      const neighbor = toCellKey([x + offsetX, y + offsetY]);
      counts.set(neighbor, (counts.get(neighbor) ?? 0) + 1);
    }
  }
  return counts;
}

function survives(neighborCount: number): boolean {
  return neighborCount === SURVIVAL_NEIGHBOR_COUNT
    || neighborCount === REPRODUCTION_NEIGHBOR_COUNT;
}

function isBorn(neighborCount: number): boolean {
  return neighborCount === REPRODUCTION_NEIGHBOR_COUNT;
}

function livesInNextGeneration(neighborCount: number, isAlive: boolean): boolean {
  return isAlive ? survives(neighborCount) : isBorn(neighborCount);
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const livingCells = new Set(cells.map(toCellKey));
  const neighborCounts = countLiveNeighbors(livingCells);
  return [...neighborCounts]
    .filter(([candidate, count]) => livesInNextGeneration(count, livingCells.has(candidate)))
    .map(([candidate]) => fromCellKey(candidate));
}
