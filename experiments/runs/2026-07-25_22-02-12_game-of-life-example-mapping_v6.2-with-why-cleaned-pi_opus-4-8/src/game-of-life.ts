type Cell = [number, number]; // [x, y]

function isAliveNextGeneration(isCurrentlyAlive: boolean, neighborCount: number): boolean {
  const survives = isCurrentlyAlive && (neighborCount === 2 || neighborCount === 3);
  const reproduces = !isCurrentlyAlive && neighborCount === 3;
  return survives || reproduces;
}

const key = (x: number, y: number): string => `${x},${y}`;
const parseKey = (k: string): Cell => k.split(",").map(Number) as Cell;

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveCells = new Set(cells.map(([x, y]) => key(x, y)));

  const neighborCounts = new Map<string, number>();
  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const k = key(x + dx, y + dy);
        neighborCounts.set(k, (neighborCounts.get(k) ?? 0) + 1);
      }
    }
  }

  const result: Cell[] = [];
  for (const [k, count] of neighborCounts) {
    if (isAliveNextGeneration(liveCells.has(k), count)) {
      result.push(parseKey(k));
    }
  }
  return result;
}
