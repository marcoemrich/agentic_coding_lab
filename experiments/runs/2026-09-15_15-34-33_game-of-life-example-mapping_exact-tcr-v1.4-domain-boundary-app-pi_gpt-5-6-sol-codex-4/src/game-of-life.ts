export type Cell = [number, number];

const TWO_NEIGHBORS = 1 + 1;
const THREE_NEIGHBORS = TWO_NEIGHBORS + 1;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],            [1, 0],
  [-1, 1],  [0, 1],   [1, 1],
];

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function liveNeighborCount([x, y]: Cell, livingCells: Set<string>): number {
  return NEIGHBOR_OFFSETS.filter(([dx, dy]) =>
    livingCells.has(cellKey([x + dx, y + dy])),
  ).length;
}

function survives(cell: Cell, livingCells: Set<string>): boolean {
  const neighborCount = liveNeighborCount(cell, livingCells);
  return neighborCount === TWO_NEIGHBORS || neighborCount === THREE_NEIGHBORS;
}

function reproductionCandidates(cells: Cell[]): Cell[] {
  const candidates = new Map<string, Cell>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const candidate: Cell = [x + dx, y + dy];
      candidates.set(cellKey(candidate), candidate);
    }
  }
  return [...candidates.values()];
}

function isBorn(cell: Cell, livingCells: Set<string>): boolean {
  return !livingCells.has(cellKey(cell))
    && liveNeighborCount(cell, livingCells) === THREE_NEIGHBORS;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const livingCells = new Set(cells.map(cellKey));
  const survivors = cells.filter((cell) => survives(cell, livingCells));
  const births = reproductionCandidates(cells)
    .filter((cell) => isBorn(cell, livingCells));
  return [...survivors, ...births];
}
