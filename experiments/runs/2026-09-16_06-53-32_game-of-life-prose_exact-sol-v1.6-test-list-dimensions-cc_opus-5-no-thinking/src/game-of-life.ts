export type Cell = [number, number];

const MIN_NEIGHBORS_TO_SURVIVE = 2;
const MAX_NEIGHBORS_TO_SURVIVE = 3;
const NEIGHBORS_TO_BE_BORN = 3;

export function nextGeneration(cells: Cell[]): Cell[] {
  const livingCells = distinct(cells);
  const living = new Set(livingCells.map(keyOf));
  const survivors = livingCells.filter((cell) => survives(cell, living));
  const births = deadNeighborsOf(livingCells, living).filter((cell) =>
    isBorn(cell, living),
  );
  return [...survivors, ...births];
}

function survives(cell: Cell, living: Set<string>): boolean {
  const liveNeighbors = countLiveNeighbors(cell, living);
  return (
    liveNeighbors >= MIN_NEIGHBORS_TO_SURVIVE &&
    liveNeighbors <= MAX_NEIGHBORS_TO_SURVIVE
  );
}

function isBorn(cell: Cell, living: Set<string>): boolean {
  return countLiveNeighbors(cell, living) === NEIGHBORS_TO_BE_BORN;
}

function countLiveNeighbors(cell: Cell, living: Set<string>): number {
  return neighborsOf(cell).filter((neighbor) => living.has(keyOf(neighbor)))
    .length;
}

function deadNeighborsOf(cells: Cell[], living: Set<string>): Cell[] {
  const dead = new Map<string, Cell>();
  for (const cell of cells) {
    for (const neighbor of neighborsOf(cell)) {
      if (!living.has(keyOf(neighbor))) {
        dead.set(keyOf(neighbor), neighbor);
      }
    }
  }
  return [...dead.values()];
}

function neighborsOf([x, y]: Cell): Cell[] {
  const offsets = [-1, 0, 1];
  return offsets.flatMap((dx) =>
    offsets
      .filter((dy) => !(dx === 0 && dy === 0))
      .map((dy): Cell => [x + dx, y + dy]),
  );
}

function distinct(cells: Cell[]): Cell[] {
  return [...new Map(cells.map((cell) => [keyOf(cell), cell])).values()];
}

function keyOf([x, y]: Cell): string {
  return `${x},${y}`;
}
