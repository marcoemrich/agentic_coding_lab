export type Monster =
  | "sphinx"
  | "undead-warrior"
  | "zombie"
  | "hydra"
  | "cyclops"
  | "orthrus"
  | "chimera";

export interface Card {
  monster: Monster;
  // The literals are the normative card ranks from the input schema.
  // eslint-disable-next-line no-magic-numbers
  rank?: 1 | 2 | 3;
}

export interface ArmyDocument {
  army: Card[];
}

export interface ScoreDocument {
  score: number;
}

const PRINTED_POINT = 1;
const ONE_SPHINX_ALREADY_COUNTED = 1;
const FALLBACK_BONUS = 1;
const POINTS_PER_TYPE_BEYOND_THRESHOLD = 2;
const TYPE_THRESHOLD = 4;

export function scoreSphinxes(armyDocument: ArmyDocument): ScoreDocument {
  const monsterTypes = new Set(armyDocument.army.map(({ monster }) => monster));
  const sphinxCount = armyDocument.army.filter(({ monster }) => monster === "sphinx").length;
  if (sphinxCount === 0) return { score: 0 };
  const visibleTypeCount = monsterTypes.size + sphinxCount - ONE_SPHINX_ALREADY_COUNTED;
  const bonus = Math.max(
    FALLBACK_BONUS,
    POINTS_PER_TYPE_BEYOND_THRESHOLD * (visibleTypeCount - TYPE_THRESHOLD),
  );
  return { score: sphinxCount * (PRINTED_POINT + bonus) };
}
