export type Cell = [number, number];

function key(x: number, y: number): string {
  return `${x},${y}`;
}

function parseKey(k: string): Cell {
  const [x, y] = k.split(",").map(Number);
  return [x, y];
}

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

function willBeAlive(isCurrentlyAlive: boolean, liveNeighborCount: number): boolean {
  const survives = isCurrentlyAlive && (liveNeighborCount === 2 || liveNeighborCount === 3);
  const isBorn = !isCurrentlyAlive && liveNeighborCount === 3;
  return survives || isBorn;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const alive = new Set(cells.map(([x, y]) => key(x, y)));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const k = key(x + dx, y + dy);
      neighborCounts.set(k, (neighborCounts.get(k) ?? 0) + 1);
    }
  }

  const result: Cell[] = [];
  for (const [k, count] of neighborCounts) {
    if (willBeAlive(alive.has(k), count)) {
      result.push(parseKey(k));
    }
  }
  return result;
}
