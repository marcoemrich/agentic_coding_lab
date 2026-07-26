type Cell = [number, number]; // [x, y]

const toKey = ([x, y]: Cell): string => `${x},${y}`;
const fromKey = (key: string): Cell => {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
};

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

export function nextGeneration(cells: Cell[]): Cell[] {
  const alive = new Set(cells.map(toKey));

  const neighborCounts = new Map<string, number>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const key = toKey([x + dx, y + dy]);
      neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
    }
  }

  const next: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    const survives = alive.has(key) && count === 2;
    const born = count === 3;
    if (survives || born) {
      next.push(fromKey(key));
    }
  }

  return next;
}
