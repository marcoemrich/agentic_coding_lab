export type Cell = [number, number];

const SURVIVAL_NEIGHBORS = 2;
const REPRODUCTION_NEIGHBORS = 3;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

function cellFromKey(key: string): Cell {
  const [x, y] = key.split(',').map(Number);
  return [x, y];
}

function neighborsOf([x, y]: Cell): Cell[] {
  return NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);
}

function censusNeighbors(cells: Cell[]): Map<string, number> {
  const census = new Map<string, number>();
  for (const cell of cells) {
    for (const adjacentCell of neighborsOf(cell)) {
      const neighbor = cellKey(adjacentCell);
      census.set(neighbor, (census.get(neighbor) ?? 0) + 1);
    }
  }
  return census;
}

function livesInNextGeneration(isAlive: boolean, neighbors: number): boolean {
  return neighbors === REPRODUCTION_NEIGHBORS
    || (isAlive && neighbors === SURVIVAL_NEIGHBORS);
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const livingCells = new Set(cells.map(cellKey));
  const next: Cell[] = [];
  for (const [candidate, neighbors] of censusNeighbors(cells)) {
    if (livesInNextGeneration(livingCells.has(candidate), neighbors)) {
      next.push(cellFromKey(candidate));
    }
  }
  return next;
}
