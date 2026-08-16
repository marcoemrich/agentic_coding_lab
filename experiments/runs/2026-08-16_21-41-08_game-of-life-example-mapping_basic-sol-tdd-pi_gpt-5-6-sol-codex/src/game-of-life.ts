export type Cell = [number, number];

type Candidate = {
  cell: Cell;
  neighbors: number;
};

const SURVIVAL_NEIGHBORS = 2;
const REPRODUCTION_NEIGHBORS = 3;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1],
];

function key([x, y]: Cell): string {
  return `${x},${y}`;
}

function candidatesFor(cells: Cell[]): Map<string, Candidate> {
  const candidates = new Map<string, Candidate>();
  for (const cell of cells) {
    if (!candidates.has(key(cell))) {
      candidates.set(key(cell), { cell, neighbors: 0 });
    }
    for (const [deltaX, deltaY] of NEIGHBOR_OFFSETS) {
      const neighbor: Cell = [cell[0] + deltaX, cell[1] + deltaY];
      const existing = candidates.get(key(neighbor));
      candidates.set(key(neighbor), {
        cell: neighbor,
        neighbors: (existing?.neighbors ?? 0) + 1,
      });
    }
  }
  return candidates;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(key));
  return [...candidatesFor(cells).values()]
    .filter(({ cell, neighbors }) =>
      neighbors === REPRODUCTION_NEIGHBORS ||
      (neighbors === SURVIVAL_NEIGHBORS && living.has(key(cell))))
    .map(({ cell }) => cell);
}
