export type Cell = [number, number];

type Candidate = {
  cell: Cell;
  neighbors: number;
};

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];
const MIN_SURVIVAL_NEIGHBORS = 2;
const MAX_SURVIVAL_NEIGHBORS = 3;
const REPRODUCTION_NEIGHBORS = 3;

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

const uniqueCells = (cells: Cell[]): Map<string, Cell> =>
  new Map(cells.map((cell) => [keyOf(cell), cell]));

const countNeighbors = (livingCells: Map<string, Cell>): Map<string, Candidate> => {
  const candidates = new Map<string, Candidate>();
  for (const [x, y] of livingCells.values()) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const cell: Cell = [x + dx, y + dy];
      const key = keyOf(cell);
      const previous = candidates.get(key);
      candidates.set(key, { cell, neighbors: (previous?.neighbors ?? 0) + 1 });
    }
  }
  return candidates;
};

const survives = (alive: boolean, neighbors: number): boolean =>
  neighbors === REPRODUCTION_NEIGHBORS ||
  (alive && neighbors >= MIN_SURVIVAL_NEIGHBORS && neighbors <= MAX_SURVIVAL_NEIGHBORS);

/** Returns the living cells in the generation following `cells`. */
export function nextGeneration(cells: Cell[]): Cell[] {
  const livingCells = uniqueCells(cells);
  const candidates = countNeighbors(livingCells);
  return [...candidates.entries()]
    .filter(([key, candidate]) => survives(livingCells.has(key), candidate.neighbors))
    .map(([, candidate]) => candidate.cell)
    .sort(([x1, y1], [x2, y2]) => y1 - y2 || x1 - x2);
}
