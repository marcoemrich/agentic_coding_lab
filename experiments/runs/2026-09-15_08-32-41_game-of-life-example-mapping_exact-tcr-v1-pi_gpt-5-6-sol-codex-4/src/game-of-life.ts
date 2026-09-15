export type Cell = [number, number];

const SURVIVAL_NEIGHBOR_COUNT = 2;
const REPRODUCTION_NEIGHBOR_COUNT = 3;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

type Candidate = { cell: Cell; neighborCount: number };

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function neighborsOf([x, y]: Cell): Cell[] {
  return NEIGHBOR_OFFSETS.map(([deltaX, deltaY]) => [x + deltaX, y + deltaY]);
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const livingCells = new Map(cells.map((cell) => [cellKey(cell), cell]));
  const candidates = new Map<string, Candidate>();

  for (const cell of livingCells.values()) {
    for (const neighbor of neighborsOf(cell)) {
      const key = cellKey(neighbor);
      const candidate = candidates.get(key);
      if (candidate) candidate.neighborCount += 1;
      else candidates.set(key, { cell: neighbor, neighborCount: 1 });
    }
  }

  return [...candidates]
    .filter(([key, { neighborCount }]) => neighborCount === REPRODUCTION_NEIGHBOR_COUNT
      || (neighborCount === SURVIVAL_NEIGHBOR_COUNT && livingCells.has(key)))
    .map(([, { cell }]) => cell)
    .sort(([leftX, leftY], [rightX, rightY]) => leftY - rightY || leftX - rightX);
}
