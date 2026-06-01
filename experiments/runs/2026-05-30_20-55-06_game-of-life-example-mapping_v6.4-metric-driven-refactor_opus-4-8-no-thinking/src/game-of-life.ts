type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1],
];

const SURVIVAL_NEIGHBORS = 2;
const BIRTH_NEIGHBORS = 3;

function sameCell([ax, ay]: Cell, [bx, by]: Cell): boolean {
  return ax === bx && ay === by;
}

function neighborsOf([x, y]: Cell): Cell[] {
  return NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);
}

function contains(cells: Cell[], cell: Cell): boolean {
  return cells.some((c) => sameCell(c, cell));
}

function countLiveNeighbors(cell: Cell, cells: Cell[]): number {
  return neighborsOf(cell).filter((neighbor) => contains(cells, neighbor))
    .length;
}

function isAliveNextGeneration(cell: Cell, cells: Cell[]): boolean {
  const liveNeighbors = countLiveNeighbors(cell, cells);
  const isBorn = liveNeighbors === BIRTH_NEIGHBORS;
  const survives = contains(cells, cell) && liveNeighbors === SURVIVAL_NEIGHBORS;

  return isBorn || survives;
}

function uniqueCells(cells: Cell[]): Cell[] {
  return cells.filter(
    (cell, index) => cells.findIndex((c) => sameCell(c, cell)) === index,
  );
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const candidates = uniqueCells(cells.flatMap(neighborsOf).concat(cells));
  return candidates.filter((candidate) =>
    isAliveNextGeneration(candidate, cells),
  );
}
