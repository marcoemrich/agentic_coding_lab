export type Cell = [number, number];

const NEIGHBORS: [number, number][] = [
  [-1, -1], [0, -1], [1, -1],
  [-1,  0],          [1,  0],
  [-1,  1], [0,  1], [1,  1],
];

function cellKey(x: number, y: number): string {
  return `${x},${y}`;
}

function countLiveNeighbors(x: number, y: number, live: Set<string>): number {
  let count = 0;
  for (const [dx, dy] of NEIGHBORS) {
    if (live.has(cellKey(x + dx, y + dy))) count++;
  }
  return count;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const live = new Set<string>();
  for (const [x, y] of cells) {
    live.add(cellKey(x, y));
  }

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
    const neighborCount = countLiveNeighbors(x, y, live);
    if (live.has(key)) {
      if (neighborCount === 2 || neighborCount === 3) result.push([x, y]);
    } else {
      if (neighborCount === 3) result.push([x, y]);
    }
  }

  return result;
}