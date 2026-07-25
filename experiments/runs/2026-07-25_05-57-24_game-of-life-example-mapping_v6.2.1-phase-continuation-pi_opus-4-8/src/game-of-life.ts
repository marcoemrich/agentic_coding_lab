type Cell = [number, number];

const toKey = ([x, y]: Cell): string => `${x},${y}`;
const fromKey = (key: string): Cell => key.split(",").map(Number) as Cell;

function willBeAlive(isAlive: boolean, neighbors: number): boolean {
  const survives = isAlive && (neighbors === 2 || neighbors === 3);
  const reproduces = !isAlive && neighbors === 3;
  return survives || reproduces;
}

function countNeighbors(cells: Cell[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const key = toKey([x + dx, y + dy]);
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
    }
  }
  return counts;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const alive = new Set(cells.map(toKey));
  const neighborCounts = countNeighbors(cells);

  const result: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (willBeAlive(alive.has(key), count)) {
      result.push(fromKey(key));
    }
  }
  return result;
}
