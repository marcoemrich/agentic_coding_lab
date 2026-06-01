type Cell = [number, number]; // [x, y]

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

const REPRODUCTION_COUNT = 3;
const SURVIVAL_COUNT = 2;

const keyOf = (x: number, y: number): string => `${x},${y}`;
const cellFromKey = (key: string): Cell => {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
};

function countLiveNeighbors(cells: Cell[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const key = keyOf(x + dx, y + dy);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return counts;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(([x, y]) => keyOf(x, y)));
  const neighborCounts = countLiveNeighbors(cells);

  const next: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    const survives = count === SURVIVAL_COUNT && living.has(key);
    const reproduces = count === REPRODUCTION_COUNT;
    if (survives || reproduces) {
      next.push(cellFromKey(key));
    }
  }
  return next;
}
