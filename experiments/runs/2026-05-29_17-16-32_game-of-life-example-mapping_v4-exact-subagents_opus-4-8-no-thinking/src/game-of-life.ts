export type Cell = [number, number];

function cellsEqual(cell: Cell, other: Cell): boolean {
  return other[0] === cell[0] && other[1] === cell[1];
}

function isNeighbor(cell: Cell, other: Cell): boolean {
  return (
    !cellsEqual(cell, other) &&
    Math.abs(other[0] - cell[0]) <= 1 &&
    Math.abs(other[1] - cell[1]) <= 1
  );
}

function countNeighbors(cell: Cell, cells: Cell[]): number {
  return cells.filter((other) => isNeighbor(cell, other)).length;
}

function isLive(cell: Cell, cells: Cell[]): boolean {
  return cells.some((other) => cellsEqual(cell, other));
}

function neighborsOf(cell: Cell): Cell[] {
  const offsets = [-1, 0, 1];
  return offsets.flatMap((dx) =>
    offsets
      .filter((dy) => dx !== 0 || dy !== 0)
      .map((dy): Cell => [cell[0] + dx, cell[1] + dy]),
  );
}

function deadNeighborCandidates(cells: Cell[]): Cell[] {
  const candidates: Cell[] = [];
  for (const cell of cells) {
    for (const neighbor of neighborsOf(cell)) {
      const isDead = !isLive(neighbor, cells);
      const isNew = !isLive(neighbor, candidates);
      if (isDead && isNew) candidates.push(neighbor);
    }
  }
  return candidates;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const survivors = cells.filter((cell) => {
    const neighborCount = countNeighbors(cell, cells);
    return neighborCount === 2 || neighborCount === 3;
  });

  const births = deadNeighborCandidates(cells).filter(
    (candidate) => countNeighbors(candidate, cells) === 3,
  );

  return [...survivors, ...births];
}
