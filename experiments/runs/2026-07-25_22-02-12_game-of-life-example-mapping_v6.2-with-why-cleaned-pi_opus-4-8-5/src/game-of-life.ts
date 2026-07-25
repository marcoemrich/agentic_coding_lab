type Cell = [number, number]; // [x, y]

const cellKey = (x: number, y: number): string => `${x},${y}`;

const parseKey = (k: string): Cell => {
  const [x, y] = k.split(",").map(Number);
  return [x, y];
};

// Conway's rules: a live cell survives with 2 or 3 neighbors; a dead cell is
// born with exactly 3 neighbors.
const isAliveNextGen = (neighborCount: number, isCurrentlyAlive: boolean): boolean =>
  neighborCount === 3 || (neighborCount === 2 && isCurrentlyAlive);

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(([x, y]) => cellKey(x, y)));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const neighbor = cellKey(x + dx, y + dy);
        neighborCounts.set(neighbor, (neighborCounts.get(neighbor) ?? 0) + 1);
      }
    }
  }

  const result: Cell[] = [];
  for (const [k, count] of neighborCounts) {
    if (isAliveNextGen(count, living.has(k))) {
      result.push(parseKey(k));
    }
  }
  return result;
}
