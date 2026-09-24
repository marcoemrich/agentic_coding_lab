export type Cell = [number, number];

function areNeighbors([x, y]: Cell, [otherX, otherY]: Cell): boolean {
  return (otherX !== x || otherY !== y) &&
    Math.abs(otherX - x) <= 1 && Math.abs(otherY - y) <= 1;
}

function survives(count: number): boolean {
  const minimumSurvivalNeighbors = 2;
  const maximumSurvivalNeighbors = 3;
  return count >= minimumSurvivalNeighbors && count <= maximumSurvivalNeighbors;
}

function isBorn(cell: Cell, cells: Cell[]): boolean {
  const birthNeighbors = 3;
  return !cells.some((live) => live[0] === cell[0] && live[1] === cell[1]) &&
    cells.filter((live) => areNeighbors(cell, live)).length === birthNeighbors;
}

function neighborPositions([x, y]: Cell): Cell[] {
  const positions: Cell[] = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx !== 0 || dy !== 0) positions.push([x + dx, y + dy]);
    }
  }
  return positions;
}

function births(cells: Cell[]): Cell[] {
  const candidates = new Map<string, Cell>();
  for (const live of cells) {
    for (const cell of neighborPositions(live)) {
      candidates.set(`${cell[0]},${cell[1]}`, cell);
    }
  }
  return [...candidates.values()].filter((cell) => isBorn(cell, cells));
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = cells.filter((cell) => {
    const count = cells.filter((other) => areNeighbors(cell, other)).length;
    return survives(count);
  });
  return [...living, ...births(cells)];
}
