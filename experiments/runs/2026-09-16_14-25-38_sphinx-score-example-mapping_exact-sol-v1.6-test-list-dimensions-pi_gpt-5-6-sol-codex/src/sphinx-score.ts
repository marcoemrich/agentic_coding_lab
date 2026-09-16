export type Monster =
  | "sphinx"
  | "undead-warrior"
  | "zombie"
  | "hydra"
  | "cyclops"
  | "orthrus"
  | "chimera";

const UNDEAD_WARRIOR_RANK_ONE = 1;
const UNDEAD_WARRIOR_RANK_TWO = 2;
const UNDEAD_WARRIOR_RANK_THREE = 3;

type UndeadWarriorRank =
  | typeof UNDEAD_WARRIOR_RANK_ONE
  | typeof UNDEAD_WARRIOR_RANK_TWO
  | typeof UNDEAD_WARRIOR_RANK_THREE;

export interface Card {
  monster: Monster;
  rank?: UndeadWarriorRank;
}

const SPHINX_BASE_POINTS = 1;
const ELSE_POINTS = 1;
const POINTS_PER_TYPE_BEYOND_THREE = 2;
const TYPE_ALLOWANCE_INCLUDING_SPHINX = 4;

function isSphinx({ monster }: Card): boolean {
  return monster === "sphinx";
}

function countSphinxCards(army: Card[]): number {
  return army.filter(isSphinx).length;
}

function countTypesSeenBySphinxes(army: Card[]): number {
  const otherMonsterTypes = new Set(
    army
      .filter((card) => !isSphinx(card))
      .map(({ monster }) => monster),
  );
  return countSphinxCards(army) + otherMonsterTypes.size;
}

function scoreOneSphinx(monsterTypeCount: number): number {
  const typesBeyondThree = monsterTypeCount - TYPE_ALLOWANCE_INCLUDING_SPHINX;
  const conditionalPoints = Math.max(
    ELSE_POINTS,
    typesBeyondThree * POINTS_PER_TYPE_BEYOND_THREE,
  );
  return SPHINX_BASE_POINTS + conditionalPoints;
}

export function scoreSphinx(army: Card[]): number {
  const sphinxCount = countSphinxCards(army);
  if (sphinxCount === 0) return 0;

  return sphinxCount * scoreOneSphinx(countTypesSeenBySphinxes(army));
}
