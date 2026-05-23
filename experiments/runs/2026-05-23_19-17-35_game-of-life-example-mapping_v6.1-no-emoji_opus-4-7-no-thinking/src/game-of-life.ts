export type Cell = [number, number];

const cellToKey = ([x, y]: Cell): string => `${x},${y}`;
const keyToCell = (key: string): Cell => {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
};

const neighborOffsets: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

const countLiveNeighborsPerCell = (cells: Cell[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of neighborOffsets) {
      const key = cellToKey([x + dx, y + dy]);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return counts;
};

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveCellKeys = new Set(cells.map(cellToKey));
  const liveNeighborsByCell = countLiveNeighborsPerCell(cells);

  const nextCells: Cell[] = [];
  for (const [key, liveNeighbors] of liveNeighborsByCell) {
    const survives = liveCellKeys.has(key) && liveNeighbors === 2;
    const reproduces = liveNeighbors === 3;
    if (survives || reproduces) {
      nextCells.push(keyToCell(key));
    }
  }
  return nextCells;
}
