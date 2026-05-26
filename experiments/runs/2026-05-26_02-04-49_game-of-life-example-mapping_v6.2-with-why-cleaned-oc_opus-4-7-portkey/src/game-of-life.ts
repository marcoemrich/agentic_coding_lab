export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [0, -1], [1, -1],
  [-1,  0],          [1,  0],
  [-1,  1], [0,  1], [1,  1],
];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

function countLiveNeighbors(liveCells: Cell[]): Map<string, { cell: Cell; count: number }> {
  const counts = new Map<string, { cell: Cell; count: number }>();
  for (const [x, y] of liveCells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighbor: Cell = [x + dx, y + dy];
      const key = keyOf(neighbor);
      const entry = counts.get(key) ?? { cell: neighbor, count: 0 };
      entry.count += 1;
      counts.set(key, entry);
    }
  }
  return counts;
}

function survivesOrIsBorn(neighborCount: number, isCurrentlyAlive: boolean): boolean {
  const survives = isCurrentlyAlive && neighborCount === 2;
  const isBorn = neighborCount === 3;
  return survives || isBorn;
}

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveCellKeys = new Set(liveCells.map(keyOf));
  const neighborCounts = countLiveNeighbors(liveCells);

  const nextLiveCells: Cell[] = [];
  for (const [key, { cell, count }] of neighborCounts) {
    if (survivesOrIsBorn(count, liveCellKeys.has(key))) {
      nextLiveCells.push(cell);
    }
  }
  return nextLiveCells;
}
