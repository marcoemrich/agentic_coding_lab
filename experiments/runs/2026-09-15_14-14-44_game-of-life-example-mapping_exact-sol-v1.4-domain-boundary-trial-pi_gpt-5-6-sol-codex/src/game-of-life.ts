export type Cell = [number, number];

type Candidate = {
  cell: Cell;
  livingNeighbors: number;
};

const SURVIVAL_NEIGHBORS = 2;
const REPRODUCTION_NEIGHBORS = 3;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function neighboringCells([x, y]: Cell): Cell[] {
  return NEIGHBOR_OFFSETS.map(([offsetX, offsetY]) => [
    x + offsetX,
    y + offsetY,
  ]);
}

function countLivingNeighbors(cells: Iterable<Cell>): Map<string, Candidate> {
  const candidates = new Map<string, Candidate>();
  for (const cell of cells) {
    for (const neighbor of neighboringCells(cell)) {
      const key = cellKey(neighbor);
      const candidate = candidates.get(key);
      if (candidate) {
        candidate.livingNeighbors += 1;
      } else {
        candidates.set(key, { cell: neighbor, livingNeighbors: 1 });
      }
    }
  }
  return candidates;
}

function willLive(candidate: Candidate, currentlyLiving: boolean): boolean {
  return (
    candidate.livingNeighbors === REPRODUCTION_NEIGHBORS ||
    (currentlyLiving && candidate.livingNeighbors === SURVIVAL_NEIGHBORS)
  );
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const livingCells = new Map(cells.map((cell) => [cellKey(cell), cell]));
  const candidates = countLivingNeighbors(livingCells.values());

  return [...candidates.entries()]
    .filter(([key, candidate]) => willLive(candidate, livingCells.has(key)))
    .map(([, candidate]) => candidate.cell);
}
