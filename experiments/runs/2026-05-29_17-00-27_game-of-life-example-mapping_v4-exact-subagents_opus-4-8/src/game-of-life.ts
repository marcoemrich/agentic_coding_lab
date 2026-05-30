type Cell = number[];

function sameCell(a: Cell, b: Cell): boolean {
  return a[0] === b[0] && a[1] === b[1];
}

function isNeighbor(a: Cell, b: Cell): boolean {
  return (
    !sameCell(a, b) && Math.abs(a[0] - b[0]) <= 1 && Math.abs(a[1] - b[1]) <= 1
  );
}

function countLiveNeighbors(cell: Cell, liveCells: Cell[]): number {
  return liveCells.filter((other) => isNeighbor(cell, other)).length;
}

function isLive(cell: Cell, liveCells: Cell[]): boolean {
  return liveCells.some((other) => sameCell(other, cell));
}

const offsets: Cell[] = [-1, 0, 1].flatMap((dx) =>
  [-1, 0, 1].map((dy) => [dx, dy]),
);

function neighborhood(cell: Cell): Cell[] {
  return offsets.map(([dx, dy]) => [cell[0] + dx, cell[1] + dy]);
}

function candidateCells(liveCells: Cell[]): Cell[] {
  const byKey = new Map<string, Cell>();
  for (const cell of liveCells) {
    for (const candidate of neighborhood(cell)) {
      byKey.set(candidate.join(","), candidate);
    }
  }
  return [...byKey.values()];
}

export function nextGeneration(liveCells: Cell[]): Cell[] {
  return candidateCells(liveCells).filter((cell) => {
    const liveNeighbors = countLiveNeighbors(cell, liveCells);
    if (isLive(cell, liveCells)) {
      return liveNeighbors === 2 || liveNeighbors === 3;
    }
    return liveNeighbors === 3;
  });
}
