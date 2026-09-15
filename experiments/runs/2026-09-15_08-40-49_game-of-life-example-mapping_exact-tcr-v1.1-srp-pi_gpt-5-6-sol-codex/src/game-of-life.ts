export type Cell = [number, number];

const SURVIVAL_NEIGHBORS = 2;
const REPRODUCTION_NEIGHBORS = 3;
const NEIGHBOR_OFFSETS = [-1, 0, 1];

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function areNeighbors([x, y]: Cell, [otherX, otherY]: Cell): boolean {
  return (
    (x !== otherX || y !== otherY) &&
    Math.abs(x - otherX) <= 1 &&
    Math.abs(y - otherY) <= 1
  );
}

function countLiveNeighbors(cell: Cell, cells: Cell[]): number {
  return cells.filter((otherCell) => areNeighbors(cell, otherCell)).length;
}

function candidateCells(cells: Cell[]): Cell[] {
  const candidates = new Map<string, Cell>();

  for (const [x, y] of cells) {
    for (const xOffset of NEIGHBOR_OFFSETS) {
      for (const yOffset of NEIGHBOR_OFFSETS) {
        const candidate: Cell = [x + xOffset, y + yOffset];
        candidates.set(cellKey(candidate), candidate);
      }
    }
  }

  return [...candidates.values()];
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const livingCellKeys = new Set(cells.map(cellKey));

  return candidateCells(cells).filter((cell) => {
    const liveNeighbors = countLiveNeighbors(cell, cells);

    return (
      liveNeighbors === REPRODUCTION_NEIGHBORS ||
      (livingCellKeys.has(cellKey(cell)) && liveNeighbors === SURVIVAL_NEIGHBORS)
    );
  });
}
