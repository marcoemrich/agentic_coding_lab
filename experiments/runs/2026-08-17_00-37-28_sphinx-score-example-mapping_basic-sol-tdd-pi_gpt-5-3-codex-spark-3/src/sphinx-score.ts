export type MonsterName =
  | "sphinx"
  | "undead-warrior"
  | "zombie"
  | "hydra"
  | "cyclops"
  | "orthrus"
  | "chimera";

export interface ArmyCard {
  monster: MonsterName;
  rank?: 1 | 2 | 3;
}

export interface ArmyInput {
  army: ArmyCard[];
}

const MIN_SCORE_PER_SPHINX = 2;

export const calculateSphinxScore = (input: ArmyInput): number => {
  const sphinxCount = input.army.filter((card) => card.monster === "sphinx").length;

  if (sphinxCount === 0) {
    return 0;
  }

  const monsterTypes = new Set(input.army.map((card) => card.monster));
  monsterTypes.delete("sphinx");

  const nonSphinxTypeCount = monsterTypes.size;

  const scorePerSphinx =
    nonSphinxTypeCount <= 2
      ? MIN_SCORE_PER_SPHINX
      : nonSphinxTypeCount <= 4
        ? 3
        : nonSphinxTypeCount;

  return sphinxCount * scorePerSphinx;
};
