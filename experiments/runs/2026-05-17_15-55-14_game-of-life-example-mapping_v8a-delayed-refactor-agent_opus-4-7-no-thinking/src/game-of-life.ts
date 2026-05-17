export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

const toKey = ([x, y]: Cell): string => `${x},${y}`;

const fromKey = (k: string): Cell => {
  const [xs, ys] = k.split(",");
  return [Number(xs), Number(ys)];
};

function countLiveNeighbors(liveCells: Cell[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const [x, y] of liveCells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighborKey = toKey([x + dx, y + dy]);
      counts.set(neighborKey, (counts.get(neighborKey) ?? 0) + 1);
    }
  }
  return counts;
}

function survivesOrIsBorn(isAlive: boolean, neighborCount: number): boolean {
  return neighborCount === 3 || (isAlive && neighborCount === 2);
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveKeys = new Set(cells.map(toKey));
  const neighborCounts = countLiveNeighbors(cells);

  const result: Cell[] = [];
  for (const [k, count] of neighborCounts) {
    if (survivesOrIsBorn(liveKeys.has(k), count)) {
      result.push(fromKey(k));
    }
  }
  return result;
}
