export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1],
];

const REPRODUCTION_COUNT = 3;
const SURVIVAL_COUNT = 2;

function keyOf(x: number, y: number): string {
  return `${x},${y}`;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const live = new Set(cells.map(([x, y]) => keyOf(x, y)));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const key = keyOf(x + dx, y + dy);
      neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
    }
  }

  const result: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    const [x, y] = key.split(",").map(Number);
    if (count === REPRODUCTION_COUNT || (count === SURVIVAL_COUNT && live.has(key))) {
      result.push([x, y]);
    }
  }

  return result;
}