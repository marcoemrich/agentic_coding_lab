export type Cell = [number, number];

const MIN_NEIGHBORS_TO_SURVIVE = 2;
const MAX_NEIGHBORS_TO_SURVIVE = 3;
const NEIGHBORS_TO_BE_BORN = 3;

export function nextGeneration(cells: Cell[]): Cell[] {
  const survives = (cell: Cell) => {
    const neighbors = countNeighbors(cell, cells);
    return (
      neighbors >= MIN_NEIGHBORS_TO_SURVIVE &&
      neighbors <= MAX_NEIGHBORS_TO_SURVIVE
    );
  };
  const isBorn = (cell: Cell) =>
    countNeighbors(cell, cells) === NEIGHBORS_TO_BE_BORN;

  return [...cells.filter(survives), ...deadNeighborsOf(cells).filter(isBorn)];
}

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

function neighborsOf([x, y]: Cell): Cell[] {
  return NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);
}

function deadNeighborsOf(cells: Cell[]): Cell[] {
  const dead = cells
    .flatMap(neighborsOf)
    .filter((candidate) => !isAlive(candidate, cells));
  return deduplicate(dead);
}

function deduplicate(cells: Cell[]): Cell[] {
  return [...new Map(cells.map((cell) => [keyOf(cell), cell])).values()];
}

function isAlive(cell: Cell, cells: Cell[]): boolean {
  return cells.some((liveCell) => isSameCell(liveCell, cell));
}

function isSameCell(cell: Cell, other: Cell): boolean {
  return keyOf(cell) === keyOf(other);
}

function keyOf([x, y]: Cell): string {
  return `${x},${y}`;
}

function countNeighbors(cell: Cell, cells: Cell[]): number {
  return cells.filter((other) => isNeighborOf(other, cell)).length;
}

function isNeighborOf(cell: Cell, other: Cell): boolean {
  return neighborsOf(other).some((neighbor) => isSameCell(neighbor, cell));
}
