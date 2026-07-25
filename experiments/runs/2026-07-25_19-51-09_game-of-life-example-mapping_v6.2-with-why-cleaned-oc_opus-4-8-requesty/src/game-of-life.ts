type Cell = [number, number]; // [x, y]

const toKey = ([x, y]: Cell): string => `${x},${y}`;
const fromKey = (key: string): Cell => key.split(",").map(Number) as Cell;

// A cell is alive next generation if it has exactly 3 live neighbours
// (birth/survival) or it is currently alive with exactly 2 (survival).
const willBeAlive = (isAlive: boolean, liveNeighbors: number): boolean =>
  liveNeighbors === 3 || (isAlive && liveNeighbors === 2);

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveKeys = new Set(cells.map(toKey));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const key = toKey([x + dx, y + dy]);
        neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
      }
    }
  }

  const nextCells: Cell[] = [];
  for (const [key, liveNeighbors] of neighborCounts) {
    if (willBeAlive(liveKeys.has(key), liveNeighbors)) {
      nextCells.push(fromKey(key));
    }
  }

  return nextCells;
}
