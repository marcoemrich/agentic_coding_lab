type Cell = [number, number]; // [x, y]

const SURVIVE_MIN = 2;
const SURVIVE_MAX = 3;
const BIRTH_COUNT = 3;

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

const toKey = ([x, y]: Cell): string => `${x},${y}`;
const fromKey = (key: string): Cell => {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
};

// Tally, for every coordinate adjacent to a live cell, how many live
// neighbors it has. Coordinates with no live neighbors never appear.
function countLiveNeighbors(cells: Cell[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const key = toKey([x + dx, y + dy]);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return counts;
}

// Conway's rules: a live cell stays alive with 2 or 3 neighbors;
// a dead cell is born with exactly 3.
const isAliveNextGen = (alive: boolean, neighbors: number): boolean =>
  alive
    ? neighbors >= SURVIVE_MIN && neighbors <= SURVIVE_MAX
    : neighbors === BIRTH_COUNT;

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(toKey));
  const neighborCounts = countLiveNeighbors(cells);

  const result: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (isAliveNextGen(living.has(key), count)) {
      result.push(fromKey(key));
    }
  }
  return result;
}
