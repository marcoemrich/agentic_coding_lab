export type Cell = [number, number];

const neighborOffsets: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

function cellKey(x: number, y: number): string {
  return `${x},${y}`;
}

function parseKey(key: string): Cell {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
}

export function nextGeneration(livingCells: Cell[]): Cell[] {
  const alive = new Set(livingCells.map(([x, y]) => cellKey(x, y)));

  const neighborCounts = new Map<string, number>();
  for (const [x, y] of livingCells) {
    for (const [dx, dy] of neighborOffsets) {
      const key = cellKey(x + dx, y + dy);
      neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
    }
  }

  const result: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (count === 3 || (count === 2 && alive.has(key))) {
      result.push(parseKey(key));
    }
  }

  return result;
}
