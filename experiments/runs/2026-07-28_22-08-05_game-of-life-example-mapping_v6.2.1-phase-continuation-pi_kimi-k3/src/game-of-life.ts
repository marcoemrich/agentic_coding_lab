export type Cell = [number, number]; // [x, y]

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

function cellKey(x: number, y: number): string {
  return `${x},${y}`;
}

function livesOn(neighborCount: number, isAlive: boolean): boolean {
  return neighborCount === 3 || (neighborCount === 2 && isAlive);
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveCells = new Set(cells.map(([x, y]) => cellKey(x, y)));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const k = cellKey(x + dx, y + dy);
      neighborCounts.set(k, (neighborCounts.get(k) ?? 0) + 1);
    }
  }

  const nextCells: Cell[] = [];
  for (const [k, count] of neighborCounts) {
    if (livesOn(count, liveCells.has(k))) {
      nextCells.push(k.split(",").map(Number) as Cell);
    }
  }
  return nextCells;
}
