export type Cell = [number, number];

const NEIGHBORS_TO_SURVIVE = 2;
const NEIGHBORS_TO_REPRODUCE = 3;

function isNeighbor(a: Cell, b: Cell): boolean {
  const [ax, ay] = a;
  const [bx, by] = b;
  return Math.max(Math.abs(ax - bx), Math.abs(ay - by)) === 1;
}

function countLiveNeighbors(cell: Cell, cells: Cell[]): number {
  return cells.filter((other) => isNeighbor(cell, other)).length;
}

function isAlive(cell: Cell, cells: Cell[]): boolean {
  const [x, y] = cell;
  return cells.some(([cx, cy]) => cx === x && cy === y);
}

const NEIGHBORHOOD_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [0, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

function cellWithNeighbors([x, y]: Cell): Cell[] {
  return NEIGHBORHOOD_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);
}

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function candidateCells(cells: Cell[]): Cell[] {
  const all = cells.flatMap(cellWithNeighbors);
  return [...new Map(all.map((cell) => [cellKey(cell), cell])).values()];
}

function livesNextGeneration(cell: Cell, cells: Cell[]): boolean {
  const count = countLiveNeighbors(cell, cells);
  return (
    count === NEIGHBORS_TO_REPRODUCE ||
    (count === NEIGHBORS_TO_SURVIVE && isAlive(cell, cells))
  );
}

export function nextGeneration(cells: Cell[]): Cell[] {
  return candidateCells(cells).filter((cell) => livesNextGeneration(cell, cells));
}
