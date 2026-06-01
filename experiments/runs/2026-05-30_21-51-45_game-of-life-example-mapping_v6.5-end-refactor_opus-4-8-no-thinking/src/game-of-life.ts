type Cell = [number, number]; // [x, y]

function sameCell([ax, ay]: Cell, [bx, by]: Cell): boolean {
  return ax === bx && ay === by;
}

function isNeighbor(cell: Cell, other: Cell): boolean {
  return (
    !sameCell(cell, other) &&
    Math.abs(cell[0] - other[0]) <= 1 &&
    Math.abs(cell[1] - other[1]) <= 1
  );
}

function countLiveNeighbors(cells: Cell[], cell: Cell): number {
  return cells.filter((other) => isNeighbor(cell, other)).length;
}

const MIN_NEIGHBORS_TO_SURVIVE = 2;
const NEIGHBORS_TO_REPRODUCE = 3;

function survives(liveNeighbors: number): boolean {
  return (
    liveNeighbors === MIN_NEIGHBORS_TO_SURVIVE ||
    liveNeighbors === NEIGHBORS_TO_REPRODUCE
  );
}

function isBornByReproduction(liveNeighbors: number): boolean {
  return liveNeighbors === NEIGHBORS_TO_REPRODUCE;
}

function isAlive(cells: Cell[], cell: Cell): boolean {
  return cells.some((other) => sameCell(cell, other));
}

const OFFSETS = [-1, 0, 1];

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function neighborhood([x, y]: Cell): Cell[] {
  return OFFSETS.flatMap((dx) => OFFSETS.map((dy): Cell => [x + dx, y + dy]));
}

function candidateCells(cells: Cell[]): Cell[] {
  const seen = new Map<string, Cell>();
  for (const candidate of cells.flatMap(neighborhood)) {
    seen.set(cellKey(candidate), candidate);
  }
  return [...seen.values()];
}

/**
 * Computes the next generation of live cells from the current live cells,
 * applying Conway's rules.
 */
export function nextGeneration(cells: Cell[]): Cell[] {
  return candidateCells(cells).filter((cell) => {
    const liveNeighbors = countLiveNeighbors(cells, cell);
    return isAlive(cells, cell)
      ? survives(liveNeighbors)
      : isBornByReproduction(liveNeighbors);
  });
}
