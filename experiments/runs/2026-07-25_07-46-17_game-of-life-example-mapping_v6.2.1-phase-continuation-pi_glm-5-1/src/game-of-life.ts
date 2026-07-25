type Cell = [number, number];

const NEIGHBOR_OFFSETS: [number, number][] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

function cellKey(cell: Cell): string {
  return `${cell[0]},${cell[1]}`;
}

function keyToCell(key: string): Cell {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
}

function countNeighbors(cell: Cell, liveSet: Set<string>): number {
  let count = 0;
  for (const [dx, dy] of NEIGHBOR_OFFSETS) {
    if (liveSet.has(cellKey([cell[0] + dx, cell[1] + dy]))) {
      count++;
    }
  }
  return count;
}

function willLive(isAlive: boolean, neighbors: number): boolean {
  return neighbors === 3 || (isAlive && neighbors === 2);
}

export function nextGeneration(cells: Cell[]): Cell[] {
  if (cells.length === 0) return [];

  const liveSet = new Set(cells.map(cellKey));
  const candidates = new Set<string>();

  for (const cell of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      candidates.add(cellKey([cell[0] + dx, cell[1] + dy]));
    }
    candidates.add(cellKey(cell));
  }

  const result: Cell[] = [];
  for (const key of candidates) {
    const cell = keyToCell(key);
    const neighbors = countNeighbors(cell, liveSet);
    if (willLive(liveSet.has(key), neighbors)) {
      result.push(cell);
    }
  }

  result.sort((a, b) => a[0] - b[0] || a[1] - b[1]);

  return result;
}
