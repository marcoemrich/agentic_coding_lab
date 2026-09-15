export type Cell = [number, number];

type Candidate = {
  cell: Cell;
  liveNeighborCount: number;
};

const SURVIVAL_NEIGHBOR_COUNT = 2;
const REPRODUCTION_NEIGHBOR_COUNT = 3;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function countLiveNeighbors(liveCells: Iterable<Cell>): Map<string, Candidate> {
  const candidates = new Map<string, Candidate>();
  for (const [x, y] of liveCells) {
    for (const [offsetX, offsetY] of NEIGHBOR_OFFSETS) {
      const cell: Cell = [x + offsetX, y + offsetY];
      const key = cellKey(cell);
      const liveNeighborCount = (candidates.get(key)?.liveNeighborCount ?? 0) + 1;
      candidates.set(key, { cell, liveNeighborCount });
    }
  }
  return candidates;
}

function survives(candidate: Candidate, livingKeys: Set<string>): boolean {
  return candidate.liveNeighborCount === REPRODUCTION_NEIGHBOR_COUNT
    || (candidate.liveNeighborCount === SURVIVAL_NEIGHBOR_COUNT
      && livingKeys.has(cellKey(candidate.cell)));
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const livingCells = new Map(cells.map((cell) => [cellKey(cell), cell]));
  const livingKeys = new Set(livingCells.keys());
  const candidates = countLiveNeighbors(livingCells.values());
  return [...candidates.values()]
    .filter((candidate) => survives(candidate, livingKeys))
    .map(({ cell }) => cell)
    .sort(([leftX, leftY], [rightX, rightY]) => leftY - rightY || leftX - rightX);
}
