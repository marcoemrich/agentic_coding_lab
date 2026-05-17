export type Cell = [number, number];

const isNeighbor = (cell: Cell, other: Cell): boolean => {
  const [x, y] = cell;
  const [ox, oy] = other;
  const sameCell = ox === x && oy === y;
  return !sameCell && Math.abs(ox - x) <= 1 && Math.abs(oy - y) <= 1;
};

const countLiveNeighbors = (cell: Cell, cells: Cell[]): number =>
  cells.filter((other) => isNeighbor(cell, other)).length;

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const deadNeighborCandidates = (cells: Cell[]): Cell[] => {
  const candidates: Cell[] = [];
  const seen = new Set<string>();
  const liveKeys = new Set(cells.map(cellKey));
  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const neighbor: Cell = [x + dx, y + dy];
        const key = cellKey(neighbor);
        if (liveKeys.has(key) || seen.has(key)) continue;
        seen.add(key);
        candidates.push(neighbor);
      }
    }
  }
  return candidates;
};

const isAlive = (cell: Cell, liveCells: Cell[]): boolean =>
  liveCells.some((other) => other[0] === cell[0] && other[1] === cell[1]);

const survivesOrIsBorn = (cell: Cell, liveCells: Cell[]): boolean => {
  const count = countLiveNeighbors(cell, liveCells);
  return count === 3 || (count === 2 && isAlive(cell, liveCells));
};

export const nextGeneration = (cells: Cell[]): Cell[] => {
  const candidates = [...cells, ...deadNeighborCandidates(cells)];
  return candidates.filter((cell) => survivesOrIsBorn(cell, cells));
};
