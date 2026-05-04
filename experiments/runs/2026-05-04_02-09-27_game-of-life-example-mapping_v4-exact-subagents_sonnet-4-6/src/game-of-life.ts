const countNeighbors = (cell: number[], livingCells: number[][]): number => {
  const [x, y] = cell;
  return livingCells.filter(
    ([cx, cy]) =>
      Math.abs(cx - x) <= 1 &&
      Math.abs(cy - y) <= 1 &&
      !(cx === x && cy === y)
  ).length;
};

const isAlive = ([x, y]: number[], livingCells: number[][]): boolean =>
  livingCells.some(([cx, cy]) => cx === x && cy === y);

const neighborOffsets = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

const getDeadNeighbors = (livingCells: number[][]): number[][] => {
  const seen = new Set<string>();
  return livingCells.flatMap(([x, y]) =>
    neighborOffsets
      .map(([dx, dy]) => [x + dx, y + dy])
      .filter((cell) => {
        const key = cell.join(",");
        if (isAlive(cell, livingCells) || seen.has(key)) return false;
        seen.add(key);
        return true;
      })
  );
};

export const nextGeneration = (livingCells: number[][]): number[][] => {
  const survivors = livingCells.filter((cell) => {
    const neighborCount = countNeighbors(cell, livingCells);
    return neighborCount === 2 || neighborCount === 3;
  });

  const newborns = getDeadNeighbors(livingCells).filter(
    (cell) => countNeighbors(cell, livingCells) === 3
  );

  return [...survivors, ...newborns].sort(([ax, ay], [bx, by]) =>
    ay !== by ? ay - by : ax - bx
  );
};
