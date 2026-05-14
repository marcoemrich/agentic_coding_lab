type Cell = [number, number];

const countLiveNeighbors = (cell: Cell, liveCells: Cell[]): number => {
  const [x, y] = cell;
  return liveCells.filter(([cx, cy]) =>
    Math.abs(cx - x) <= 1 && Math.abs(cy - y) <= 1 && (cx !== x || cy !== y)
  ).length;
};

const survives = (neighborCount: number): boolean =>
  neighborCount === 2 || neighborCount === 3;

const deltas = [-1, 0, 1];

const getNeighborPositions = ([x, y]: Cell): Cell[] =>
  deltas.flatMap((dx) =>
    deltas.filter((dy) => dx !== 0 || dy !== 0).map((dy) => [x + dx, y + dy] as Cell)
  );

const samePosition = ([ax, ay]: Cell, [bx, by]: Cell): boolean =>
  ax === bx && ay === by;

const isAlive = (cell: Cell, liveCells: Cell[]): boolean =>
  liveCells.some((liveCell) => samePosition(cell, liveCell));

const uniqueCells = (cells: Cell[]): Cell[] =>
  cells.filter((cell, index, arr) => arr.findIndex((other) => samePosition(cell, other)) === index);

export function nextGeneration(cells: Cell[]): Cell[] {
  const survivors = cells.filter((cell) => survives(countLiveNeighbors(cell, cells)));

  const deadNeighbors = uniqueCells(
    cells.flatMap(getNeighborPositions).filter((cell) => !isAlive(cell, cells))
  );
  const born = deadNeighbors.filter((cell) => countLiveNeighbors(cell, cells) === 3);

  return [...survivors, ...born];
}
