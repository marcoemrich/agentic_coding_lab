export type Monster =
  | "sphinx"
  | "undead-warrior"
  | "zombie"
  | "hydra"
  | "cyclops"
  | "orthrus"
  | "chimera";

export type Card =
  // The numeric literals are the three variants defined by the game.
  // eslint-disable-next-line no-magic-numbers
  | { monster: "undead-warrior"; rank: 1 | 2 | 3 }
  | { monster: Exclude<Monster, "undead-warrior"> };

const TYPE_THRESHOLD = 3;
const BONUS_PER_EXTRA_TYPE = 2;
const BASE_POINTS = 1;
const FALLBACK_POINTS = 1;

/** Return the points produced by all Sphinx cards in an army. */
export function scoreSphinx(army: readonly Card[]): number {
  const sphinxCount = army.filter(({ monster }) => monster === "sphinx").length;
  if (sphinxCount === 0) return 0;

  // A Sphinx considers the other cards. Its own type therefore appears only
  // when the army contains another Sphinx.
  const visibleTypes = new Set(
    army
      .map(({ monster }) => monster)
      .filter((monster) => monster !== "sphinx" || sphinxCount > 1),
  ).size;

  const typeBonus = visibleTypes > TYPE_THRESHOLD
    ? BONUS_PER_EXTRA_TYPE * (visibleTypes - TYPE_THRESHOLD)
    : FALLBACK_POINTS;
  const pointsPerSphinx = BASE_POINTS + typeBonus;

  return sphinxCount * pointsPerSphinx;
}
