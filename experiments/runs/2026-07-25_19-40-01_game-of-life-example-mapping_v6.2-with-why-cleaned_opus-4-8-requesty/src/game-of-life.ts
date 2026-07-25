type Cell = [number, number];

const toKey = ([x, y]: Cell): string => `${x},${y}`;
const fromKey = (key: string): Cell => {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
};

const BIRTH_NEIGHBORS = 3;
const SURVIVAL_NEIGHBORS = [2, 3];

const survivesNextGeneration = (isAlive: boolean, neighborCount: number): boolean =>
  isAlive
    ? SURVIVAL_NEIGHBORS.includes(neighborCount)
    : neighborCount === BIRTH_NEIGHBORS;

const neighborOffsets: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],           [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

const countLivingNeighbors = (cells: Cell[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of neighborOffsets) {
      const key = toKey([x + dx, y + dy]);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return counts;
};

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(toKey));
  const neighborCounts = countLivingNeighbors(cells);

  const next: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (survivesNextGeneration(living.has(key), count)) {
      next.push(fromKey(key));
    }
  }
  return next;
}
