type Cell = [number, number]; // [x, y]

const MIN_NEIGHBORS_TO_SURVIVE = 2;
const MAX_NEIGHBORS_TO_SURVIVE = 3;
const NEIGHBORS_TO_REPRODUCE = 3;

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

const SELF_AND_NEIGHBOR_OFFSETS: Cell[] = [[0, 0], ...NEIGHBOR_OFFSETS];

const keyOf = (x: number, y: number): string => `${x},${y}`;

const willLive = (alive: boolean, neighbors: number): boolean =>
  alive
    ? neighbors >= MIN_NEIGHBORS_TO_SURVIVE &&
      neighbors <= MAX_NEIGHBORS_TO_SURVIVE
    : neighbors === NEIGHBORS_TO_REPRODUCE;

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveKeys = new Set(cells.map(([x, y]) => keyOf(x, y)));
  const isAlive = (x: number, y: number): boolean => liveKeys.has(keyOf(x, y));

  const countNeighbors = (x: number, y: number): number =>
    NEIGHBOR_OFFSETS.filter(([dx, dy]) => isAlive(x + dx, y + dy)).length;

  const candidates = new Map<string, Cell>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of SELF_AND_NEIGHBOR_OFFSETS) {
      const nx = x + dx;
      const ny = y + dy;
      candidates.set(keyOf(nx, ny), [nx, ny]);
    }
  }

  return [...candidates.values()].filter(([x, y]) =>
    willLive(isAlive(x, y), countNeighbors(x, y))
  );
}
