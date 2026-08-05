export type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], /* self */ [0, 1],
  [1, -1], [1, 0], [1, 1],
];

function cellKey(x: number, y: number): string {
  return `${x},${y}`;
}

function parseCellKey(key: string): Cell {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
}

function livesInNextGeneration(isAlive: boolean, neighborCount: number): boolean {
  return neighborCount === 3 || (isAlive && neighborCount === 2);
}

function countNeighbors(liveCells: Cell[]): Map<string, number> {
  const neighborCounts = new Map<string, number>();
  for (const [x, y] of liveCells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const key = cellKey(x + dx, y + dy);
      neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
    }
  }
  return neighborCounts;
}

function selectSurvivingCells(liveCells: Cell[], neighborCounts: Map<string, number>): Cell[] {
  const liveKeys = new Set(liveCells.map(([x, y]) => cellKey(x, y)));
  const survivors: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (livesInNextGeneration(liveKeys.has(key), count)) {
      survivors.push(parseCellKey(key));
    }
  }
  return survivors;
}

function byPosition(a: Cell, b: Cell): number {
  return a[0] - b[0] || a[1] - b[1];
}

export function nextGeneration(liveCells: Cell[]): Cell[] {
  return selectSurvivingCells(liveCells, countNeighbors(liveCells)).sort(byPosition);
}
