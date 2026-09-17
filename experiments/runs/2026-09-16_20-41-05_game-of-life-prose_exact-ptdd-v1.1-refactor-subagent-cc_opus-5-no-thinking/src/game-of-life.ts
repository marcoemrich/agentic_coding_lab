export type Cell = [number, number];

// --- Cell identity: when two coordinates name the same place on the grid ---

type Place = string;

function placeOf([x, y]: Cell): Place {
  return `${x},${y}`;
}

// --- Living population: how membership of the living set is decided ---

type LivingPopulation = {
  readonly cells: readonly Cell[];
  contains(cell: Cell): boolean;
};

function livingPopulationOf(cells: readonly Cell[]): LivingPopulation {
  const livingPlaces = new Set(cells.map(placeOf));
  return {
    cells,
    contains: (cell) => livingPlaces.has(placeOf(cell)),
  };
}

// --- Neighbourhood topology: which cells are adjacent on the unbounded grid ---

// A cell is not its own neighbour, so the zero offset is excluded and exactly
// the eight surrounding cells remain.
function isCellItself(dx: number, dy: number): boolean {
  return dx === 0 && dy === 0;
}

function neighboursOf([x, y]: Cell): Cell[] {
  const offsets = [-1, 0, 1];
  return offsets.flatMap((dx) =>
    offsets
      .filter((dy) => !isCellItself(dx, dy))
      .map((dy): Cell => [x + dx, y + dy]),
  );
}

function livingNeighbourCount(cell: Cell, living: LivingPopulation): number {
  return neighboursOf(cell).filter((neighbour) => living.contains(neighbour))
    .length;
}

// --- Vitality policy: how a living neighbour count decides life ---

const MIN_NEIGHBOURS_TO_SURVIVE = 2;
const MAX_NEIGHBOURS_TO_SURVIVE = 3;

function survivesWith(livingNeighbours: number): boolean {
  return (
    livingNeighbours >= MIN_NEIGHBOURS_TO_SURVIVE &&
    livingNeighbours <= MAX_NEIGHBOURS_TO_SURVIVE
  );
}

const NEIGHBOURS_TO_REPRODUCE = 3;

function isBornWith(livingNeighbours: number): boolean {
  return livingNeighbours === NEIGHBOURS_TO_REPRODUCE;
}

// --- Candidate enumeration and generation orchestration ---

// Keeps only the first occurrence of each place.
function distinctCells(cells: Cell[]): Cell[] {
  const seenPlaces = new Set<Place>();
  return cells.filter((cell) => {
    const place = placeOf(cell);
    if (seenPlaces.has(place)) return false;
    seenPlaces.add(place);
    return true;
  });
}

// Only dead cells touching a living cell can be born, so the infinite plane
// never has to be enumerated. One place is one birth candidate, however many
// living neighbourhoods name it.
function birthCandidatesOf(living: LivingPopulation): Cell[] {
  return distinctCells(
    living.cells.flatMap(neighboursOf).filter((cell) => !living.contains(cell)),
  );
}

function survivingCells(living: LivingPopulation): Cell[] {
  return living.cells.filter((cell) =>
    survivesWith(livingNeighbourCount(cell, living)),
  );
}

function bornCells(living: LivingPopulation): Cell[] {
  return birthCandidatesOf(living).filter((cell) =>
    isBornWith(livingNeighbourCount(cell, living)),
  );
}

export function nextGeneration(livingCells: Cell[]): Cell[] {
  const living = livingPopulationOf(livingCells);
  return [...survivingCells(living), ...bornCells(living)];
}
