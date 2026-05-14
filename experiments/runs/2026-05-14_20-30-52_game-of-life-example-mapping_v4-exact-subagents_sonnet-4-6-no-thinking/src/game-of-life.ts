export type Cell = [row: number, col: number];

const cellKey = (cell: Cell): string => `${cell[0]},${cell[1]}`;

const cellFromKey = (key: string): Cell => key.split(",").map(Number) as Cell;

const neighbors = (cell: Cell): Cell[] => {
  const [r, c] = cell;
  return [
    [r - 1, c - 1], [r - 1, c], [r - 1, c + 1],
    [r,     c - 1],             [r,     c + 1],
    [r + 1, c - 1], [r + 1, c], [r + 1, c + 1],
  ] as Cell[];
};

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveSet = new Set(cells.map(cellKey));
  const neighborCount = new Map<string, number>();

  for (const cell of cells) {
    for (const n of neighbors(cell)) {
      const key = cellKey(n);
      neighborCount.set(key, (neighborCount.get(key) ?? 0) + 1);
    }
  }

  const nextAliveCells: Cell[] = [];
  for (const [key, count] of neighborCount) {
    const isAlive = liveSet.has(key);
    const survives = isAlive && (count === 2 || count === 3);
    const isReborn = !isAlive && count === 3;
    if (survives || isReborn) {
      nextAliveCells.push(cellFromKey(key));
    }
  }

  nextAliveCells.sort((a, b) => a[1] - b[1] || a[0] - b[0]);
  return nextAliveCells;
}
