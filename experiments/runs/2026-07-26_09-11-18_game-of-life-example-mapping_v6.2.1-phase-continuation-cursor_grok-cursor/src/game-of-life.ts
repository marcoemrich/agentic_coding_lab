export type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],           [1, 0],
  [-1, 1],  [0, 1],  [1, 1],
];

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function parseCellKey(key: string): Cell {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
}

function countLiveNeighbors(cell: Cell, live: Set<string>): number {
  let count = 0;
  for (const [dx, dy] of NEIGHBOR_OFFSETS) {
    if (live.has(cellKey([cell[0] + dx, cell[1] + dy]))) {
      count++;
    }
  }
  return count;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const live = new Set(cells.map(cellKey));
  const candidates = new Set<string>();

  for (const [x, y] of cells) {
    candidates.add(cellKey([x, y]));
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      candidates.add(cellKey([x + dx, y + dy]));
    }
  }

  const next: Cell[] = [];
  for (const key of candidates) {
    const cell = parseCellKey(key);
    const neighbors = countLiveNeighbors(cell, live);
    const isAlive = live.has(key);
    if (isAlive && (neighbors === 2 || neighbors === 3)) {
      next.push(cell);
    } else if (!isAlive && neighbors === 3) {
      next.push(cell);
    }
  }
  return next;
}
