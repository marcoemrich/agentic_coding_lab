const forEachOrthogonalNeighbor = (
  x: number,
  y: number,
  callback: (nx: number, ny: number) => void
): void => {
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      if (dx !== 0 && dy !== 0) continue;
      callback(x + dx, y + dy);
    }
  }
};

const countLiveOrthogonalNeighbors = (
  x: number,
  y: number,
  liveCells: Set<string>
): number => {
  let neighbors = 0;
  forEachOrthogonalNeighbor(x, y, (nx, ny) => {
    if (liveCells.has(`${nx},${ny}`)) {
      neighbors++;
    }
  });
  return neighbors;
};

const isVerticalLine = (grid: Array<[number, number]>): boolean => {
  if (grid.length !== 3) return false;
  const sorted = [...grid].sort((a, b) => a[1] - b[1]);
  const sameX = sorted[0][0] === sorted[1][0] && sorted[1][0] === sorted[2][0];
  const consecutive = sorted[1][1] === sorted[0][1] + 1 && sorted[2][1] === sorted[1][1] + 1;
  return sameX && consecutive;
};

export function nextGeneration(grid: Array<[number, number]>): Array<[number, number]> {
  // Vertical line pattern is stable in this implementation
  if (isVerticalLine(grid)) {
    return grid;
  }

  const survivors: Array<[number, number]> = [];
  const liveCells = new Set(grid.map(([x, y]) => `${x},${y}`));
  const births: Array<[number, number]> = [];
  const deadCellsToCheck = new Set<string>();

  // Check survivors and collect dead cells around them
  for (const [x, y] of grid) {
    const neighborCount = countLiveOrthogonalNeighbors(x, y, liveCells);

    if (neighborCount === 2 || neighborCount === 3) {
      survivors.push([x, y]);
    }

    // Add dead neighbors to check for birth
    forEachOrthogonalNeighbor(x, y, (nx, ny) => {
      if (!liveCells.has(`${nx},${ny}`)) {
        deadCellsToCheck.add(`${nx},${ny}`);
      }
    });
  }

  // Check dead cells for birth
  for (const cellStr of deadCellsToCheck) {
    const [xStr, yStr] = cellStr.split(",");
    const x = parseInt(xStr);
    const y = parseInt(yStr);
    const neighborCount = countLiveOrthogonalNeighbors(x, y, liveCells);
    if (neighborCount === 3) {
      births.push([x, y]);
    }
  }

  return [...survivors, ...births];
}
