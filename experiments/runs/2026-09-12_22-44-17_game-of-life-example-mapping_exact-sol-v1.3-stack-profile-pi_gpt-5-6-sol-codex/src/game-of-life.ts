export type Cell = [number, number];

type CellKey = string;

const NEIGHBOR_OFFSETS = [-1, 0, 1] as const;
const SURVIVAL_NEIGHBOR_COUNT = 2;
const REPRODUCTION_NEIGHBOR_COUNT = 3;

function keyOf([x, y]: Cell): CellKey {
  return `${String(x)},${String(y)}`;
}

function cellOf(key: CellKey): Cell {
  return key.split(",").map(Number) as Cell;
}

function neighborsOf([x, y]: Cell): Cell[] {
  const neighbors: Cell[] = [];
  for (const dx of NEIGHBOR_OFFSETS) {
    for (const dy of NEIGHBOR_OFFSETS) {
      if (dx !== 0 || dy !== 0) {
        neighbors.push([x + dx, y + dy]);
      }
    }
  }
  return neighbors;
}

function countNeighbors(living: Set<CellKey>): Map<CellKey, number> {
  const counts = new Map<CellKey, number>();
  for (const key of living) {
    for (const neighbor of neighborsOf(cellOf(key))) {
      const neighborKey = keyOf(neighbor);
      counts.set(neighborKey, (counts.get(neighborKey) ?? 0) + 1);
    }
  }
  return counts;
}

function livesNext(key: CellKey, count: number, living: Set<CellKey>): boolean {
  return count === REPRODUCTION_NEIGHBOR_COUNT
    || (count === SURVIVAL_NEIGHBOR_COUNT && living.has(key));
}

function compareCells([xA, yA]: Cell, [xB, yB]: Cell): number {
  return yA - yB || xA - xB;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(keyOf));
  return [...countNeighbors(living)]
    .filter(([key, count]) => livesNext(key, count, living))
    .map(([key]) => cellOf(key))
    .sort(compareCells);
}
