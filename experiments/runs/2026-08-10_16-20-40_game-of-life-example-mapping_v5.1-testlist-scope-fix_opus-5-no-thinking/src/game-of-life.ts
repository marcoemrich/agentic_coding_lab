export type Cell = [number, number]; // [x, y]

const MIN_NEIGHBORS_TO_SURVIVE = 2;
const MAX_NEIGHBORS_TO_SURVIVE = 3;
const NEIGHBORS_TO_BE_BORN = 3;

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
];

export function nextGeneration(cells: Cell[]): Cell[] {
  const survivors = cells.filter((cell) => survives(cells, cell));
  const births = deadNeighborsOf(cells).filter((cell) => isBorn(cells, cell));
  return [...survivors, ...births];
}

function isBorn(cells: Cell[], cell: Cell): boolean {
  return countLiveNeighbors(cells, cell) === NEIGHBORS_TO_BE_BORN;
}

function survives(cells: Cell[], cell: Cell): boolean {
  const liveNeighbors = countLiveNeighbors(cells, cell);
  return (
    liveNeighbors >= MIN_NEIGHBORS_TO_SURVIVE &&
    liveNeighbors <= MAX_NEIGHBORS_TO_SURVIVE
  );
}

function deadNeighborsOf(cells: Cell[]): Cell[] {
  const neighbors = cells.flatMap(neighborsOf);
  return deduplicate(neighbors.filter((cell) => !isAlive(cells, cell)));
}

function neighborsOf([x, y]: Cell): Cell[] {
  return NEIGHBOR_OFFSETS.map(([dx, dy]): Cell => [x + dx, y + dy]);
}

function deduplicate(cells: Cell[]): Cell[] {
  return [...new Map(cells.map((cell) => [toKey(cell), cell])).values()];
}

function isAlive(cells: Cell[], cell: Cell): boolean {
  return cells.some((live) => isSameCell(live, cell));
}

function isSameCell([x, y]: Cell, [otherX, otherY]: Cell): boolean {
  return x === otherX && y === otherY;
}

function toKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function countLiveNeighbors(cells: Cell[], cell: Cell): number {
  return neighborsOf(cell).filter((neighbor) => isAlive(cells, neighbor))
    .length;
}
