type Cell = [number, number];

function cellKey(x: number, y: number): string {
  return `${x},${y}`;
}

function parseCellKey(key: string): Cell {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
}

export function nextGeneration(cells: Array<Cell>): Array<Cell> {
  const aliveKeys = new Set(cells.map(([x, y]) => cellKey(x, y)));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const key = cellKey(x + dx, y + dy);
        neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
      }
    }
  }

  const nextLiveCells: Array<Cell> = [];
  for (const [key, count] of neighborCounts) {
    const isAlive = aliveKeys.has(key);
    const willLive = isAlive ? count === 2 || count === 3 : count === 3;
    if (willLive) nextLiveCells.push(parseCellKey(key));
  }

  return nextLiveCells;
}
