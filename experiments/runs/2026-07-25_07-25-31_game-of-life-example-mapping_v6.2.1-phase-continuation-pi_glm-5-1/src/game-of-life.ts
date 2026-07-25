export type Cell = [number, number];

function toKey(x: number, y: number): string {
  return `${x},${y}`;
}

function fromKey(key: string): Cell {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
}

const NEIGHBOR_OFFSETS: [number, number][] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

function countLiveNeighbors(liveSet: Set<string>, x: number, y: number): number {
  let count = 0;
  for (const [dx, dy] of NEIGHBOR_OFFSETS) {
    if (liveSet.has(toKey(x + dx, y + dy))) count++;
  }
  return count;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveSet = new Set(cells.map(([x, y]) => toKey(x, y)));

  // Collect all candidate cells: live cells + their dead neighbors
  const candidateSet = new Set<string>();
  for (const [x, y] of cells) {
    candidateSet.add(toKey(x, y));
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighborKey = toKey(x + dx, y + dy);
      candidateSet.add(neighborKey);
    }
  }

  const result: Cell[] = [];
  for (const key of candidateSet) {
    const [x, y] = fromKey(key);
    const liveNeighbors = countLiveNeighbors(liveSet, x, y);
    const isAlive = liveSet.has(key);
    const willLive = liveNeighbors === 3 || (isAlive && liveNeighbors === 2);
    if (willLive) {
      result.push([x, y]);
    }
  }
  return result;
}
