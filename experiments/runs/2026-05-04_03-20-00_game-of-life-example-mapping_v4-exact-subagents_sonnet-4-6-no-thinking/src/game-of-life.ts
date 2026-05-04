type Cell = [number, number];

const cellKey = (cell: Cell): string => `${cell[0]},${cell[1]}`;

const getSurroundingCells = (cell: Cell): Cell[] =>
  [-1, 0, 1].flatMap((dx) =>
    [-1, 0, 1]
      .filter((dy) => dx !== 0 || dy !== 0)
      .map((dy): Cell => [cell[0] + dx, cell[1] + dy])
  );

const countNeighbors = (cell: Cell, cells: Cell[]): number => {
  const neighborKeys = new Set(getSurroundingCells(cell).map(cellKey));
  return cells.filter((candidate) => neighborKeys.has(cellKey(candidate))).length;
};

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveKeys = new Set(cells.map(cellKey));

  const survivors = cells.filter((cell) =>
    [2, 3].includes(countNeighbors(cell, cells))
  );

  const deadCandidates = new Map<string, Cell>();
  for (const cell of cells) {
    for (const neighbor of getSurroundingCells(cell)) {
      const key = cellKey(neighbor);
      if (!liveKeys.has(key) && !deadCandidates.has(key)) {
        deadCandidates.set(key, neighbor);
      }
    }
  }

  const born = [...deadCandidates.values()].filter((cell) => countNeighbors(cell, cells) === 3);

  return [...survivors, ...born];
}
