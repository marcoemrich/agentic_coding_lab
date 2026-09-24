export type Cell = [number, number];

const MINIMUM_SURVIVAL_NEIGHBORS = 2;
const MAXIMUM_SURVIVAL_NEIGHBORS = 3;
const BIRTH_NEIGHBORS = 3;
const OFFSETS = [-1, 0, 1];

function areNeighbors([x, y]: Cell, [otherX, otherY]: Cell): boolean {
  return (x !== otherX || y !== otherY) &&
    Math.abs(x - otherX) <= 1 && Math.abs(y - otherY) <= 1;
}

function potentialCells(cells: Cell[]): Cell[] {
  const candidates = new Map<string, Cell>();
  for (const [x, y] of cells) {
    for (const dx of OFFSETS) {
      for (const dy of OFFSETS) {
        const candidate: Cell = [x + dx, y + dy];
        candidates.set(JSON.stringify(candidate), candidate);
      }
    }
  }
  return [...candidates.values()];
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(cell => JSON.stringify(cell)));
  return potentialCells(cells).filter(cell => {
    const count = cells.filter(other => areNeighbors(cell, other)).length;
    if (living.has(JSON.stringify(cell))) {
      return count >= MINIMUM_SURVIVAL_NEIGHBORS && count <= MAXIMUM_SURVIVAL_NEIGHBORS;
    }
    return count === BIRTH_NEIGHBORS;
  });
}
