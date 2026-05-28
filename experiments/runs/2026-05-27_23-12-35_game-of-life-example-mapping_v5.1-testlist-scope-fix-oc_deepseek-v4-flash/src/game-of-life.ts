type Cell = [number, number];

const NEIGHBORS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1,  0],          [1,  0],
  [-1,  1], [0,  1], [1,  1],
];

function cellKey(x: number, y: number): string {
  return `${x},${y}`;
}

function countNeighbors(x: number, y: number, liveSet: Set<string>): number {
  let count = 0;
  for (const [dx, dy] of NEIGHBORS) {
    if (liveSet.has(cellKey(x + dx, y + dy))) count++;
  }
  return count;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveSet = new Set(cells.map(([x, y]) => cellKey(x, y)));
  const candidates = new Set<string>();

  for (const [x, y] of cells) {
    candidates.add(cellKey(x, y));
    for (const [dx, dy] of NEIGHBORS) {
      candidates.add(cellKey(x + dx, y + dy));
    }
  }

  const result: Cell[] = [];
  for (const key of candidates) {
    const [x, y] = key.split(",").map(Number);
    const n = countNeighbors(x, y, liveSet);
    const isAlive = liveSet.has(key);
    if ((isAlive && (n === 2 || n === 3)) || (!isAlive && n === 3)) {
      result.push([x, y]);
    }
  }
  return result;
}
