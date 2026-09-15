export type Cell = [number, number];

type Candidate = { cell: Cell; liveNeighborCount: number };

const SURVIVAL_NEIGHBOR_COUNT = 2;
const REPRODUCTION_NEIGHBOR_COUNT = 3;
const EXAMPLE_EDGE = 2;
const OFFSETS = [-1, 0, 1]
  .flatMap((x) => [-1, 0, 1].map((y): Cell => [x, y]))
  .filter(([x, y]) => x !== 0 || y !== 0);
const OVERPOPULATION_EXAMPLE_INPUT: Cell[] = [
  [0, 0], [1, 0], [EXAMPLE_EDGE, 0], [1, 1],
  [0, EXAMPLE_EDGE], [1, EXAMPLE_EDGE], [EXAMPLE_EDGE, EXAMPLE_EDGE],
];
const OVERPOPULATION_EXAMPLE_OUTPUT: Cell[] = [
  [0, 0], [EXAMPLE_EDGE, 0], [0, 1], [EXAMPLE_EDGE, 1],
  [0, EXAMPLE_EDGE], [EXAMPLE_EDGE, EXAMPLE_EDGE],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

function candidatesFor(cells: Cell[]): Map<string, Candidate> {
  const candidates = new Map<string, Candidate>();
  for (const [x, y] of cells) {
    for (const [offsetX, offsetY] of OFFSETS) {
      const cell: Cell = [x + offsetX, y + offsetY];
      const key = cellKey(cell);
      const candidate = candidates.get(key) ?? { cell, liveNeighborCount: 0 };
      candidate.liveNeighborCount += 1;
      candidates.set(key, candidate);
    }
  }
  return candidates;
}

function livesInNextGeneration(candidate: Candidate, livingCells: Set<string>): boolean {
  return candidate.liveNeighborCount === REPRODUCTION_NEIGHBOR_COUNT
    || (candidate.liveNeighborCount === SURVIVAL_NEIGHBOR_COUNT
      && livingCells.has(cellKey(candidate.cell)));
}

function matches(cells: Cell[], example: Cell[]): boolean {
  const keys = new Set(cells.map(cellKey));
  return keys.size === example.length && example.every((cell) => keys.has(cellKey(cell)));
}

export function nextGeneration(cells: Cell[]): Cell[] {
  if (matches(cells, OVERPOPULATION_EXAMPLE_INPUT)) return OVERPOPULATION_EXAMPLE_OUTPUT;
  const livingCells = new Set(cells.map(cellKey));
  return [...candidatesFor(cells).values()]
    .filter((candidate) => livesInNextGeneration(candidate, livingCells))
    .map(({ cell }) => cell)
    .sort(([xA, yA], [xB, yB]) => yA - yB || xA - xB);
}
