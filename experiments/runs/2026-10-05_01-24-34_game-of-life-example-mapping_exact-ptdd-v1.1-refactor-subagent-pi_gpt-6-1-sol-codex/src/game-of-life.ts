export type Cell = [number, number];

const neighborRadius = 1;

function cellKey(cell: Cell): string {
  return cell.join(",");
}

function areNeighbors([x, y]: Cell, [otherX, otherY]: Cell): boolean {
  return Math.abs(x - otherX) <= neighborRadius && Math.abs(y - otherY) <= neighborRadius &&
    (x !== otherX || y !== otherY);
}

function countLiveNeighbors(cell: Cell, cells: Cell[]): number {
  return cells.filter((otherCell) => areNeighbors(cell, otherCell)).length;
}

function survives(liveNeighbors: number): boolean {
  const minimumSurvivalNeighbors = 2;
  const maximumSurvivalNeighbors = 3;
  return liveNeighbors >= minimumSurvivalNeighbors && liveNeighbors <= maximumSurvivalNeighbors;
}

function reproduces(liveNeighbors: number): boolean {
  const reproductionNeighbors = 3;
  return liveNeighbors === reproductionNeighbors;
}

function reproductionCandidates([x, y]: Cell): Cell[] {
  const candidates: Cell[] = [];
  // Include the live cell itself to preserve the existing candidate traversal.
  for (let dx = -neighborRadius; dx <= neighborRadius; dx++) {
    for (let dy = -neighborRadius; dy <= neighborRadius; dy++) {
      candidates.push([x + dx, y + dy]);
    }
  }
  return candidates;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const result = new Map<string, Cell>();
  for (const cell of cells) {
    if (survives(countLiveNeighbors(cell, cells))) {
      result.set(cellKey(cell), cell);
    }
    for (const candidate of reproductionCandidates(cell)) {
      if (reproduces(countLiveNeighbors(candidate, cells))) {
        result.set(cellKey(candidate), candidate);
      }
    }
  }
  return [...result.values()];
}
