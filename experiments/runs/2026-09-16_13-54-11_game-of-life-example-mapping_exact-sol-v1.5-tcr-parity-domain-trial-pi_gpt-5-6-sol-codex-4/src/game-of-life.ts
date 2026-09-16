export type Cell = [number, number];

const MINIMUM_SURVIVING_NEIGHBORS = 2;
const MAXIMUM_SURVIVING_NEIGHBORS = 3;
const REPRODUCTION_NEIGHBORS = 3;
const coordinateKey = ([x, y]: Cell): string => `${x},${y}`;

function countLiveNeighbors([x, y]: Cell, livingCells: Set<string>): number {
  let count = 0;
  for (let xOffset = -1; xOffset <= 1; xOffset += 1) {
    for (let yOffset = -1; yOffset <= 1; yOffset += 1) {
      if ((xOffset !== 0 || yOffset !== 0) && livingCells.has(`${x + xOffset},${y + yOffset}`)) {
        count += 1;
      }
    }
  }
  return count;
}

function survives(neighborCount: number): boolean {
  return neighborCount >= MINIMUM_SURVIVING_NEIGHBORS && neighborCount <= MAXIMUM_SURVIVING_NEIGHBORS;
}

function reproduces(neighborCount: number): boolean {
  return neighborCount === REPRODUCTION_NEIGHBORS;
}

function findBirths(cells: Cell[], livingCells: Set<string>): Cell[] {
  const candidates = new Map<string, Cell>();
  for (const [x, y] of cells) {
    for (let xOffset = -1; xOffset <= 1; xOffset += 1) {
      for (let yOffset = -1; yOffset <= 1; yOffset += 1) {
        const candidate: Cell = [x + xOffset, y + yOffset];
        candidates.set(coordinateKey(candidate), candidate);
      }
    }
  }
  return [...candidates.values()].filter((cell) =>
    !livingCells.has(coordinateKey(cell)) && reproduces(countLiveNeighbors(cell, livingCells)));
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const livingCells = new Set(cells.map(coordinateKey));
  const survivors = cells.filter((cell) => survives(countLiveNeighbors(cell, livingCells)));
  return [...survivors, ...findBirths(cells, livingCells)];
}
