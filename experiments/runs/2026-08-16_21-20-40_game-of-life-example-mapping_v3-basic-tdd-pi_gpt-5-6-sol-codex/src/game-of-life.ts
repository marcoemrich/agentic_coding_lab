export type Cell = [number, number];

type Candidate = { cell: Cell; neighbours: number };

const SURVIVAL_NEIGHBOURS = 2;
const BIRTH_NEIGHBOURS = 3;
const OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1],
];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

function countNeighbour(
  counts: Map<string, Candidate>,
  [x, y]: Cell,
): void {
  const key = keyOf([x, y]);
  const candidate = counts.get(key);
  if (candidate) {
    candidate.neighbours += 1;
  } else {
    counts.set(key, { cell: [x, y], neighbours: 1 });
  }
}

function neighbourCounts(liveCells: Iterable<Cell>): Map<string, Candidate> {
  const counts = new Map<string, Candidate>();
  for (const [x, y] of liveCells) {
    for (const [dx, dy] of OFFSETS) countNeighbour(counts, [x + dx, y + dy]);
  }
  return counts;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Map(cells.map((cell) => [keyOf(cell), cell]));
  const counts = neighbourCounts(living.values());
  const next = [...counts.entries()]
    .filter(([key, { neighbours }]) =>
      neighbours === BIRTH_NEIGHBOURS
      || (neighbours === SURVIVAL_NEIGHBOURS && living.has(key)))
    .map(([, { cell }]) => cell);
  return next.sort(([x1, y1], [x2, y2]) => x1 - x2 || y1 - y2);
}
