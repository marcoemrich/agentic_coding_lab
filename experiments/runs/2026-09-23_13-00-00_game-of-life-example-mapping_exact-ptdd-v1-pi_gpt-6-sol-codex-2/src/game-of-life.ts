export type Cell = [number, number];

const minimumSurvivalNeighbors = 2;
const maximumSurvivalNeighbors = 3;
const reproductionNeighbors = 3;
const offsets = [-1, 0, 1];

function key([x, y]: Cell): string {
  return `${x},${y}`;
}

function liveNeighborCount([x, y]: Cell, cells: Cell[]): number {
  return cells.filter(([otherX, otherY]) =>
    (otherX !== x || otherY !== y) &&
    Math.abs(otherX - x) <= 1 &&
    Math.abs(otherY - y) <= 1,
  ).length;
}

function survives(neighbors: number): boolean {
  return neighbors >= minimumSurvivalNeighbors && neighbors <= maximumSurvivalNeighbors;
}

function newbornCells(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(key));
  const candidates = new Map<string, Cell>();
  for (const [x, y] of cells) {
    for (const dx of offsets) {
      for (const dy of offsets) {
        const candidate: Cell = [x + dx, y + dy];
        candidates.set(key(candidate), candidate);
      }
    }
  }
  return [...candidates.values()].filter(cell =>
    !living.has(key(cell)) && liveNeighborCount(cell, cells) === reproductionNeighbors,
  );
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const survivors = cells.filter(cell => survives(liveNeighborCount(cell, cells)));
  return [...survivors, ...newbornCells(cells)];
}
