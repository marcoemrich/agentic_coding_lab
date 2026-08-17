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

export type Card = {
  monster: Monster;
  // eslint-disable-next-line no-magic-numbers -- Rank values are the normative schema.
  rank?: 1 | 2 | 3;
};

export type ArmyInput = {
  army: Card[];
};

export type ScoreOutput = {
  score: number;
};

const BASE_SPHINX_POINTS = 1;
const MINIMUM_TYPE_BONUS = 1;
const TYPES_BEFORE_SCALING = 3;
const POINTS_PER_TYPE_BEYOND_THREE = 2;

export const scoreSphinxes = (input: ArmyInput): ScoreOutput => {
  const distinctMonsterTypeCount = new Set(
    input.army.map(({ monster }) => monster),
  ).size;

  const sphinxCount = input.army.filter(
    ({ monster }) => monster === "sphinx",
  ).length;
  const otherTypeCountPerSphinx =
    distinctMonsterTypeCount - 1 + (sphinxCount - 1);
  const typeBonus = Math.max(
    MINIMUM_TYPE_BONUS,
    POINTS_PER_TYPE_BEYOND_THREE *
      (otherTypeCountPerSphinx - TYPES_BEFORE_SCALING),
  );

  return { score: sphinxCount * (BASE_SPHINX_POINTS + typeBonus) };
};
