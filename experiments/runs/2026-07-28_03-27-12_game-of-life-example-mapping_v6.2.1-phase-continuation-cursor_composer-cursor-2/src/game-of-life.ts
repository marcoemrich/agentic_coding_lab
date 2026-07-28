export type Cell = [number, number]; // [x, y]

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
];

function cellKey(cell: Cell): string {
  return `${cell[0]},${cell[1]}`;
}

function parseCellKey(key: string): Cell {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
}

function neighborCells(cell: Cell): Cell[] {
  return NEIGHBOR_OFFSETS.map(([dx, dy]) => [cell[0] + dx, cell[1] + dy]);
}

function countNeighbors(cell: Cell, liveCells: Set<string>): number {
  return neighborCells(cell).filter((neighbor) =>
    liveCells.has(cellKey(neighbor)),
  ).length;
}

function cellLivesInNextGeneration(isAlive: boolean, neighborCount: number): boolean {
  return neighborCount === 3 || (isAlive && neighborCount === 2);
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveCells = new Set(cells.map(cellKey));
  const candidates = new Set<string>();

  for (const cell of cells) {
    candidates.add(cellKey(cell));
    for (const neighbor of neighborCells(cell)) {
      candidates.add(cellKey(neighbor));
    }
  }

  const next: Cell[] = [];

  for (const key of candidates) {
    const [x, y] = parseCellKey(key);
    const alive = liveCells.has(key);
    const neighbors = countNeighbors([x, y], liveCells);

    if (cellLivesInNextGeneration(alive, neighbors)) {
      next.push([x, y]);
    }
  }

  return next;
}
