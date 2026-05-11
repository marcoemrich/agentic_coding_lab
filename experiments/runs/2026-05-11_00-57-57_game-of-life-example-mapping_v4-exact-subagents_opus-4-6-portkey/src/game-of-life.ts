export type Cell = [number, number];

const offsets = [-1, 0, 1] as const;

const neighborPositions = ([x, y]: Cell): Cell[] =>
  offsets.flatMap((dx) =>
    offsets
      .filter((dy) => dx !== 0 || dy !== 0)
      .map((dy): Cell => [x + dx, y + dy])
  );

const isAlive = ([cx, cy]: Cell, liveCells: Cell[]): boolean =>
  liveCells.some(([lx, ly]) => lx === cx && ly === cy);

const countLiveNeighbors = (cell: Cell, liveCells: Cell[]): number =>
  neighborPositions(cell).filter((neighbor) => isAlive(neighbor, liveCells)).length;

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const findDeadNeighbors = (liveCells: Cell[]): Cell[] => {
  const seen = new Map<string, Cell>();
  for (const cell of liveCells) {
    for (const neighbor of neighborPositions(cell)) {
      const key = cellKey(neighbor);
      if (!seen.has(key) && !isAlive(neighbor, liveCells)) {
        seen.set(key, neighbor);
      }
    }
  }
  return [...seen.values()];
};

export const nextGeneration = (liveCells: Cell[]): Cell[] => {
  const survivors = liveCells.filter((cell) => {
    const neighbors = countLiveNeighbors(cell, liveCells);
    return neighbors === 2 || neighbors === 3;
  });

  const born = findDeadNeighbors(liveCells).filter(
    (cell) => countLiveNeighbors(cell, liveCells) === 3
  );

  return [...survivors, ...born];
};
