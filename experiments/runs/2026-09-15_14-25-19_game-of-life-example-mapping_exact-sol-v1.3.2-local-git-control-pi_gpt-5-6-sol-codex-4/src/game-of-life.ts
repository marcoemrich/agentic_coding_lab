export type Cell = [number, number];

const SURVIVAL_NEIGHBORS = 2;
const BIRTH_NEIGHBORS = 3;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],            [1, 0],
  [-1, 1],  [0, 1],   [1, 1],
];

function keyOf([x, y]: Cell): string {
  return `${x},${y}`;
}

function cellOf(key: string): Cell {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
}

function countNeighbors(cells: Cell[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighbor = keyOf([x + dx, y + dy]);
      counts.set(neighbor, (counts.get(neighbor) ?? 0) + 1);
    }
  }
  return counts;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(keyOf));
  const next = [...countNeighbors(cells)]
    .filter(([cell, neighbors]) => neighbors === BIRTH_NEIGHBORS
      || (neighbors === SURVIVAL_NEIGHBORS && living.has(cell)))
    .map(([cell]) => cellOf(cell));
  return next.sort(([x1, y1], [x2, y2]) => y1 - y2 || x1 - x2);
}
