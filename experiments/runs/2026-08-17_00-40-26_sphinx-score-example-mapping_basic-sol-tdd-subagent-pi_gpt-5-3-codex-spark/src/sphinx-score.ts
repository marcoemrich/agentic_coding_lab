export type ArmyCard = {
  monster: string;
  rank?: number;
};

export type Army = {
  army: ArmyCard[];
};

const SPHINX_NAME = "sphinx";
const SCORE_PER_SPHINX_BY_DISTINCT_MONSTER_TYPES: Record<number, number> = {
  3: 2,
  4: 3,
  5: 3,
  6: 5,
};

export function scoreSphinxArmy({ army }: Army): number {
  const sphinxCardCount = army.filter((card) => card.monster === SPHINX_NAME).length;
  const distinctMonsterTypeCount = new Set(army.map((card) => card.monster)).size;
  const scorePerSphinxCard = SCORE_PER_SPHINX_BY_DISTINCT_MONSTER_TYPES[distinctMonsterTypeCount] ?? 1;

  return sphinxCardCount * scorePerSphinxCard;
}
