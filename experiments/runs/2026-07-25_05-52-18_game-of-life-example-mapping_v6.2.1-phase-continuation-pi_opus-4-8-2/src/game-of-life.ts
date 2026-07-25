type Cell = [number, number]; // [x, y]

const cellKey = (x: number, y: number) => `${x},${y}`;
const parseCellKey = (key: string): Cell => key.split(",").map(Number) as Cell;

function survivesToNextGeneration(isAlive: boolean, neighborCount: number): boolean {
  return isAlive ? neighborCount === 2 || neighborCount === 3 : neighborCount === 3;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const alive = new Set(cells.map(([x, y]) => cellKey(x, y)));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const k = cellKey(x + dx, y + dy);
        neighborCounts.set(k, (neighborCounts.get(k) ?? 0) + 1);
      }
    }
  }

  const nextCells: Cell[] = [];
  for (const [k, neighborCount] of neighborCounts) {
    if (survivesToNextGeneration(alive.has(k), neighborCount)) {
      nextCells.push(parseCellKey(k));
    }
  }
  return nextCells;
}
