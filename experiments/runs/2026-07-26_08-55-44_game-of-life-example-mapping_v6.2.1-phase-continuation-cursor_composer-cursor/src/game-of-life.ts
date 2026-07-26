export type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

function cellKey(cell: Cell): string {
  return `${cell[0]},${cell[1]}`;
}

function parseKey(key: string): Cell {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
}

function neighborKeys(cell: Cell): string[] {
  const [x, y] = cell;
  return NEIGHBOR_OFFSETS.map(([dx, dy]) => cellKey([x + dx, y + dy]));
}

function countLiveNeighbors(cell: Cell, live: Set<string>): number {
  return neighborKeys(cell).filter((key) => live.has(key)).length;
}

function survives(alive: boolean, neighbors: number): boolean {
  return (alive && (neighbors === 2 || neighbors === 3)) || (!alive && neighbors === 3);
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const live = new Set(cells.map(cellKey));
  const candidates = new Set<string>();

  for (const cell of cells) {
    candidates.add(cellKey(cell));
    for (const key of neighborKeys(cell)) {
      candidates.add(key);
    }
  }

  const next: Cell[] = [];

  for (const key of candidates) {
    const cell = parseKey(key);
    if (survives(live.has(key), countLiveNeighbors(cell, live))) {
      next.push(cell);
    }
  }

  return next;
}
