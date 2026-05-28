type Cell = [number, number];

const NEIGHBORS: [number, number][] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveSet = new Set(cells.map(c => `${c[0]},${c[1]}`));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBORS) {
      const key = `${x + dx},${y + dy}`;
      neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
    }
  }

  const result: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (count === 3 || (count === 2 && liveSet.has(key))) {
      const [x, y] = key.split(",").map(Number);
      result.push([x, y]);
    }
  }

  return result.sort((a, b) => a[1] - b[1] || a[0] - b[0]);
}