export type Cell = [number, number];

type Candidate = { cell: Cell; neighborCount: number };

const SURVIVAL_NEIGHBOR_COUNT = 2;
const REPRODUCTION_NEIGHBOR_COUNT = 3;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],           [1, 0],
  [-1, 1],  [0, 1],  [1, 1],
];

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function neighborsOf([x, y]: Cell): Cell[] {
  return NEIGHBOR_OFFSETS.map(([deltaX, deltaY]): Cell => [
    x + deltaX,
    y + deltaY,
  ]);
}

function uniqueCells(cells: Cell[]): Map<string, Cell> {
  return new Map(cells.map((cell) => [cellKey(cell), cell]));
}

function countNeighboringCells(cells: Iterable<Cell>): Map<string, Candidate> {
  const candidates = new Map<string, Candidate>();
  for (const livingCell of cells) {
    for (const cell of neighborsOf(livingCell)) {
      const key = cellKey(cell);
      const neighborCount = candidates.get(key)?.neighborCount ?? 0;
      candidates.set(key, { cell, neighborCount: neighborCount + 1 });
    }
  }
  return candidates;
}

function willLive(neighborCount: number, isCurrentlyAlive: boolean): boolean {
  return neighborCount === REPRODUCTION_NEIGHBOR_COUNT ||
    isCurrentlyAlive && neighborCount === SURVIVAL_NEIGHBOR_COUNT;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const livingCells = uniqueCells(cells);
  const candidates = countNeighboringCells(livingCells.values());

  return [...candidates.values()]
    .filter(({ cell, neighborCount }) =>
      willLive(neighborCount, livingCells.has(cellKey(cell))))
    .map(({ cell }) => cell);
}
