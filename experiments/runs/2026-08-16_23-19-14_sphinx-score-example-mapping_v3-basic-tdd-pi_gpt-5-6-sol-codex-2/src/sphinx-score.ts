const POINTS_PER_EXCESS_TYPE = 2;
const TYPE_THRESHOLD = 3;

export const MONSTERS = [
  "sphinx",
  "undead-warrior",
  "zombie",
  "hydra",
  "cyclops",
  "orthrus",
  "chimera",
] as const;

export type Monster = (typeof MONSTERS)[number];
export type UndeadWarriorRank = 1 | typeof POINTS_PER_EXCESS_TYPE | typeof TYPE_THRESHOLD;

export type Card =
  | { monster: "undead-warrior"; rank: UndeadWarriorRank }
  | { monster: Exclude<Monster, "undead-warrior">; rank?: never };

/** Returns only the points produced by Sphinx cards in the army. */
export function scoreSphinxes(army: readonly Card[]): number {
  const sphinxCount = army.filter(({ monster }) => monster === "sphinx").length;

  if (sphinxCount === 0) {
    return 0;
  }

  const armyTypeCount = new Set(army.map(({ monster }) => monster)).size;
  // A Sphinx looks at the other cards in the army. Its own card is not a
  // visible type, but the Sphinx type remains visible when there is another.
  const visibleTypeCount = armyTypeCount - (sphinxCount === 1 ? 1 : 0);
  const variablePoints = visibleTypeCount > TYPE_THRESHOLD
    ? POINTS_PER_EXCESS_TYPE * (visibleTypeCount - TYPE_THRESHOLD)
    : 1;

  return sphinxCount * (1 + variablePoints);
}
