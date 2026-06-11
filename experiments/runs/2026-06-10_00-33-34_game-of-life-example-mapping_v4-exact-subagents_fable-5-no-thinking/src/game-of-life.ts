// game-of-life.ts
export type Cell = [number, number];

export const nextGeneration = (liveCells: Cell[]): Cell[] =>
  candidates(liveCells).filter((cell) => willBeAlive(cell, liveCells));

const willBeAlive = (cell: Cell, liveCells: Cell[]): boolean => {
  const liveNeighbors = countLiveNeighbors(cell, liveCells);
  return liveNeighbors === 3 || (liveNeighbors === 2 && isAlive(cell, liveCells));
};

const candidates = (liveCells: Cell[]): Cell[] => {
  const all = liveCells.flatMap((cell) => [cell, ...neighborsOf(cell)]);
  return all.filter(
    (cell, index) =>
      all.findIndex((other) => isSamePosition(other, cell)) === index
  );
};

const neighborsOf = ([x, y]: Cell): Cell[] =>
  [-1, 0, 1].flatMap((dx) =>
    [-1, 0, 1]
      .filter((dy) => !(dx === 0 && dy === 0))
      .map((dy): Cell => [x + dx, y + dy])
  );

const countLiveNeighbors = (cell: Cell, liveCells: Cell[]): number =>
  neighborsOf(cell).filter((neighbor) => isAlive(neighbor, liveCells)).length;

const isAlive = (cell: Cell, liveCells: Cell[]): boolean =>
  liveCells.some((liveCell) => isSamePosition(liveCell, cell));

const isSamePosition = ([ax, ay]: Cell, [bx, by]: Cell): boolean =>
  ax === bx && ay === by;
