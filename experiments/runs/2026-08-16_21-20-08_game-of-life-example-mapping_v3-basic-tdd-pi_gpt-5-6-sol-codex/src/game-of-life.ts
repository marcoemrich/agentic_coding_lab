export type Cell = [number, number];

type Candidate = { cell: Cell; neighbors: number };

const SURVIVAL_MINIMUM = 2;
const REPRODUCTION_COUNT = 3;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1],
];

function keyOf([x, y]: Cell): string {
  return `${x},${y}`;
}

function countNeighbors(liveCells: Map<string, Cell>): Map<string, Candidate> {
  const candidates = new Map<string, Candidate>();
  for (const [x, y] of liveCells.values()) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const cell: Cell = [x + dx, y + dy];
      const key = keyOf(cell);
      const candidate = candidates.get(key) ?? { cell, neighbors: 0 };
      candidate.neighbors += 1;
      candidates.set(key, candidate);
    }
  }
  return candidates;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveCells = new Map(cells.map((cell) => [keyOf(cell), cell]));
  const result = [...countNeighbors(liveCells).entries()]
    .filter(([key, candidate]) =>
      candidate.neighbors === REPRODUCTION_COUNT ||
      (candidate.neighbors === SURVIVAL_MINIMUM && liveCells.has(key)),
    )
    .map(([, candidate]) => candidate.cell);

  return result.sort(([x1, y1], [x2, y2]) => x1 - x2 || y1 - y2);
}
