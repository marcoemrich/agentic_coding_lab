type Cell = [number, number];

const NEIGHBORS_TO_REPRODUCE = 3;

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

export function nextGeneration(cells: Cell[]): Cell[] {
  const survivors = cells.filter((cell) =>
    survives(countLiveNeighbors(cell, cells))
  );
  const births = birthCandidates(cells).filter(
    (cell) => countLiveNeighbors(cell, cells) === NEIGHBORS_TO_REPRODUCE
  );
  return [...survivors, ...births];
}

function birthCandidates(cells: Cell[]): Cell[] {
  const deadNeighbors = cells
    .flatMap(neighborsOf)
    .filter((candidate) => !contains(cells, candidate));
  return unique(deadNeighbors);
}

function unique(cells: Cell[]): Cell[] {
  const seen = new Map<string, Cell>();
  for (const cell of cells) {
    seen.set(keyOf(cell), cell);
  }
  return [...seen.values()];
}

function keyOf([x, y]: Cell): string {
  return `${x},${y}`;
}

function neighborsOf([x, y]: Cell): Cell[] {
  return NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);
}

function contains(cells: Cell[], cell: Cell): boolean {
  return cells.some((other) => samePosition(other, cell));
}

function samePosition([x, y]: Cell, [ox, oy]: Cell): boolean {
  return x === ox && y === oy;
}

const MIN_NEIGHBORS_TO_SURVIVE = 2;
const MAX_NEIGHBORS_TO_SURVIVE = 3;

function survives(neighborCount: number): boolean {
  return (
    neighborCount === MIN_NEIGHBORS_TO_SURVIVE ||
    neighborCount === MAX_NEIGHBORS_TO_SURVIVE
  );
}

function countLiveNeighbors(cell: Cell, cells: Cell[]): number {
  return neighborsOf(cell).filter((neighbor) => contains(cells, neighbor))
    .length;
}
