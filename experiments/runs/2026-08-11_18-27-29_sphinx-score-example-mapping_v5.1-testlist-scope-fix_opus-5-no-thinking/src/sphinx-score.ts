export type Monster =
  | "sphinx"
  | "undead-warrior"
  | "zombie"
  | "hydra"
  | "cyclops"
  | "orthrus"
  | "chimera";

export type Card = {
  monster: Monster;
  rank?: number;
};

const SPHINX: Monster = "sphinx";

export function scoreArmy(army: Card[]): number {
  return army
    .filter((card) => card.monster === SPHINX)
    .map((sphinx) => scoreSphinx(sphinx, army))
    .reduce((total, points) => total + points, 0);
}

/** "Sphinx — 1 point. 2 per type beyond three, else 1." */
function scoreSphinx(sphinx: Card, army: Card[]): number {
  const typesSeen = new Set(
    army.filter((card) => card !== sphinx).map((card) => card.monster),
  ).size;
  return 1 + (typesSeen > 3 ? 2 * (typesSeen - 3) : 1);
}
