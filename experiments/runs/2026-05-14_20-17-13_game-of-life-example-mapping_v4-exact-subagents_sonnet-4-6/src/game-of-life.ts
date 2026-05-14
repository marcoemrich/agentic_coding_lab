type Cell = [number, number];

const countNeighbors = (cell: Cell, cells: Cell[]): number =>
  cells.filter(
    ([cx, cy]) =>
      Math.abs(cx - cell[0]) <= 1 &&
      Math.abs(cy - cell[1]) <= 1 &&
      !(cx === cell[0] && cy === cell[1])
  ).length;

const neighborPositions = ([x, y]: Cell): Cell[] =>
  [-1, 0, 1]
    .flatMap((dx) => [-1, 0, 1].map((dy) => [x + dx, y + dy] as Cell))
    .filter(([nx, ny]) => nx !== x || ny !== y);

const isDeadCell = (cell: Cell, liveCells: Cell[]): boolean =>
  !liveCells.some(([lx, ly]) => lx === cell[0] && ly === cell[1]);

const deduplicate = (cells: Cell[]): Cell[] =>
  [...new Map(cells.map((c) => [`${c[0]},${c[1]}`, c])).values()];

export function nextGeneration(cells: Cell[]): Cell[] {
  const survivors = cells.filter((cell) => {
    const neighborCount = countNeighbors(cell, cells);
    return neighborCount === 2 || neighborCount === 3;
  });

  const birthCandidates = deduplicate(cells.flatMap(neighborPositions)).filter(
    (cell) => isDeadCell(cell, cells)
  );

  const born = birthCandidates.filter(
    (cell) => countNeighbors(cell, cells) === 3
  );

  return [...survivors, ...born];
}
