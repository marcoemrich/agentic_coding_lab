export type Cell = [number, number];

type Candidate = {
  cell: Cell;
  neighbors: number;
};

const SURVIVAL_NEIGHBORS = 2;
const REPRODUCTION_NEIGHBORS = 3;

const OFFSETS: Cell[] = [-1, 0, 1].flatMap((x) =>
  [-1, 0, 1]
    .filter((y) => x !== 0 || y !== 0)
    .map((y): Cell => [x, y]),
);

function key([x, y]: Cell): string {
  return `${x},${y}`;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Map(cells.map((cell) => [key(cell), cell]));
  const candidates = new Map<string, Candidate>();

  for (const [x, y] of living.values()) {
    for (const [offsetX, offsetY] of OFFSETS) {
      const neighbor: Cell = [x + offsetX, y + offsetY];
      const neighborKey = key(neighbor);
      const candidate = candidates.get(neighborKey) ?? { cell: neighbor, neighbors: 0 };
      candidate.neighbors += 1;
      candidates.set(neighborKey, candidate);
    }
  }

  return [...candidates.entries()]
    .filter(([candidateKey, { neighbors }]) =>
      neighbors === REPRODUCTION_NEIGHBORS
      || (neighbors === SURVIVAL_NEIGHBORS && living.has(candidateKey)),
    )
    .map(([, { cell }]) => cell);
}
