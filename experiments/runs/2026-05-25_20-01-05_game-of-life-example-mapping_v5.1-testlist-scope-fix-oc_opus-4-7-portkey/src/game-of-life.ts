export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

function cellKey(x: number, y: number): string {
  return `${x},${y}`;
}

function parseCellKey(k: string): Cell {
  const [x, y] = k.split(",").map(Number);
  return [x, y];
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const aliveKeys = new Set(cells.map(([x, y]) => cellKey(x, y)));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const k = cellKey(x + dx, y + dy);
      neighborCounts.set(k, (neighborCounts.get(k) ?? 0) + 1);
    }
  }

  const nextCells: Cell[] = [];
  for (const [k, count] of neighborCounts) {
    const survives = count === 2 && aliveKeys.has(k);
    const reproduces = count === 3;
    if (survives || reproduces) {
      nextCells.push(parseCellKey(k));
    }
  }
  return nextCells;
}
