type Cell = [number, number];

export const nextGeneration = (cells: Cell[]): Cell[] => {
  const survivors = cells.filter((cell) => {
    const n = countNeighbors(cells, cell);
    return n === 2 || n === 3;
  });

  const deadNeighbors = cells
    .flatMap(neighborsOf)
    .filter(([cx, cy]) => !cells.some(([x, y]) => x === cx && y === cy));

  const born = deadNeighbors.filter(([cx, cy], i, arr) =>
    arr.findIndex(([ax, ay]) => ax === cx && ay === cy) === i &&
    countNeighbors(cells, [cx, cy]) === 3
  );

  return [...survivors, ...born];
};

const neighborsOf = ([x, y]: Cell): Cell[] => {
  const result: Cell[] = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx !== 0 || dy !== 0) result.push([x + dx, y + dy]);
    }
  }
  return result;
};

const countNeighbors = (cells: Cell[], cell: Cell): number =>
  neighborsOf(cell).filter(([nx, ny]) => cells.some(([x, y]) => x === nx && y === ny)).length;
