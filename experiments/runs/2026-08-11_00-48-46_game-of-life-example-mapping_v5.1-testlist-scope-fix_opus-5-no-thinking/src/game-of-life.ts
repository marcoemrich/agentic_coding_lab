export type Cell = [number, number]; // [x, y]

const MIN_NEIGHBORS_TO_SURVIVE = 2;
const MAX_NEIGHBORS_TO_SURVIVE = 3;
const NEIGHBORS_TO_BE_BORN = 3;

function isSameCell([x, y]: Cell, [otherX, otherY]: Cell): boolean {
  return x === otherX && y === otherY;
}

function isNeighbor(cell: Cell, other: Cell): boolean {
  const [x, y] = cell;
  const [otherX, otherY] = other;
  return (
    !isSameCell(cell, other) &&
    Math.abs(otherX - x) <= 1 &&
    Math.abs(otherY - y) <= 1
  );
}

function countLiveNeighbors(cells: Cell[], cell: Cell): number {
  return cells.filter((other) => isNeighbor(cell, other)).length;
}

function isLive(cells: Cell[], cell: Cell): boolean {
  return cells.some((live) => isSameCell(live, cell));
}

function uniqueCells(cells: Cell[]): Cell[] {
  return cells.filter(
    (cell, index) =>
      cells.findIndex((other) => isSameCell(cell, other)) === index,
  );
}

function neighborsOf([x, y]: Cell): Cell[] {
  const offsets = [-1, 0, 1];
  return offsets
    .flatMap((dx) => offsets.map((dy) => [dx, dy]))
    .filter(([dx, dy]) => dx !== 0 || dy !== 0)
    .map(([dx, dy]): Cell => [x + dx, y + dy]);
}

function survives(cells: Cell[], cell: Cell): boolean {
  const liveNeighbors = countLiveNeighbors(cells, cell);
  return (
    liveNeighbors >= MIN_NEIGHBORS_TO_SURVIVE &&
    liveNeighbors <= MAX_NEIGHBORS_TO_SURVIVE
  );
}

function isBorn(cells: Cell[], cell: Cell): boolean {
  return (
    !isLive(cells, cell) &&
    countLiveNeighbors(cells, cell) === NEIGHBORS_TO_BE_BORN
  );
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const survivors = cells.filter((cell) => survives(cells, cell));

  const birthCandidates = uniqueCells(cells.flatMap(neighborsOf));
  const births = birthCandidates.filter((cell) => isBorn(cells, cell));

  return [...survivors, ...births];
}
