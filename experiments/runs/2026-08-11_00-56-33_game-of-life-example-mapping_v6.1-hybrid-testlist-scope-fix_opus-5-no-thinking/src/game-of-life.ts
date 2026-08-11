export type Cell = [number, number];

function keyOf([x, y]: Cell): string {
  return `${x},${y}`;
}

function neighborsOf([x, y]: Cell): Cell[] {
  const offsets = [-1, 0, 1];
  return offsets.flatMap((dx) =>
    offsets
      .filter((dy) => !(dx === 0 && dy === 0))
      .map((dy): Cell => [x + dx, y + dy]),
  );
}

function isAlive(cell: Cell, liveKeys: Set<string>): boolean {
  return liveKeys.has(keyOf(cell));
}

function countLiveNeighbors(cell: Cell, liveKeys: Set<string>): number {
  return neighborsOf(cell).filter((neighbor) => isAlive(neighbor, liveKeys))
    .length;
}

const MIN_NEIGHBORS_TO_SURVIVE = 2;
const NEIGHBORS_TO_REPRODUCE = 3;

function willBeAlive(
  isCurrentlyAlive: boolean,
  liveNeighborCount: number,
): boolean {
  return isCurrentlyAlive
    ? liveNeighborCount === MIN_NEIGHBORS_TO_SURVIVE ||
        liveNeighborCount === NEIGHBORS_TO_REPRODUCE
    : liveNeighborCount === NEIGHBORS_TO_REPRODUCE;
}

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveKeys = new Set(liveCells.map(keyOf));
  const candidates = new Map<string, Cell>(
    [...liveCells, ...liveCells.flatMap(neighborsOf)].map((cell) => [
      keyOf(cell),
      cell,
    ]),
  );
  return [...candidates.values()].filter((cell) =>
    willBeAlive(isAlive(cell, liveKeys), countLiveNeighbors(cell, liveKeys)),
  );
}
