export type Cell = [number, number];

function toKey(x: number, y: number): string {
  return `${x},${y}`;
}

const NEIGHBOR_OFFSETS: [number, number][] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

function countNeighbors(x: number, y: number, liveSet: Set<string>): number {
  let count = 0;
  for (const [dx, dy] of NEIGHBOR_OFFSETS) {
    if (liveSet.has(toKey(x + dx, y + dy))) count++;
  }
  return count;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveSet = new Set(cells.map(([x, y]) => toKey(x, y)));
  const candidateSet = new Set<string>();

  // Collect all candidate positions: neighbors of live cells
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      candidateSet.add(toKey(x + dx, y + dy));
    }
  }

  const result: Cell[] = [];

  // Check live cells (survival rules)
  for (const [x, y] of cells) {
    const neighbors = countNeighbors(x, y, liveSet);
    if (neighbors === 2 || neighbors === 3) {
      result.push([x, y]);
    }
  }

  // Check dead candidates (reproduction rule)
  for (const key of candidateSet) {
    if (liveSet.has(key)) continue;
    const [x, y] = key.split(",").map(Number);
    const neighbors = countNeighbors(x, y, liveSet);
    if (neighbors === 3) {
      result.push([x, y]);
    }
  }

  return result;
}
