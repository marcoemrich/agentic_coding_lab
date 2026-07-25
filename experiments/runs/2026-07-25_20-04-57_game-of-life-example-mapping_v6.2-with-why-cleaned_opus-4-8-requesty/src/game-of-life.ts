type Cell = [number, number]; // [x, y]

function cellEquals([x, y]: Cell, [otherX, otherY]: Cell): boolean {
  return x === otherX && y === otherY;
}

function contains(cells: Cell[], cell: Cell): boolean {
  return cells.some((other) => cellEquals(cell, other));
}

function neighborsOf([x, y]: Cell): Cell[] {
  const neighbors: Cell[] = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx !== 0 || dy !== 0) {
        neighbors.push([x + dx, y + dy]);
      }
    }
  }
  return neighbors;
}

function countLiveNeighbors(cell: Cell, liveCells: Cell[]): number {
  return neighborsOf(cell).filter((neighbor) => contains(liveCells, neighbor))
    .length;
}

function survives(cell: Cell, liveCells: Cell[]): boolean {
  const liveNeighbors = countLiveNeighbors(cell, liveCells);
  return liveNeighbors === 2 || liveNeighbors === 3;
}

function isBorn(cell: Cell, liveCells: Cell[]): boolean {
  return countLiveNeighbors(cell, liveCells) === 3;
}

function uniqueCells(cells: Cell[]): Cell[] {
  return cells.filter(
    (cell, index) => cells.findIndex((other) => cellEquals(cell, other)) === index
  );
}

function deadNeighborsOfLiveCells(liveCells: Cell[]): Cell[] {
  const allNeighbors = liveCells.flatMap(neighborsOf);
  const deadNeighbors = allNeighbors.filter((cell) => !contains(liveCells, cell));
  return uniqueCells(deadNeighbors);
}

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const survivors = liveCells.filter((cell) => survives(cell, liveCells));
  const born = deadNeighborsOfLiveCells(liveCells).filter((cell) =>
    isBorn(cell, liveCells)
  );
  return [...survivors, ...born];
}
