export type Cell = [number, number];

type Candidate = { cell: Cell; count: number };

const SURVIVAL_NEIGHBORS = 2;
const REPRODUCTION_NEIGHBORS = 3;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],           [1, 0],
  [-1, 1],  [0, 1],  [1, 1],
];

const coordinateKey = (x: number, y: number): string => `${x},${y}`;

const addNeighbor = (
  candidates: Map<string, Candidate>,
  x: number,
  y: number,
): void => {
  const key = coordinateKey(x, y);
  const existing = candidates.get(key);
  if (existing) {
    existing.count += 1;
    return;
  }
  candidates.set(key, { cell: [x, y], count: 1 });
};

const countNeighbors = (living: Iterable<Cell>): Map<string, Candidate> => {
  const candidates = new Map<string, Candidate>();
  for (const [x, y] of living) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      addNeighbor(candidates, x + dx, y + dy);
    }
  }
  return candidates;
};

const survives = (isAlive: boolean, count: number): boolean =>
  count === REPRODUCTION_NEIGHBORS ||
  (isAlive && count === SURVIVAL_NEIGHBORS);

/** Calculates one generation using a sparse collection of living cells. */
export function nextGeneration(cells: Cell[]): Cell[] {
  // Repeated coordinates denote the same living cell.
  const living = new Map<string, Cell>();
  for (const [x, y] of cells) {
    living.set(coordinateKey(x, y), [x, y]);
  }

  const next: Cell[] = [];
  for (const [key, candidate] of countNeighbors(living.values())) {
    if (survives(living.has(key), candidate.count)) {
      next.push(candidate.cell);
    }
  }

  // A stable row-major order makes results independent of input order.
  return next.sort(([xA, yA], [xB, yB]) => yA - yB || xA - xB);
}
