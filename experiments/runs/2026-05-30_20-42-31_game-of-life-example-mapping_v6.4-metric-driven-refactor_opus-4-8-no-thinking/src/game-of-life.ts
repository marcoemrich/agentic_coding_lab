type Cell = [number, number]; // [x, y]

const NEIGHBOR_COUNT_FOR_REPRODUCTION = 3;
const NEIGHBOR_COUNT_FOR_SURVIVAL = 2;

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

function toKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function fromKey(key: string): Cell {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
}

function neighborsOf([x, y]: Cell): Cell[] {
  return NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);
}

function candidateCells(cells: Cell[]): Set<string> {
  const cellAndNeighbors = (cell: Cell): Cell[] => [cell, ...neighborsOf(cell)];
  return new Set(cells.flatMap(cellAndNeighbors).map(toKey));
}

function countLiveNeighbors(cell: Cell, living: Set<string>): number {
  return neighborsOf(cell).filter((neighbor) => living.has(toKey(neighbor)))
    .length;
}

function isLiveNextGeneration(cell: Cell, living: Set<string>): boolean {
  const liveNeighbors = countLiveNeighbors(cell, living);
  const isAlive = living.has(toKey(cell));
  return (
    liveNeighbors === NEIGHBOR_COUNT_FOR_REPRODUCTION ||
    (isAlive && liveNeighbors === NEIGHBOR_COUNT_FOR_SURVIVAL)
  );
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(toKey));
  return [...candidateCells(cells)]
    .map(fromKey)
    .filter((cell) => isLiveNextGeneration(cell, living));
}
