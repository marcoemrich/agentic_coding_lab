export type Cell = [number, number];

function cellEquals(a: Cell, b: Cell): boolean {
  return a[0] === b[0] && a[1] === b[1];
}

function isNeighbor(a: Cell, b: Cell): boolean {
  const rowDistance = Math.abs(a[0] - b[0]);
  const colDistance = Math.abs(a[1] - b[1]);
  const isWithinOneStep = rowDistance <= 1 && colDistance <= 1;
  return !cellEquals(a, b) && isWithinOneStep;
}

function neighborsOf(cell: Cell): Cell[] {
  const neighbors: Cell[] = [];
  for (let dRow = -1; dRow <= 1; dRow++) {
    for (let dCol = -1; dCol <= 1; dCol++) {
      if (dRow !== 0 || dCol !== 0) {
        neighbors.push([cell[0] + dRow, cell[1] + dCol]);
      }
    }
  }
  return neighbors;
}

function dedupeCells(cells: Cell[]): Cell[] {
  return cells.filter(
    (cell, index) =>
      cells.findIndex((other) => cellEquals(other, cell)) === index
  );
}

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const countLiveNeighbors = (cell: Cell): number =>
    liveCells.filter((other) => isNeighbor(other, cell)).length;

  const isLive = (cell: Cell): boolean =>
    liveCells.some((other) => cellEquals(other, cell));

  const survivors = liveCells.filter((cell) => {
    const liveNeighbors = countLiveNeighbors(cell);
    return liveNeighbors === 2 || liveNeighbors === 3;
  });

  const deadNeighbors = dedupeCells(liveCells.flatMap(neighborsOf)).filter(
    (cell) => !isLive(cell)
  );

  const births = deadNeighbors.filter(
    (cell) => countLiveNeighbors(cell) === 3
  );

  return [...survivors, ...births];
}
