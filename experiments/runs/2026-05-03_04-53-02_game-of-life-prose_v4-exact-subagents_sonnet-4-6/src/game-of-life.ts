const getNeighbors = (cell: string): string[] => {
  const [x, y] = cell.split(",").map(Number);
  return [
    `${x - 1},${y - 1}`, `${x},${y - 1}`, `${x + 1},${y - 1}`,
    `${x - 1},${y}`,                        `${x + 1},${y}`,
    `${x - 1},${y + 1}`, `${x},${y + 1}`, `${x + 1},${y + 1}`,
  ];
};

const countLiveNeighbors = (cell: string, liveCells: Set<string>): number =>
  getNeighbors(cell).filter(neighbor => liveCells.has(neighbor)).length;

const getDeadNeighbors = (cells: Set<string>): Set<string> => {
  const deadNeighbors = new Set<string>();
  for (const cell of cells) {
    for (const neighbor of getNeighbors(cell)) {
      if (!cells.has(neighbor)) {
        deadNeighbors.add(neighbor);
      }
    }
  }
  return deadNeighbors;
};

export function nextGeneration(cells: Set<string>): Set<string> {
  const nextCells = new Set<string>();

  for (const cell of cells) {
    const liveNeighborCount = countLiveNeighbors(cell, cells);
    if (liveNeighborCount >= 2 && liveNeighborCount <= 3) {
      nextCells.add(cell);
    }
  }

  for (const birthCandidate of getDeadNeighbors(cells)) {
    if (countLiveNeighbors(birthCandidate, cells) === 3) {
      nextCells.add(birthCandidate);
    }
  }

  return nextCells;
}
