export type Cell = [number, number];

const MIN_LIVE_NEIGHBORS_FOR_SURVIVAL = 2;
const MAX_LIVE_NEIGHBORS_FOR_SURVIVAL = 3;
const LIVE_NEIGHBORS_FOR_REPRODUCTION = 3;

type IsAlive = (cell: Cell) => boolean;

export function nextGeneration(cells: Cell[]): Cell[] {
  const isAlive = livenessOf(cells);
  const survivors = cells.filter((cell) => survives(cell, isAlive));
  const born = reproductionCandidates(cells, isAlive).filter((cell) =>
    isBorn(cell, isAlive),
  );
  return [...survivors, ...born];
}

function livenessOf(cells: Cell[]): IsAlive {
  const living = new Set(cells.map(keyOf));
  return (cell) => living.has(keyOf(cell));
}

function survives(cell: Cell, isAlive: IsAlive): boolean {
  const liveNeighbors = countLiveNeighbors(cell, isAlive);
  return (
    liveNeighbors >= MIN_LIVE_NEIGHBORS_FOR_SURVIVAL &&
    liveNeighbors <= MAX_LIVE_NEIGHBORS_FOR_SURVIVAL
  );
}

function isBorn(cell: Cell, isAlive: IsAlive): boolean {
  return countLiveNeighbors(cell, isAlive) === LIVE_NEIGHBORS_FOR_REPRODUCTION;
}

function reproductionCandidates(livingCells: Cell[], isAlive: IsAlive): Cell[] {
  const candidates = new Map<string, Cell>();
  for (const cell of livingCells) {
    for (const neighbor of neighborsOf(cell)) {
      if (!isAlive(neighbor)) {
        candidates.set(keyOf(neighbor), neighbor);
      }
    }
  }
  return [...candidates.values()];
}

function neighborsOf([x, y]: Cell): Cell[] {
  const offsets = [-1, 0, 1];
  return offsets.flatMap((dx) =>
    offsets
      .filter((dy) => !(dx === 0 && dy === 0))
      .map((dy): Cell => [x + dx, y + dy]),
  );
}

function countLiveNeighbors(cell: Cell, isAlive: IsAlive): number {
  return neighborsOf(cell).filter(isAlive).length;
}

function keyOf([x, y]: Cell): string {
  return `${x},${y}`;
}
