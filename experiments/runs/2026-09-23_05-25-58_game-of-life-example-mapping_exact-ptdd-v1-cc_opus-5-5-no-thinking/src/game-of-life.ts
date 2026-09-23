export type Cell = [number, number];

type Population = Set<string>;

const UNDERPOPULATION_LIMIT = 2;
const OVERPOPULATION_LIMIT = 3;
const REPRODUCTION_NEIGHBORS = 3;

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] => {
  const neighbors: Cell[] = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx !== 0 || dy !== 0) neighbors.push([x + dx, y + dy]);
    }
  }
  return neighbors;
};

const countLiveNeighbors = (population: Population, cell: Cell): number =>
  neighborsOf(cell).filter((neighbor) => population.has(cellKey(neighbor))).length;

const isUnderpopulated = (liveNeighbors: number): boolean => liveNeighbors < UNDERPOPULATION_LIMIT;

const isOverpopulated = (liveNeighbors: number): boolean => liveNeighbors > OVERPOPULATION_LIMIT;

const survives = (liveNeighbors: number): boolean =>
  !isUnderpopulated(liveNeighbors) && !isOverpopulated(liveNeighbors);

const isBorn = (liveNeighbors: number): boolean => liveNeighbors === REPRODUCTION_NEIGHBORS;

const deadNeighborsOf = (population: Population, cells: Cell[]): Cell[] => {
  const deadNeighbors = new Map<string, Cell>();
  for (const neighbor of cells.flatMap(neighborsOf)) {
    const key = cellKey(neighbor);
    if (!population.has(key)) deadNeighbors.set(key, neighbor);
  }
  return [...deadNeighbors.values()];
};

export function nextGeneration(cells: Cell[]): Cell[] {
  const population: Population = new Set(cells.map(cellKey));
  const survivors = cells.filter((cell) => survives(countLiveNeighbors(population, cell)));
  const births = deadNeighborsOf(population, cells).filter((cell) =>
    isBorn(countLiveNeighbors(population, cell)),
  );
  return [...survivors, ...births];
}
