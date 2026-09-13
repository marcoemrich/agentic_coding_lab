export type Cell = [number, number];

type Candidate = {
  cell: Cell;
  liveNeighborCount: number;
};

const SURVIVAL_NEIGHBOR_COUNT = 2;
const REPRODUCTION_NEIGHBOR_COUNT = 3;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1],
];

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function neighbors([x, y]: Cell): Cell[] {
  return NEIGHBOR_OFFSETS.map(([deltaX, deltaY]) => [x + deltaX, y + deltaY]);
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const livingCells = new Map(cells.map((cell) => [cellKey(cell), cell]));
  const candidates = new Map<string, Candidate>();

  for (const cell of livingCells.values()) {
    for (const neighbor of neighbors(cell)) {
      const neighborKey = cellKey(neighbor);
      const previousCount = candidates.get(neighborKey)?.liveNeighborCount ?? 0;
      candidates.set(neighborKey, { cell: neighbor, liveNeighborCount: previousCount + 1 });
    }
  }

  return [...candidates.entries()]
    .filter(([candidateKey, { liveNeighborCount }]) =>
      liveNeighborCount === REPRODUCTION_NEIGHBOR_COUNT
      || (liveNeighborCount === SURVIVAL_NEIGHBOR_COUNT && livingCells.has(candidateKey)),
    )
    .map(([, { cell }]) => cell);
}
